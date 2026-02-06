const express = require("express");
const employeeController = require("../controllers/employeeController");
const asyncHandler = require("../middleware/asyncHandler");
const validate = require("../middleware/validate");
const {
  createEmployeeSchema,
  deleteEmployeeParamsSchema,
} = require("../validators/employeeValidation");

const router = express.Router();

router.post(
  "/",
  validate(createEmployeeSchema),
  asyncHandler(employeeController.createEmployee)
);
router.get("/", asyncHandler(employeeController.getEmployees));
router.delete(
  "/:id",
  validate(deleteEmployeeParamsSchema, "params"),
  asyncHandler(employeeController.deleteEmployee)
);

module.exports = router;
