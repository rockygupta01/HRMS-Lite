const { z } = require("zod");

const createEmployeeSchema = z.object({
  employeeId: z
    .string({ required_error: "Employee ID is required" })
    .trim()
    .min(1, "Employee ID is required")
    .max(40, "Employee ID must be at most 40 characters"),
  fullName: z
    .string({ required_error: "Full name is required" })
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(120, "Full name must be at most 120 characters"),
  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Please provide a valid email address")
    .transform((value) => value.toLowerCase()),
  department: z
    .string({ required_error: "Department is required" })
    .trim()
    .min(2, "Department must be at least 2 characters")
    .max(80, "Department must be at most 80 characters"),
});

const deleteEmployeeParamsSchema = z.object({
  id: z.coerce
    .number({ required_error: "Employee id is required" })
    .int("Employee id must be an integer")
    .positive("Employee id must be positive"),
});

module.exports = {
  createEmployeeSchema,
  deleteEmployeeParamsSchema,
};
