import Head from "next/head";

const defaultDescription =
  "Upload your resume and get instant ATS scoring, AI-powered feedback, missing skills analysis, job match recommendations, and smart rewrite suggestions.";

export default function Seo({
  title = "AI Resume Analyzer Pro",
  description = defaultDescription,
  canonical = "",
  image = "/og-cover.svg",
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const finalCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;
  const imageUrl = image.startsWith("http") ? image : `${siteUrl}${image}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="resume analyzer, ATS score, AI resume review, resume rewrite, cover letter generator" />
      <link rel="canonical" href={finalCanonical} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:image" content={imageUrl} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
    </Head>
  );
}
