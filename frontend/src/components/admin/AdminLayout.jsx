import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import "../../styles/admin.css";

function AdminLayout() {
  const adminUser = JSON.parse(localStorage.getItem("adminUser") || "null");

  return (
    <div className="admin-shell">
      <AdminSidebar />
      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="admin-eyebrow">Operations center</p>
            <h1>Formali Admin</h1>
          </div>
          <div className="admin-user-chip">
            <span>{adminUser?.name?.[0] || "A"}</span>
            <div>
              <strong>{adminUser?.name || "Admin"}</strong>
              <p>{adminUser?.email || "admin@formali.com"}</p>
            </div>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
