import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import NotificationBanner from "./components/NotificationBanner";
import useNotifier from "./hooks/useNotifier";
import AttendanceHistoryPage from "./pages/AttendanceHistoryPage";
import EmployeesPage from "./pages/EmployeesPage";
import MarkAttendancePage from "./pages/MarkAttendancePage";

const App = () => {
  const { notification, showError, showSuccess, clearNotification } = useNotifier();

  const notify = (type, message) => {
    if (type === "success") {
      showSuccess(message);
      return;
    }

    showError(message);
  };

  return (
    <BrowserRouter>
      <NotificationBanner notification={notification} onClose={clearNotification} />
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Navigate to="/employees" replace />} />
          <Route path="/employees" element={<EmployeesPage notify={notify} />} />
          <Route path="/attendance/mark" element={<MarkAttendancePage notify={notify} />} />
          <Route
            path="/attendance/history"
            element={<AttendanceHistoryPage notify={notify} />}
          />
          <Route path="*" element={<Navigate to="/employees" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
