const { Attendance, Employee } = require("../models");
const AppError = require("../utils/AppError");
const { parseDateStringToUTC } = require("../utils/date");

const markAttendance = async (payload) => {
  const employee = await Employee.findByPk(payload.employeeId);

  if (!employee) {
    throw new AppError(404, "Employee not found");
  }

  const parsedDate = parseDateStringToUTC(payload.date);

  if (!parsedDate) {
    throw new AppError(400, "Invalid date value");
  }

  const normalizedDate = parsedDate.toISOString().slice(0, 10);

  const duplicateAttendance = await Attendance.findOne({
    where: {
      employeeId: payload.employeeId,
      date: normalizedDate,
    },
  });

  if (duplicateAttendance) {
    throw new AppError(409, "Attendance is already marked for this employee on this date");
  }

  return Attendance.create({
    employeeId: payload.employeeId,
    date: normalizedDate,
    status: payload.status,
  });
};

const getAttendanceHistory = async (employeeId) => {
  const employee = await Employee.findByPk(employeeId);

  if (!employee) {
    throw new AppError(404, "Employee not found");
  }

  const attendance = await Attendance.findAll({
    where: {
      employeeId,
    },
    order: [["date", "DESC"]],
  });

  return {
    employee,
    attendance,
  };
};

module.exports = {
  markAttendance,
  getAttendanceHistory,
};
