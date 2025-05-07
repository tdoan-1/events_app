import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './MainMenu.css';

function MainMenu() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [currentFact, setCurrentFact] = useState("");
  const navigate = useNavigate();

  // Array of computer science facts
  const computerScienceFacts = [
    "The first computer programmer was Ada Lovelace, who wrote the first algorithm intended to be processed by a machine in the 1840s.",
    "The term 'bug' in computer science was coined by Grace Hopper when she found an actual bug (a moth) causing problems in the Harvard Mark II computer.",
    "The first computer mouse was made of wood and was invented by Doug Engelbart in 1964.",
    "The first computer virus was created in 1971 and was called 'Creeper'.",
    "The first computer to use a mouse and a graphical user interface (GUI) was the Xerox Alto, developed in 1973.",
    "The first computer to be called a 'personal computer' was the Programma 101, released in 1965.",
    "The first computer to use a hard disk drive was the IBM 305 RAMAC in 1956.",
    "The first computer to use a microprocessor was the Intel 4004, released in 1971.",
    "The first computer to use a graphical user interface (GUI) was the Xerox Alto, developed in 1973.",
    "The first computer to use a mouse was the Xerox Alto, developed in 1973.",
    "The first computer to use a hard disk drive was the IBM 305 RAMAC in 1956.",
    "The first computer to use a microprocessor was the Intel 4004, released in 1971.",
    "The first computer to use a graphical user interface (GUI) was the Xerox Alto, developed in 1973.",
    "The first computer to use a mouse was the Xerox Alto, developed in 1973.",
    "The first computer to use a hard disk drive was the IBM 305 RAMAC in 1956.",
    "The first computer to use a microprocessor was the Intel 4004, released in 1971.",
    "The first computer to use a graphical user interface (GUI) was the Xerox Alto, developed in 1973.",
    "The first computer to use a mouse was the Xerox Alto, developed in 1973.",
    "The first computer to use a hard disk drive was the IBM 305 RAMAC in 1956.",
    "The first computer to use a microprocessor was the Intel 4004, released in 1971."
  ];

  // Function to get a random fact
  const getRandomFact = () => {
    const randomIndex = Math.floor(Math.random() * computerScienceFacts.length);
    return computerScienceFacts[randomIndex];
  };

  // Set up the fact rotation
  useEffect(() => {
    // Set initial fact
    setCurrentFact(getRandomFact());

    // Rotate facts every 10 seconds
    const interval = setInterval(() => {
      setCurrentFact(getRandomFact());
    }, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

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
        // Create or retrieve user
        const userRes = await fetch("http://localhost:5000/api/user/login-or-create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          localStorage.setItem("user", JSON.stringify(userData.user));
          setMessage("Login successful!");
          window.location.href = "/home";
        } else {
          setMessage("Failed to load user data.");
        }
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
      
      {/* Add the fact display */}
      <div className="fact-display">
        <h3>Did You Know?</h3>
        <p className="fact-text">{currentFact}</p>
      </div>

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
