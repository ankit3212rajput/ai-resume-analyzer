const mongoose = require("mongoose");
const ResumeAnalysis = require("../models/ResumeAnalysis");
const {
  analyzeResume,
  generateCoverLetter,
  matchResumeWithJob,
  normalizeCoverLetter,
  normalizeJobMatch,
  normalizeResumeAnalysis,
  normalizeRewrite,
  rewriteResumeBullet,
} = require("../services/openaiService");
const { parseResumeFile } = require("../services/resumeParser");
const {
  canRunResumeAnalysis,
  consumeResumeCheck,
  getUsageSnapshot,
  hasFeatureAccess,
  syncUsageWindow,
} = require("../utils/planConfig");
const { sanitizeMultilineText, sanitizePlainText } = require("../utils/sanitize");

function featureGuard(user, feature) {
  if (hasFeatureAccess(user.plan, feature)) {
    return null;
  }

  return {
    success: false,
    message:
      feature === "jobMatch"
        ? "Upgrade to Premium to use the job description match feature."
        : "Upgrade your plan to unlock this feature.",
  };
}

async function findResumeAnalysisById(ownerId, analysisId) {
  if (!analysisId || !mongoose.Types.ObjectId.isValid(analysisId)) {
    return null;
  }

  return ResumeAnalysis.findOne({
    _id: analysisId,
    user: ownerId,
    featureType: "resume",
  });
}

async function uploadResume(req, res) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please upload a PDF or DOCX resume file.",
    });
  }

  syncUsageWindow(req.user);
  const quota = canRunResumeAnalysis(req.user);

  if (!quota.allowed) {
    return res.status(403).json({
      success: false,
      message: "Free plan limit reached. Upgrade to continue analyzing resumes.",
      usage: quota.usage,
    });
  }

  const resumeText = await parseResumeFile(req.file);

  if (resumeText.length < 120) {
    return res.status(400).json({
      success: false,
      message: "The uploaded file does not contain enough readable resume text.",
    });
  }

  const rawAnalysis = await analyzeResume(resumeText);
  const analysis = normalizeResumeAnalysis(rawAnalysis);

  const savedAnalysis = await ResumeAnalysis.create({
    user: req.user._id,
    featureType: "resume",
    planAtExecution: req.user.plan,
    fileName: req.file.originalname,
    mimeType: req.file.mimetype,
    title: req.file.originalname,
    summary: analysis.improvementSuggestions[0] || "Resume analyzed successfully.",
    resumeText,
    scores: {
      overall: analysis.overallResumeScore,
      ats: analysis.atsCompatibilityScore,
    },
    strengths: analysis.resumeStrengths,
    weaknesses: analysis.resumeWeaknesses,
    missingSkills: analysis.missingSkills,
    grammarIssues: analysis.grammarIssues,
    keywordOptimization: analysis.keywordOptimization,
    improvementSuggestions: analysis.improvementSuggestions,
    rawResponse: rawAnalysis,
  });

  consumeResumeCheck(req.user);
  await req.user.save();

  return res.status(201).json({
    success: true,
    message: "Resume analyzed successfully",
    analysis: {
      id: savedAnalysis._id,
      fileName: savedAnalysis.fileName,
      ...analysis,
      usage: getUsageSnapshot(req.user),
    },
  });
}

async function getHistory(req, res) {
  const analyses = await ResumeAnalysis.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(30);

  return res.json({
    success: true,
    history: analyses,
    usage: getUsageSnapshot(req.user),
  });
}

async function jobMatch(req, res) {
  const planError = featureGuard(req.user, "jobMatch");
  if (planError) {
    return res.status(403).json(planError);
  }

  const jobDescription = sanitizeMultilineText(req.body.jobDescription, 12000);
  const analysisId = sanitizePlainText(req.body.analysisId, 100);
  let resumeText = sanitizeMultilineText(req.body.resumeText, 18000);

  if (!resumeText && analysisId) {
    const existingAnalysis = await findResumeAnalysisById(req.user._id, analysisId);
    resumeText = existingAnalysis?.resumeText || "";
  }

  if (!resumeText || !jobDescription) {
    return res.status(400).json({
      success: false,
      message: "Resume text and job description are required for job matching.",
    });
  }

  const rawMatch = await matchResumeWithJob(resumeText, jobDescription);
  const match = normalizeJobMatch(rawMatch);

  const saved = await ResumeAnalysis.create({
    user: req.user._id,
    featureType: "jobMatch",
    planAtExecution: req.user.plan,
    title: "Job match analysis",
    summary: `Matched against a target role with score ${match.jobMatchScore}/100.`,
    resumeText,
    jobDescription,
    scores: {
      jobMatch: match.jobMatchScore,
    },
    missingKeywords: match.missingKeywords,
    skillsGap: match.skillsGap,
    optimizationTips: match.resumeOptimizationTips,
    rawResponse: rawMatch,
  });

  return res.status(201).json({
    success: true,
    match: {
      id: saved._id,
      ...match,
    },
  });
}

async function rewriteBullet(req, res) {
  const planError = featureGuard(req.user, "resumeRewrite");
  if (planError) {
    return res.status(403).json(planError);
  }

  const bulletPoint = sanitizePlainText(req.body.bulletPoint, 300);

  if (!bulletPoint) {
    return res.status(400).json({
      success: false,
      message: "Please provide a resume bullet point to rewrite.",
    });
  }

  const rawRewrite = await rewriteResumeBullet(bulletPoint);
  const rewrite = normalizeRewrite(rawRewrite);

  const saved = await ResumeAnalysis.create({
    user: req.user._id,
    featureType: "rewrite",
    planAtExecution: req.user.plan,
    title: "Resume bullet rewrite",
    summary: rewrite.rewrittenBullet,
    inputText: rewrite.originalBullet,
    outputText: rewrite.rewrittenBullet,
    rawResponse: rawRewrite,
  });

  return res.status(201).json({
    success: true,
    rewrite: {
      id: saved._id,
      ...rewrite,
    },
  });
}

async function coverLetter(req, res) {
  const planError = featureGuard(req.user, "coverLetter");
  if (planError) {
    return res.status(403).json(planError);
  }

  const companyName = sanitizePlainText(req.body.companyName, 80);
  const jobTitle = sanitizePlainText(req.body.jobTitle, 80);
  const analysisId = sanitizePlainText(req.body.analysisId, 100);
  let resumeText = sanitizeMultilineText(req.body.resumeText, 12000);

  if (!resumeText && analysisId) {
    const existingAnalysis = await findResumeAnalysisById(req.user._id, analysisId);
    resumeText = existingAnalysis?.resumeText || "";
  }

  if (!companyName || !jobTitle || !resumeText) {
    return res.status(400).json({
      success: false,
      message: "Company name, job title, and resume context are required.",
    });
  }

  const rawLetter = await generateCoverLetter({ resumeText, companyName, jobTitle });
  const letter = normalizeCoverLetter(rawLetter);

  const saved = await ResumeAnalysis.create({
    user: req.user._id,
    featureType: "coverLetter",
    planAtExecution: req.user.plan,
    title: `${jobTitle} cover letter`,
    summary: `Cover letter generated for ${companyName}.`,
    resumeText,
    inputText: `${jobTitle} @ ${companyName}`,
    outputText: letter.coverLetter,
    rawResponse: rawLetter,
  });

  return res.status(201).json({
    success: true,
    coverLetter: {
      id: saved._id,
      ...letter,
    },
  });
}

module.exports = {
  coverLetter,
  getHistory,
  jobMatch,
  rewriteBullet,
  uploadResume,
};
