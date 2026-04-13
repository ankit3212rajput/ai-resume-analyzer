const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");

const { sanitizeMultilineText } = require("../utils/sanitize");

async function parseResumeFile(file) {
  if (!file || !file.buffer) {
    throw new Error("Resume file is required");
  }

  let text = "";

  if (file.mimetype === "application/pdf") {
    const parsed = await pdfParse(file.buffer);
    text = parsed.text || "";
  } else if (
    file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const parsed = await mammoth.extractRawText({ buffer: file.buffer });
    text = parsed.value || "";
  } else {
    throw new Error("Unsupported file type");
  }

  return sanitizeMultilineText(text, 20000);
}

module.exports = {
  parseResumeFile,
};
