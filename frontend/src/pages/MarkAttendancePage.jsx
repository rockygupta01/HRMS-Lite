import { useEffect, useMemo, useState } from "react";
import { hrmsApi } from "../api/hrmsApi";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";

const getCurrentDateString = () => new Date().toISOString().slice(0, 10);

const MarkAttendancePage = ({ notify }) => {
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [employeesError, setEmployeesError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    date: getCurrentDateString(),
    status: "Present",
  });

  const loadEmployees = async () => {
    try {
      setLoadingEmployees(true);
      setEmployeesError("");
      const response = await hrmsApi.getEmployees();
      const records = response.data || [];

      setEmployees(records);
      if (records.length > 0) {
        setFormData((previous) => ({
          ...previous,
          employeeId: previous.employeeId || String(records[0].id),
        }));
      }
    } catch (requestError) {
      setEmployeesError(requestError.message || "Unable to fetch employees");
    } finally {
      setLoadingEmployees(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const selectedEmployee = useMemo(() => {
    return employees.find((employee) => String(employee.id) === String(formData.employeeId));
  }, [employees, formData.employeeId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      await hrmsApi.markAttendance({
        employeeId: Number(formData.employeeId),
        date: formData.date,
        status: formData.status,
      });

      notify(
        "success",
        `Attendance marked as ${formData.status.toLowerCase()} for ${selectedEmployee?.fullName || "employee"}.`
      );
      setFormData((previous) => ({
        ...previous,
        status: "Present",
      }));
    } catch (requestError) {
      notify("error", requestError.message || "Unable to mark attendance");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingEmployees) {
    return <LoadingState message="Loading employees..." />;
  }

  if (employeesError) {
    return <ErrorState message={employeesError} onRetry={loadEmployees} />;
  }

  if (employees.length === 0) {
    return (
      <EmptyState
        title="No employees available"
        description="Create employee records first, then mark attendance from this page."
      />
    );
  }

  return (
    <section className="page-single">
      <article className="panel panel-narrow">
        <div className="panel-head">
          <h2>Mark Attendance</h2>
          <p>Record daily present or absent status for one employee.</p>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Employee
            <select name="employeeId" value={formData.employeeId} onChange={handleChange} required>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.fullName} ({employee.employeeId})
                </option>
              ))}
            </select>
          </label>

          <label>
            Date
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
          </label>

          <label>
            Status
            <select name="status" value={formData.status} onChange={handleChange} required>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </label>

          <button type="submit" className="button-primary" disabled={submitting}>
            {submitting ? "Saving..." : "Mark Attendance"}
          </button>
        </form>
      </article>
    </section>
  );
};

export default MarkAttendancePage;
