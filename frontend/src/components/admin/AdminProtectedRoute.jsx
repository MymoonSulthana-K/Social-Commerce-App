import { Navigate, useLocation } from "react-router-dom";

function AdminProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("adminToken");
  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "null");

  if (!token || adminUser?.role !== "admin") {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default AdminProtectedRoute;
