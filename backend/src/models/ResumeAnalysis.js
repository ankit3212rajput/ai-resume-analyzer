const mongoose = require("mongoose");

const resumeAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    featureType: {
      type: String,
      enum: ["resume", "jobMatch", "rewrite", "coverLetter"],
      required: true,
      index: true,
    },
    planAtExecution: {
      type: String,
      enum: ["free", "pro", "premium"],
      default: "free",
    },
    fileName: String,
    mimeType: String,
    title: String,
    summary: String,
    resumeText: String,
    jobDescription: String,
    scores: {
      overall: Number,
      ats: Number,
      jobMatch: Number,
    },
    strengths: [String],
    weaknesses: [String],
    missingSkills: [String],
    grammarIssues: [String],
    keywordOptimization: [String],
    improvementSuggestions: [String],
    missingKeywords: [String],
    skillsGap: [String],
    optimizationTips: [String],
    inputText: String,
    outputText: String,
    rawResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

resumeAnalysisSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.models.ResumeAnalysis || mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
