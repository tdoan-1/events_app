import React from "react";
import { Link } from "react-router-dom";
import './MainMenu.css'; // Import the CSS file

function MainMenu() {
  return (
    <div className="main-menu">
      <h1>Main Menu</h1>
      <Link to="/home">
        <button>Its planning time.</button>
      </Link>
    </div>
  );
}

export default MainMenu;