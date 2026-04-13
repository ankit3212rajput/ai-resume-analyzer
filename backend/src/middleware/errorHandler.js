const multer = require("multer");

function errorHandler(error, _req, res, _next) {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  const statusCode = error.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: error.message || "Something went wrong",
  });
}

module.exports = errorHandler;
