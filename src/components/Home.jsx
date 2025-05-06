import React, { useState, useEffect } from "react";
import { getConferences } from "../api.js";
import WeekAtGlance from "./WeekAtGlance.jsx";
import "./Home.css";

function Calendar() {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));
  };

  return (
    <div className="calendar-box">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <h3>{months[currentMonth]} 2025</h3>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="days">
        {Array.from({ length: getDaysInMonth(2025, currentMonth) }, (_, day) => (
          <div key={day + 1} className="day">
            {day + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

function Home() {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [conferences, setConferences] = useState([]);
  const [talks, setTalks] = useState([]);
  const [flaggedTalks, setFlaggedTalks] = useState([]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString());
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getConferences().then((data) => {
      setConferences(data);
    });
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/api/talk/list`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch talks");
        }
        return response.json();
      })
      .then((data) => {
        setTalks(data);
      })
      .catch((error) => {
        console.error("Error fetching talks:", error);
      });
  }, []);

  const handleDeleteConference = (conferenceIdToDelete) => {
    setConferences((prev) =>
      prev.filter((conf) => conf.conference_id !== conferenceIdToDelete)
    );
  };

  const handleFlagTalk = async (talkId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user?.id;
  
    if (!user_id) {
      alert("⚠️ You must be logged in to flag a talk.");
      return;
    }
  
    try {
      const res = await fetch("http://localhost:5000/api/talk/flag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ user_id, talks_id: talkId })
      });
  
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
  
      setFlaggedTalks((prev) => [...prev, talkId]);
    } catch (err) {
      console.error("❌ Error flagging talk:", err.message);
      alert("Error flagging talk: " + err.message);
    }
  };

  return (
    <div className="home-container">
      <div className="left-panel">
        <div className="box week-at-glance-container">
          <WeekAtGlance
            conferences={conferences}
            talks={talks}
            onDeleteConference={handleDeleteConference}
            onFlagTalk={handleFlagTalk}
            flaggedTalks={flaggedTalks}
          />
        </div>
      </div>

      <div className="box calendar-container">
        <Calendar />
      </div>

      <div className="box messages">
        <h3>Messages</h3>
        <p>No messages at this time.</p>
      </div>

      <div className="bottom-right">
        <p>{currentDateTime}</p>
      </div>
    </div>
  );
}

export default Home;
