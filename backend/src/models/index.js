const sequelize = require("../config/database");
const Employee = require("./Employee");
const Attendance = require("./Attendance");

Employee.hasMany(Attendance, {
  foreignKey: "employeeId",
  as: "attendanceRecords",
  onDelete: "CASCADE",
  hooks: true,
});

Attendance.belongsTo(Employee, {
  foreignKey: "employeeId",
  as: "employee",
});

module.exports = {
  sequelize,
  Employee,
  Attendance,
};
