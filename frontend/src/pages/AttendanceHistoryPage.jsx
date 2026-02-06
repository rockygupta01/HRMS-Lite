import { useCallback, useEffect, useMemo, useState } from "react";
import { hrmsApi } from "../api/hrmsApi";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";

const formatDisplayDate = (value) => {
  if (!value) {
    return "-";
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00`).toLocaleDateString();
  }

  return new Date(value).toLocaleDateString();
};

const AttendanceHistoryPage = ({ notify }) => {
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [employeesError, setEmployeesError] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState("");

  const loadEmployees = useCallback(async () => {
    try {
      setLoadingEmployees(true);
      setEmployeesError("");
      const response = await hrmsApi.getEmployees();
      const records = response.data || [];
      setEmployees(records);
      if (records.length > 0) {
        setSelectedEmployeeId((previous) => previous || String(records[0].id));
      }
    } catch (requestError) {
      setEmployeesError(requestError.message || "Unable to load employees");
    } finally {
      setLoadingEmployees(false);
    }
  }, []);

  const loadAttendanceHistory = useCallback(
    async (employeeId) => {
      if (!employeeId) {
        setAttendance([]);
        return;
    }

    try {
      setAttendanceLoading(true);
      setAttendanceError("");
      const response = await hrmsApi.getAttendanceHistory(employeeId);
      setAttendance(response.data || []);
    } catch (requestError) {
      setAttendanceError(requestError.message || "Unable to load attendance history");
      setAttendance([]);
      notify("error", requestError.message || "Unable to load attendance history");
    } finally {
      setAttendanceLoading(false);
    }
    },
    [notify]
  );

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    if (selectedEmployeeId) {
      loadAttendanceHistory(selectedEmployeeId);
    }
  }, [loadAttendanceHistory, selectedEmployeeId]);

  const selectedEmployee = useMemo(() => {
    return employees.find((employee) => String(employee.id) === String(selectedEmployeeId));
  }, [employees, selectedEmployeeId]);

  const presentCount = useMemo(() => {
    return attendance.filter((record) => record.status === "Present").length;
  }, [attendance]);

  if (loadingEmployees) {
    return <LoadingState message="Loading employees..." />;
  }

  if (employeesError) {
    return <ErrorState message={employeesError} onRetry={loadEmployees} />;
  }

  if (employees.length === 0) {
    return (
      <EmptyState
        title="No employees found"
        description="Add employees first to view attendance history."
      />
    );
  }

  return (
    <section className="page-single">
      <article className="panel">
        <div className="panel-head">
          <h2>Attendance History</h2>
          <p>Filter records by employee and review attendance chronology.</p>
        </div>

        <div className="history-controls">
          <label>
            Employee
            <select
              value={selectedEmployeeId}
              onChange={(event) => setSelectedEmployeeId(event.target.value)}
            >
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.fullName} ({employee.employeeId})
                </option>
              ))}
            </select>
          </label>

          <div className="summary-cards" aria-live="polite">
            <article>
              <p>Total Records</p>
              <strong>{attendance.length}</strong>
            </article>
            <article>
              <p>Present Days</p>
              <strong>{presentCount}</strong>
            </article>
            <article>
              <p>Absent Days</p>
              <strong>{attendance.length - presentCount}</strong>
            </article>
          </div>
        </div>

        {attendanceLoading ? <LoadingState message="Loading attendance history..." /> : null}
        {!attendanceLoading && attendanceError ? (
          <ErrorState
            message={attendanceError}
            onRetry={() => loadAttendanceHistory(selectedEmployeeId)}
          />
        ) : null}
        {!attendanceLoading && !attendanceError && attendance.length === 0 ? (
          <EmptyState
            title="No attendance records"
            description={`No attendance has been marked yet for ${selectedEmployee?.fullName || "this employee"}.`}
          />
        ) : null}

        {!attendanceLoading && !attendanceError && attendance.length > 0 ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((record) => (
                  <tr key={record.id}>
                    <td>{formatDisplayDate(record.date)}</td>
                    <td>
                      <span
                        className={
                          record.status === "Present" ? "status-chip status-present" : "status-chip status-absent"
                        }
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </article>
    </section>
  );
};

export default AttendanceHistoryPage;
