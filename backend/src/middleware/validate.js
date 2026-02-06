const AppError = require("../utils/AppError");

const validate = (schema, source = "body") => {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req[source]);

    if (!parsed.success) {
      const details = parsed.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));

      return next(new AppError(400, "Validation error", details));
    }

    req[source] = parsed.data;
    return next();
  };
};

module.exports = validate;
