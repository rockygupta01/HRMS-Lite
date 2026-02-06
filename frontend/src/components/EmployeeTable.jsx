const EmployeeTable = ({ employees, deletingEmployeeId, onDelete }) => {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td>{employee.employeeId}</td>
              <td>{employee.fullName}</td>
              <td>{employee.email}</td>
              <td>{employee.department}</td>
              <td>{new Date(employee.createdAt).toLocaleDateString()}</td>
              <td>
                <button
                  type="button"
                  className="button-danger"
                  disabled={deletingEmployeeId === employee.id}
                  onClick={() => onDelete(employee)}
                >
                  {deletingEmployeeId === employee.id ? "Deleting..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
