async function getTemplates(_req, res) {
  return res.json({
    success: true,
    templates: [
      {
        id: "modern-ats",
        name: "Modern ATS",
        description: "Clean single-column resume layout optimized for ATS parsing.",
        downloadUrl: "/templates/modern-ats-template.html",
      },
      {
        id: "executive-impact",
        name: "Executive Impact",
        description: "Results-driven resume template designed for senior roles.",
        downloadUrl: "/templates/executive-impact-template.html",
      },
      {
        id: "minimal-technical",
        name: "Minimal Technical",
        description: "Developer-friendly template with strong skills and projects sections.",
        downloadUrl: "/templates/minimal-technical-template.html",
      },
    ],
  });
}

module.exports = {
  getTemplates,
};
