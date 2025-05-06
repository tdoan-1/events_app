import React, { useEffect, useState } from "react";
import './Header.css';
import { useNavigate, Link, useLocation } from "react-router-dom";

function Header() {
  const [userEmail, setUserEmail] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleHomeClick = () => {
    setIsMenuOpen(false);
    navigate("/home");
  };

  // Check if we're on the main menu (root path)
  const isMainMenu = location.pathname === "/";

  return (
    <header className="header">
      <div className="header-left">
        {!isMainMenu && (
          <button className="hamburger-menu" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        )}
        <h1 className="header-title">Events Planner</h1>
      </div>

      <div className={`side-menu ${isMenuOpen ? 'open' : ''}`}>
        <button className="close-menu" onClick={() => setIsMenuOpen(false)}>
          <span></span>
          <span></span>
        </button>
        <div className="menu-content">
          <button className="menu-item" onClick={handleHomeClick}>
            Home
          </button>
          <Link to="/add-conference" className="menu-item" onClick={() => setIsMenuOpen(false)}>
            Add Conference
          </Link>
          <Link to="/add-talk" className="menu-item" onClick={() => setIsMenuOpen(false)}>
            Add Talk
          </Link>
        </div>
      </div>

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
