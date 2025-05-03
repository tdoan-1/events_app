import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './MainMenu.css';

function MainMenu() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSendCode = async () => {
    if (validateEmail(email)) {
      try {
        const response = await fetch("/api/send-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (response.ok) {
          setIsCodeSent(true);
          alert("Verification code sent to your email!");
        } else {
          alert("Failed to send code. Please try again.");
        }
      } catch (error) {
        console.error("Error sending code:", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      alert("Please enter a valid email address.");
    }
  };

  const handleVerifyCode = async () => {
    try {
      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      if (response.ok) {
        alert("Login successful!");
        navigate("/home");
      } else {
        alert("Invalid code. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="main-menu">
      <h1>Welcome</h1>
      <div className="login-container">
        {!isCodeSent ? (
          <>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button onClick={handleSendCode}>Send Code</button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter the verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button onClick={handleVerifyCode}>Verify Code</button>
          </>
        )}
      </div>
    </div>
  );
}

export default MainMenu;