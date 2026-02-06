import { useEffect, useState } from "react";
import { hrmsApi } from "../api/hrmsApi";
import EmployeeTable from "../components/EmployeeTable";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import LoadingState from "../components/LoadingState";

const initialFormState = {
  employeeId: "",
  fullName: "",
  email: "",
  department: "",
};

const EmployeesPage = ({ notify }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [deletingEmployeeId, setDeletingEmployeeId] = useState(null);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await hrmsApi.getEmployees();
      setEmployees(response.data || []);
    } catch (requestError) {
      setError(requestError.message || "Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

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
      await hrmsApi.createEmployee({
        employeeId: formData.employeeId.trim(),
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        department: formData.department.trim(),
      });

      notify("success", "Employee created successfully");
      setFormData(initialFormState);
      await loadEmployees();
    } catch (requestError) {
      notify("error", requestError.message || "Unable to create employee");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (employee) => {
    const confirmed = window.confirm(
      `Delete ${employee.fullName}? This will also remove related attendance records.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingEmployeeId(employee.id);
      await hrmsApi.deleteEmployee(employee.id);
      notify("success", "Employee deleted successfully");
      await loadEmployees();
    } catch (requestError) {
      notify("error", requestError.message || "Unable to delete employee");
    } finally {
      setDeletingEmployeeId(null);
    }
  };

  return (
    <section className="page-grid">
      <article className="panel">
        <div className="panel-head">
          <h2>Add Employee</h2>
          <p>Create a new employee profile for attendance tracking.</p>
        </div>

        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Employee ID
            <input
              name="employeeId"
              value={formData.employeeId}
              onChange={handleChange}
              placeholder="EMP-001"
              required
            />
          </label>

          <label>
            Full Name
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Alex Morgan"
              required
            />
          </label>

          <label>
            Email Address
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="alex@example.com"
              required
            />
          </label>

          <label>
            Department
            <input
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Engineering"
              required
            />
          </label>

          <button type="submit" className="button-primary" disabled={submitting}>
            {submitting ? "Saving..." : "Add Employee"}
          </button>
        </form>
      </article>

      <article className="panel">
        <div className="panel-head">
          <h2>Employee List</h2>
          <p>Manage all employee records and remove inactive profiles.</p>
        </div>

        {loading ? <LoadingState message="Loading employees..." /> : null}
        {!loading && error ? <ErrorState message={error} onRetry={loadEmployees} /> : null}
        {!loading && !error && employees.length === 0 ? (
          <EmptyState
            title="No employees found"
            description="Add your first employee to begin tracking attendance."
          />
        ) : null}
        {!loading && !error && employees.length > 0 ? (
          <EmployeeTable
            employees={employees}
            deletingEmployeeId={deletingEmployeeId}
            onDelete={handleDelete}
          />
        ) : null}
      </article>
    </section>
  );
};

export default EmployeesPage;
