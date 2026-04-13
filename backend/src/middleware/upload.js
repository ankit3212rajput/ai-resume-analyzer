const path = require("path");
const multer = require("multer");

const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const allowedExtensions = [".pdf", ".docx"];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, callback) => {
    const extension = path.extname(file.originalname || "").toLowerCase();
    const isMimeAllowed = allowedMimeTypes.includes(file.mimetype);
    const isExtensionAllowed = allowedExtensions.includes(extension);

    if (!isMimeAllowed || !isExtensionAllowed) {
      return callback(new Error("Only PDF and DOCX files up to 5MB are allowed."));
    }

    return callback(null, true);
  },
});

module.exports = upload;
