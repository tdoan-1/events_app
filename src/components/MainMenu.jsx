import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import './MainMenu.css'; // Import the CSS file

function MainMenu() {
  const [email, setEmail] = useState(""); // State to store the entered email
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = () => {
    if (email.trim() !== "") {
      console.log(`Email entered: ${email}`);
      // Add logic to handle login (e.g., send email to backend)
      setEmail(""); // Clear the input field
      navigate("/home"); // Navigate to the Home Menu
    } else {
      alert("Please enter a valid email address.");
    }
  };

  return (
    <div className="main-menu">
      <h1>Welcome</h1>
      <div className="login-container">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // Update the email state
        />
        <button onClick={handleLogin}>Enter</button>
      </div>
    </div>
  );
}

export default MainMenu;