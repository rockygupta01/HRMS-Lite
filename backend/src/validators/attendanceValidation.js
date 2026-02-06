const { z } = require("zod");
const { isValidDateString } = require("../utils/date");

const markAttendanceSchema = z.object({
  employeeId: z.coerce
    .number({ required_error: "Employee is required" })
    .int("Employee id must be an integer")
    .positive("Employee id must be positive"),
  date: z
    .string({ required_error: "Date is required" })
    .trim()
    .refine((value) => isValidDateString(value), {
      message: "Date must be in YYYY-MM-DD format and be a valid date",
    }),
  status: z.enum(["Present", "Absent"], {
    required_error: "Status is required",
  }),
});

const attendanceHistoryParamsSchema = z.object({
  employeeId: z.coerce
    .number({ required_error: "Employee id is required" })
    .int("Employee id must be an integer")
    .positive("Employee id must be positive"),
});

module.exports = {
  markAttendanceSchema,
  attendanceHistoryParamsSchema,
};
