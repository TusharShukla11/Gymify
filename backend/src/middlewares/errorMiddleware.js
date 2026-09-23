function errorMiddleware(err, req, res, next) {
  console.error("ERROR:", err);

  // Invalid JSON
  if (err instanceof SyntaxError && err.status === 400 && err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON format."
    });
  }

  // MongoDB duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0];

    return res.status(409).json({
      success: false,
      message: `Duplicate value for field: ${field || "unknown field"}.`
    });
  }

  // MongoDB invalid ObjectId
  if (err.name === "BSONError" || err.name === "MongoServerError" && err.message?.includes("ObjectId")) {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format."
    });
  }

  // Default error
  const statusCode = err.statusCode || err.status || 500;

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Internal server error."
        : err.message
  });
}

module.exports = errorMiddleware;