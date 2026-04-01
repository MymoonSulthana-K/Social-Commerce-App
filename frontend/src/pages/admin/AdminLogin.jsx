import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole, Shield } from "lucide-react";
import { adminRequest } from "../../utils/adminApi";
import "../../styles/admin.css";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || "/admin";

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await adminRequest("/auth/admin/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <Shield size={22} />
          <span>Formali Admin</span>
        </div>
        <h1>Sign in to the dashboard</h1>
        <p>
          Use an account with the `admin` role or an email matching `ADMIN_EMAIL`
          on the backend.
        </p>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@formali.com"
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              required
            />
          </label>

          {error ? <p className="admin-inline-error">{error}</p> : null}

          <button type="submit" className="admin-primary-btn" disabled={loading}>
            <LockKeyhole size={16} />
            <span>{loading ? "Signing in..." : "Sign in"}</span>
          </button>
        </form>
      </div>
    </section>
  );
}

export default AdminLogin;
