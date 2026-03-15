import { useEffect, useState } from "react";
import "../styles/profile.css";

function Profile() {

  const [user, setUser] = useState(null);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) return;

    fetch("http://localhost:5000/api/auth/profile", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setUser(data));

  }, []);

  if (!user) {
    return <p style={{padding:"40px"}}>Loading profile...</p>;
  }

  return (

    <div className="profile-container">

      <div className="profile-card">

        <h2>Your Profile</h2>

        <div className="profile-info">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>

        <button
          className="logout-btn"
          onClick={()=>{
            localStorage.removeItem("token");
            window.location.href="/login";
          }}
        >
          Logout
        </button>

      </div>
    </div>

  );
}

export default Profile;