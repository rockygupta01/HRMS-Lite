const employeeService = require("../services/employeeService");
const { formatEmployee } = require("../utils/formatters");

const createEmployee = async (req, res) => {
  const employee = await employeeService.createEmployee(req.body);

  res.status(201).json({
    message: "Employee created successfully",
    data: formatEmployee(employee),
  });
};

const getEmployees = async (_req, res) => {
  const employees = await employeeService.getEmployees();

  res.status(200).json({
    message: "Employees fetched successfully",
    total: employees.length,
    data: employees.map(formatEmployee),
  });
};

const deleteEmployee = async (req, res) => {
  await employeeService.deleteEmployee(req.params.id);

  res.status(200).json({
    message: "Employee deleted successfully",
  });
};

module.exports = {
  createEmployee,
  getEmployees,
  deleteEmployee,
};
