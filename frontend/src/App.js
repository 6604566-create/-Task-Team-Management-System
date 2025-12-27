import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./layouts/auth/Login";
import Register from "./layouts/auth/Register";

import Dashboard from "./layouts/dashboard/Dashboard";
import Employees from "./layouts/employees/Employees";
import Projects from "./layouts/projects/Projects";
import Tasks from "./layouts/tasks/Tasks";
import Timesheets from "./layouts/timesheets/Timesheets";
import Attendance from "./layouts/attendance/Attendance";

import ProtectedRoute from "./routes/ProtectedRoute";

/* ================= COMPONENT ================= */

function App() {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}

      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ================= PROTECTED ROUTES ================= */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/employees"
        element={
          <ProtectedRoute>
            <Employees />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/projects"
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/tasks"
        element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/timesheets"
        element={
          <ProtectedRoute>
            <Timesheets />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/attendance"
        element={
          <ProtectedRoute>
            <Attendance />
          </ProtectedRoute>
        }
      />

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
