const { formatUTCDateToString } = require("./date");

const formatEmployee = (employee) => ({
  id: employee.id,
  employeeId: employee.employeeId,
  fullName: employee.fullName,
  email: employee.email,
  department: employee.department,
  createdAt: employee.createdAt,
});

const formatAttendance = (attendance) => ({
  id: attendance.id,
  employeeId: attendance.employeeId,
  date:
    typeof attendance.date === "string"
      ? attendance.date
      : formatUTCDateToString(attendance.date),
  status: attendance.status,
  createdAt: attendance.createdAt,
});

module.exports = {
  formatEmployee,
  formatAttendance,
};
