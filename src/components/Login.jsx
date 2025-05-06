import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/send-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send verification code");
      }

      setIsCodeSent(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // First verify the code
      const verifyResponse = await fetch("http://localhost:5000/api/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      if (!verifyResponse.ok) {
        throw new Error("Invalid verification code");
      }

      // If code is verified, proceed with login
      const loginResponse = await fetch("http://localhost:5000/api/user/login-or-create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save user data to localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Navigate to home page
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome</h1>
        <p className="subtitle">Sign in with your email to continue</p>

        {error && <div className="error-message">{error}</div>}

        {!isCodeSent ? (
          <form onSubmit={handleSendCode}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <button type="submit" className="login-btn">
              Send Verification Code
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode}>
            <div className="form-group">
              <label htmlFor="verificationCode">Verification Code</label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter the code sent to your email"
                required
              />
            </div>

            <button type="submit" className="login-btn">
              Verify & Continue
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login; 