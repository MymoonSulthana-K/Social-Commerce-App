import { useEffect, useState } from "react";
import { adminRequest } from "../../utils/adminApi";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminRequest("/admin/users")
      .then((data) => {
        setUsers(data);
        if (data[0]) {
          return adminRequest(`/admin/users/${data[0]._id}`);
        }
        return null;
      })
      .then((details) => {
        if (details) setSelectedUser(details);
      })
      .catch((err) => setError(err.message || "Failed to load users"));
  }, []);

  const loadUser = async (userId) => {
    try {
      const details = await adminRequest(`/admin/users/${userId}`);
      setSelectedUser(details);
    } catch (err) {
      setError(err.message || "Failed to load user details");
    }
  };

  return (
    <section className="admin-two-column">
      <div className="admin-panel-card">
        <div className="admin-section-heading">
          <h2>Users</h2>
          <p>View accounts and engagement snapshots</p>
        </div>
        {error ? <p className="admin-inline-error">{error}</p> : null}
        <div className="admin-list-stack">
          {users.map((user) => (
            <button
              key={user._id}
              type="button"
              className={
                selectedUser?.user?._id === user._id
                  ? "admin-user-row active"
                  : "admin-user-row"
              }
              onClick={() => loadUser(user._id)}
            >
              <div>
                <strong>{user.name}</strong>
                <p>{user.email}</p>
              </div>
              <span>{formatDate(user.createdAt)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="admin-panel-card">
        <div className="admin-section-heading">
          <h2>User details</h2>
          <p>Email, join date, orders, and referrals</p>
        </div>

        {selectedUser ? (
          <div className="admin-detail-stack">
            <div className="admin-detail-card">
              <h3>{selectedUser.user.name}</h3>
              <p>{selectedUser.user.email}</p>
              <small>Joined {formatDate(selectedUser.user.createdAt)}</small>
            </div>
            <div className="admin-inline-metrics">
              <div>
                <strong>{selectedUser.activity.orders.length}</strong>
                <span>Orders</span>
              </div>
              <div>
                <strong>{selectedUser.activity.referralsStarted.length}</strong>
                <span>Referrals started</span>
              </div>
              <div>
                <strong>{selectedUser.activity.referralsJoined.length}</strong>
                <span>Referral joins</span>
              </div>
            </div>
            <div>
              <h4>Recent orders</h4>
              <div className="admin-list-stack compact">
                {selectedUser.activity.orders.slice(0, 5).map((order) => (
                  <div key={order._id} className="admin-list-item">
                    <div>
                      <strong>#{order._id.slice(-6).toUpperCase()}</strong>
                      <p>{order.status}</p>
                    </div>
                    <span>{formatDate(order.createdAt)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <p>Select a user to see details.</p>
        )}
      </div>
    </section>
  );
}

export default AdminUsers;
