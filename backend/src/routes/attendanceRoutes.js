const express = require("express");
const attendanceController = require("../controllers/attendanceController");
const asyncHandler = require("../middleware/asyncHandler");
const validate = require("../middleware/validate");
const {
  markAttendanceSchema,
  attendanceHistoryParamsSchema,
} = require("../validators/attendanceValidation");

const router = express.Router();

router.post(
  "/",
  validate(markAttendanceSchema),
  asyncHandler(attendanceController.markAttendance)
);
router.get(
  "/:employeeId",
  validate(attendanceHistoryParamsSchema, "params"),
  asyncHandler(attendanceController.getAttendanceHistory)
);

module.exports = router;
