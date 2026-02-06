const {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError,
} = require("sequelize");
const AppError = require("../utils/AppError");

const notFoundHandler = (req, _res, next) => {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

const errorHandler = (error, _req, res, _next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "Internal server error";
  let details = error.details || null;

  if (error instanceof UniqueConstraintError) {
    statusCode = 409;
    const fields = error.errors.map((item) => item.path).filter(Boolean);
    message = `Duplicate value for unique field(s): ${fields.join(", ") || "resource"}`;
  } else if (error instanceof ForeignKeyConstraintError) {
    statusCode = 400;
    message = "Invalid reference in request data";
  } else if (error instanceof ValidationError) {
    statusCode = 400;
    message = "Validation error";
    details = error.errors.map((item) => ({
      field: item.path,
      message: item.message,
    }));
  }

  const response = {
    error: {
      message,
      details,
    },
  };

  if (process.env.NODE_ENV !== "production") {
    response.error.stack = error.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
