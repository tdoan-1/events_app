import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './MainMenu.css';

function MainMenu() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSendCode = async () => {
    if (!validateEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const response = await fetch("http://localhost:5000/api/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsCodeSent(true);
        setMessage("Verification code sent to your email!");
      } else {
        setMessage("Failed to send code. Please try again.");
      }
    } catch (error) {
      console.error("Error sending code:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setLoading(true);
      setMessage("");
      const response = await fetch("http://localhost:5000/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      if (response.ok) {
        setMessage("Login successful!");
        navigate("/home");
      } else {
        setMessage("Invalid code. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
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
              disabled={loading}
            />
            <button onClick={handleSendCode} disabled={loading}>
              {loading ? "Sending..." : "Send Code"}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter the verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              disabled={loading}
            />
            <button onClick={handleVerifyCode} disabled={loading}>
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </>
        )}
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default MainMenu;
