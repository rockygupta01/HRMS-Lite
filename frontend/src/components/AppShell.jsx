import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { label: "Employees", path: "/employees" },
  { label: "Mark Attendance", path: "/attendance/mark" },
  { label: "Attendance History", path: "/attendance/history" },
];

const AppShell = () => {
  return (
    <div className="app-shell">
      <div className="shell-frame">
        <header className="shell-header">
          <div>
            <p className="eyebrow">HRMS Lite</p>
            <h1>Human Resource Management Dashboard</h1>
            <p className="subtitle">Manage employees and daily attendance from one workspace.</p>
          </div>
        </header>

        <nav className="shell-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link${isActive ? " nav-link-active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main className="shell-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppShell;
