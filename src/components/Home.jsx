import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";
import "./Home.css";

function Home() {
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-container">
      {/* ✅ Reorder boxes to put Calendar in the center */}
      <div className="top-row">
        <div className="box week-at-glance">
          <h3>Week at a Glance</h3>
          <div className="week-content">
            <p>Your weekly schedule will appear here.</p>
          </div>
        </div>

        <div className="box calendar-container">
          <Calendar />
        </div>

        <div className="box messages">
          <h3>Messages</h3>
          <p>No messages yet.</p>
        </div>
      </div>

      <div className="bottom-right">
        <p>{currentDateTime}</p>
      </div>
    </div>
  );
}

export default Home;
