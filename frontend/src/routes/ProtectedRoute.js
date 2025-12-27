import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // ❌ Not authenticated → redirect to login
  if (!token) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location }}
      />
    );
  }

  // ✅ Authenticated → allow access
  return children;
}

export default ProtectedRoute;
