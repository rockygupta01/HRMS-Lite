const { Employee } = require("../models");
const AppError = require("../utils/AppError");

const createEmployee = async (payload) => {
  return Employee.create(payload);
};

const getEmployees = async () => {
  return Employee.findAll({
    order: [["createdAt", "DESC"]],
  });
};

const deleteEmployee = async (id) => {
  const existingEmployee = await Employee.findByPk(id);

  if (!existingEmployee) {
    throw new AppError(404, "Employee not found");
  }

  await existingEmployee.destroy();
};

module.exports = {
  createEmployee,
  getEmployees,
  deleteEmployee,
};
