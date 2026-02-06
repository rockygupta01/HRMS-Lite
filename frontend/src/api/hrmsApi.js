const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:5001";

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = payload?.error?.message || "Request failed";
    throw new Error(errorMessage);
  }

  return payload;
};

const getEmployees = () => request("/api/employees");

const createEmployee = (data) =>
  request("/api/employees", {
    method: "POST",
    body: JSON.stringify(data),
  });

const deleteEmployee = (id) =>
  request(`/api/employees/${id}`, {
    method: "DELETE",
  });

const markAttendance = (data) =>
  request("/api/attendance", {
    method: "POST",
    body: JSON.stringify(data),
  });

const getAttendanceHistory = (employeeId) => request(`/api/attendance/${employeeId}`);

export const hrmsApi = {
  getEmployees,
  createEmployee,
  deleteEmployee,
  markAttendance,
  getAttendanceHistory,
};
