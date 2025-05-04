import React, { useEffect, useState } from "react";
import './Header.css';
import { useNavigate } from "react-router-dom";

function Header() {
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser?.email) {
      setUserEmail(savedUser.email);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/"; // This refreshes the page and navigates to the main menu
  };

  return (
    <header className="header">
      <h1 className="header-title">Events Planner</h1>

      {userEmail && (
        <div className="user-info">
          <div className="user-email">Logged in as: <h7>{userEmail}</h7></div>
          <button className="logout-btn" onClick={handleLogout}>Log Out</button>
        </div>
      )}
    </header>
  );
}

export default Header;
