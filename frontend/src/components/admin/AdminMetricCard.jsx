function AdminMetricCard({ label, value, accent, helper }) {
  return (
    <div className="admin-metric-card">
      <span className="admin-metric-accent" style={{ background: accent }}></span>
      <p>{label}</p>
      <h3>{value}</h3>
      {helper ? <small>{helper}</small> : null}
    </div>
  );
}

export default AdminMetricCard;
