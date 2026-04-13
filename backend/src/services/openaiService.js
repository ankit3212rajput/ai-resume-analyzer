const OpenAI = require("openai");

const env = require("../config/env");
const { sanitizeMultilineText, sanitizePlainText, toCleanStringArray, toScore } = require("../utils/sanitize");

const client = env.OPENAI_API_KEY ? new OpenAI({ apiKey: env.OPENAI_API_KEY }) : null;

function extractJsonFromText(value) {
  if (typeof value !== "string") {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch (_error) {
    const match = value.match(/\{[\s\S]*\}/);
    if (!match) {
      return null;
    }

    try {
      return JSON.parse(match[0]);
    } catch (_nestedError) {
      return null;
    }
  }
}

async function requestJsonResponse(systemPrompt, userPrompt) {
  if (!client) {
    return null;
  }

  const response = await client.chat.completions.create({
    model: env.OPENAI_MODEL,
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  return extractJsonFromText(response.choices?.[0]?.message?.content || "");
}

function getTopTerms(text, count = 8) {
  const stopWords = new Set([
    "with",
    "that",
    "this",
    "have",
    "from",
    "your",
    "their",
    "them",
    "into",
    "about",
    "using",
    "used",
    "team",
    "work",
    "resume",
    "experience",
    "skills",
    "years",
    "managed",
    "built",
    "project",
    "projects",
  ]);

  const counts = new Map();
  const matches = (text.toLowerCase().match(/[a-z][a-z-]{3,}/g) || []).filter((word) => !stopWords.has(word));

  for (const word of matches) {
    counts.set(word, (counts.get(word) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([word]) => word);
}

function heuristicResumeAnalysis(resumeText) {
  const text = sanitizeMultilineText(resumeText, 20000);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const hasExperience = /experience|employment|work history/i.test(text);
  const hasEducation = /education|university|college|degree/i.test(text);
  const hasSkills = /skills|technologies|tools/i.test(text);
  const hasMetrics = /\b\d+%|\b\d+\+|\$\d+/i.test(text);
  const topTerms = getTopTerms(text, 10);

  const overallScore = toScore(
    45 +
      (wordCount > 250 ? 10 : 0) +
      (hasMetrics ? 15 : 0) +
      (hasSkills ? 10 : 0) +
      (hasExperience ? 8 : 0) +
      (hasEducation ? 6 : 0)
  );
  const atsScore = toScore(
    42 + (hasExperience ? 12 : 0) + (hasSkills ? 15 : 0) + (hasEducation ? 8 : 0) + (wordCount > 220 ? 10 : 0)
  );

  return {
    overallResumeScore: overallScore,
    atsCompatibilityScore: atsScore,
    resumeStrengths: [
      hasMetrics ? "Includes measurable accomplishments that recruiters can quickly validate." : "Readable structure that can be improved with quantified impact.",
      hasSkills ? "Contains a dedicated skills section that helps ATS systems map relevant keywords." : "Core experience is present and can be strengthened with a clearer skills section.",
      wordCount > 250 ? "Provides enough context to demonstrate scope and responsibility." : "Concise format keeps the resume skimmable.",
    ],
    resumeWeaknesses: [
      hasMetrics ? "Some bullet points may still need stronger business outcomes." : "Too many bullets are likely missing metrics and outcome-driven language.",
      hasEducation ? "Section ordering may still need tuning for the target role." : "Education or credential details may be missing or too light.",
      topTerms.length < 6 ? "Keyword variety is limited and may reduce discoverability in ATS filters." : "Keyword coverage can be aligned more tightly to target job descriptions.",
    ],
    missingSkills: topTerms.slice(0, 5).length
      ? ["leadership", "stakeholder management", "data analysis", ...topTerms.slice(0, 2)]
      : ["leadership", "stakeholder management", "data analysis", "project delivery"],
    grammarIssues: [
      "Check for inconsistent verb tense between current and previous roles.",
      "Tighten long sentences to one achievement per bullet point.",
    ],
    keywordOptimization: topTerms.length
      ? topTerms.map((term) => `Consider reinforcing "${term}" in context with results and tools.`).slice(0, 6)
      : ["Add role-specific keywords from the job description into your skills and accomplishment bullets."],
    improvementSuggestions: [
      "Start bullets with strong action verbs and end with measurable results.",
      "Mirror high-priority keywords from the target job description.",
      "Group tools, platforms, and certifications into a dedicated ATS-friendly skills section.",
      "Keep the layout clean with standard headings such as Summary, Experience, Skills, and Education.",
    ],
  };
}

function heuristicJobMatch(resumeText, jobDescription) {
  const resumeTerms = new Set(getTopTerms(resumeText, 18));
  const jobTerms = getTopTerms(jobDescription, 18);
  const matched = jobTerms.filter((term) => resumeTerms.has(term));
  const missing = jobTerms.filter((term) => !resumeTerms.has(term));
  const score = toScore(jobTerms.length ? (matched.length / jobTerms.length) * 100 : 55);

  return {
    jobMatchScore: score,
    missingKeywords: missing.slice(0, 8),
    skillsGap: missing.slice(0, 5).map((term) => `Build evidence around ${term}.`),
    resumeOptimizationTips: [
      "Move the most relevant achievements closer to the top of the resume.",
      "Echo exact terminology from the job description where it honestly matches your experience.",
      "Use metrics to prove impact in the same domains the employer emphasizes.",
    ],
  };
}

function heuristicRewriteBullet(bulletPoint) {
  const cleaned = sanitizePlainText(bulletPoint, 300);
  const rewritten = cleaned
    ? `Led ${cleaned.charAt(0).toLowerCase()}${cleaned.slice(1)} while improving measurable business outcomes and cross-functional execution.`
    : "Led initiatives that improved measurable business outcomes and team efficiency.";

  return {
    originalBullet: cleaned,
    rewrittenBullet: rewritten,
    whyItWorks: [
      "Uses stronger action-oriented phrasing.",
      "Adds a clearer sense of ownership and outcome.",
      "Makes the bullet more compelling for recruiters and ATS keyword scans.",
    ],
  };
}

function heuristicCoverLetter({ companyName, jobTitle }) {
  const safeCompany = sanitizePlainText(companyName, 80) || "your company";
  const safeJobTitle = sanitizePlainText(jobTitle, 80) || "the role";

  return {
    coverLetter: `Dear Hiring Team,\n\nI am excited to apply for the ${safeJobTitle} position at ${safeCompany}. My background includes delivering measurable results, collaborating across teams, and translating complex work into clear business impact. I would welcome the opportunity to bring that same ownership, adaptability, and attention to detail to ${safeCompany}.\n\nAcross my recent experience, I have focused on improving execution quality, solving problems proactively, and communicating effectively with stakeholders. I am especially motivated by opportunities where thoughtful strategy and hands-on delivery both matter.\n\nThank you for your time and consideration. I would be glad to discuss how my experience can support ${safeCompany}'s goals.\n\nSincerely,\nYour Name`,
    highlights: ["Tailored intro for the role and company", "Professional structure with clear motivation", "Ready for manual personalization before sending"],
  };
}

async function analyzeResume(resumeText) {
  const safeResumeText = sanitizeMultilineText(resumeText, 18000);
  const userPrompt = `Analyze this resume and provide a detailed report including:

1. Overall Resume Score (0-100)
2. ATS Compatibility Score
3. Resume Strengths
4. Resume Weaknesses
5. Missing Skills
6. Grammar Issues
7. Keyword Optimization
8. Resume Improvement Suggestions

Return response in JSON format.

Resume:
${safeResumeText}`;

  const response =
    (await requestJsonResponse(
      "You are an expert resume reviewer. Return only valid JSON with concise, actionable advice.",
      userPrompt
    )) || heuristicResumeAnalysis(safeResumeText);

  return response;
}

async function matchResumeWithJob(resumeText, jobDescription) {
  const safeResumeText = sanitizeMultilineText(resumeText, 18000);
  const safeJobDescription = sanitizeMultilineText(jobDescription, 12000);

  const response =
    (await requestJsonResponse(
      "You compare resumes against job descriptions. Return only valid JSON.",
      `Compare this resume against the provided job description and return JSON with:
1. jobMatchScore (0-100)
2. missingKeywords (array)
3. skillsGap (array)
4. resumeOptimizationTips (array)

Resume:
${safeResumeText}

Job Description:
${safeJobDescription}`
    )) || heuristicJobMatch(safeResumeText, safeJobDescription);

  return response;
}

async function rewriteResumeBullet(bulletPoint) {
  const safeBullet = sanitizePlainText(bulletPoint, 300);

  const response =
    (await requestJsonResponse(
      "You rewrite resume bullets to sound stronger, more measurable, and more professional. Return only valid JSON.",
      `Rewrite this resume bullet point to sound stronger, more measurable, and more professional.

Return JSON with:
1. originalBullet
2. rewrittenBullet
3. whyItWorks (array)

Bullet:
${safeBullet}`
    )) || heuristicRewriteBullet(safeBullet);

  return response;
}

async function generateCoverLetter({ resumeText, companyName, jobTitle }) {
  const safeResumeText = sanitizeMultilineText(resumeText, 12000);
  const safeCompanyName = sanitizePlainText(companyName, 80);
  const safeJobTitle = sanitizePlainText(jobTitle, 80);

  const response =
    (await requestJsonResponse(
      "You create concise, professional cover letters. Return only valid JSON.",
      `Create a personalized cover letter for the following job application.

Return JSON with:
1. coverLetter
2. highlights (array)

Job Title: ${safeJobTitle}
Company Name: ${safeCompanyName}
Resume:
${safeResumeText}`
    )) || heuristicCoverLetter({ companyName: safeCompanyName, jobTitle: safeJobTitle });

  return response;
}

function normalizeResumeAnalysis(payload) {
  return {
    overallResumeScore: toScore(
      payload.overallResumeScore ?? payload.overallScore ?? payload.resumeScore ?? payload.score,
      68
    ),
    atsCompatibilityScore: toScore(payload.atsCompatibilityScore ?? payload.atsScore ?? payload.ats, 65),
    resumeStrengths: toCleanStringArray(payload.resumeStrengths ?? payload.strengths ?? []),
    resumeWeaknesses: toCleanStringArray(payload.resumeWeaknesses ?? payload.weaknesses ?? []),
    missingSkills: toCleanStringArray(payload.missingSkills ?? []),
    grammarIssues: toCleanStringArray(payload.grammarIssues ?? []),
    keywordOptimization: toCleanStringArray(payload.keywordOptimization ?? payload.keywords ?? []),
    improvementSuggestions: toCleanStringArray(
      payload.resumeImprovementSuggestions ?? payload.improvementSuggestions ?? payload.suggestions ?? []
    ),
  };
}

function normalizeJobMatch(payload) {
  return {
    jobMatchScore: toScore(payload.jobMatchScore ?? payload.matchScore ?? payload.score, 60),
    missingKeywords: toCleanStringArray(payload.missingKeywords ?? []),
    skillsGap: toCleanStringArray(payload.skillsGap ?? []),
    resumeOptimizationTips: toCleanStringArray(payload.resumeOptimizationTips ?? payload.optimizationTips ?? []),
  };
}

function normalizeRewrite(payload) {
  return {
    originalBullet: sanitizePlainText(payload.originalBullet ?? "", 300),
    rewrittenBullet: sanitizePlainText(payload.rewrittenBullet ?? payload.output ?? "", 420),
    whyItWorks: toCleanStringArray(payload.whyItWorks ?? payload.tips ?? []),
  };
}

function normalizeCoverLetter(payload) {
  return {
    coverLetter: sanitizeMultilineText(payload.coverLetter ?? payload.output ?? "", 4000),
    highlights: toCleanStringArray(payload.highlights ?? payload.tips ?? []),
  };
}

module.exports = {
  analyzeResume,
  generateCoverLetter,
  matchResumeWithJob,
  normalizeCoverLetter,
  normalizeJobMatch,
  normalizeResumeAnalysis,
  normalizeRewrite,
  rewriteResumeBullet,
};
