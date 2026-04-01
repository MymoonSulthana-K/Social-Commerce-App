import { useEffect, useState } from "react";
import { adminRequest } from "../../utils/adminApi";

const formatDateTime = (value) =>
  new Date(value).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

function AdminReferrals() {
  const [referrals, setReferrals] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    adminRequest("/admin/referrals")
      .then(setReferrals)
      .catch((err) => setError(err.message || "Failed to load referrals"));
  }, []);

  return (
    <section className="admin-panel-card">
      <div className="admin-section-heading">
        <h2>Referral groups</h2>
        <p>Track connected users, 3-user completion, and discount usage</p>
      </div>

      {error ? <p className="admin-inline-error">{error}</p> : null}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Referrer</th>
              <th>Product</th>
              <th>Connected users</th>
              <th>3-user condition</th>
              <th>Discount applied</th>
              <th>Expires</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map((referral) => (
              <tr key={referral._id}>
                <td>
                  <strong>{referral.referrerId?.name || "Unknown"}</strong>
                  <div className="admin-muted">{referral.referralCode}</div>
                </td>
                <td>{referral.productId?.name || "Removed product"}</td>
                <td>
                  {(referral.buyers || []).length > 0
                    ? referral.buyers.map((buyer) => buyer.name).join(", ")
                    : "No buyers yet"}
                </td>
                <td>{referral.isCompleted ? "Completed" : `${referral.buyers.length}/3`}</td>
                <td>{referral.discountApplied ? "Applied" : "Not applied"}</td>
                <td>{formatDateTime(referral.expiresAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdminReferrals;
