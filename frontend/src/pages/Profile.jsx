import { useEffect, useState } from "react";
import "../styles/profile.css"

function Profile() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Fetch User Data
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError("Failed to load profile.");
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  // Handle Global Loading State
  if (loadingUser) {
    return <p style={{ padding: "40px" }}>Loading profile...</p>;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="profile-container">
      {/* USER INFO SECTION */}
      <div className="profile-card">
        <h2>Your Profile</h2>
        {user && (
          <div className="profile-info">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
        )}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;