const attendanceService = require("../services/attendanceService");
const { formatAttendance, formatEmployee } = require("../utils/formatters");

const markAttendance = async (req, res) => {
  const attendance = await attendanceService.markAttendance(req.body);

  res.status(201).json({
    message: "Attendance marked successfully",
    data: formatAttendance(attendance),
  });
};

const getAttendanceHistory = async (req, res) => {
  const result = await attendanceService.getAttendanceHistory(req.params.employeeId);

  res.status(200).json({
    message: "Attendance history fetched successfully",
    employee: formatEmployee(result.employee),
    total: result.attendance.length,
    data: result.attendance.map(formatAttendance),
  });
};

module.exports = {
  markAttendance,
  getAttendanceHistory,
};
