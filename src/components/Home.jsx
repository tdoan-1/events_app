import React, { useState, useEffect } from "react";
import { getConferences } from "../api.js";
import EventList from "./EventList.jsx";
import TalkList from "./TalkList.jsx";
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
  const [conferenceId, setConferenceId] = useState("");
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

  // Fetch conferences from the backend
  useEffect(() => {
    getConferences().then((data) => {
      setConferences(data);
    });
  }, []);

  // Fetch talks from the backend
  useEffect(() => {
    fetch(`http://localhost:5000/api/talk/list`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch talks");
        }
        return response.json();
      })
      .then((data) => {
        setTalks(data); // Store talks in state
      })
      .catch((error) => {
        console.error("Error fetching talks:", error);
      });
  }, []);

  const handleAddConference = () => {

    console.log("Adding conference with ID:", conferenceId);

    if (!conferenceId.trim()) {
      alert("Please enter a valid conference ID.");
      return;
    }
    fetch(`http://localhost:5000/api/conference/${conferenceId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Conference not found");
        }
        return response.json();
      })
      .then((conference) => {
        if (conferences.some((c) => c.conference_id === conference.conference_id)) {
          alert("Conference is already in the list.");
          return;
        }

        setConferences((prev) => [...prev, conference]);
        setConferenceId("");
      })
      .catch((error) => {
        console.error("Error adding conference:", error);
        alert("Failed to add conference. Please try again.");
      });
  };

  const handleDeleteConference = (conferenceIdToDelete) => {
    setConferences((prev) =>
      prev.filter((conf) => conf.conference_id !== conferenceIdToDelete)
    );
  };

  const handleFlagTalk = (talkId) => {
    setFlaggedTalks((prev) =>
      prev.includes(talkId) ? prev.filter((id) => id !== talkId) : [...prev, talkId]
    );
  };

  return (
    <div className="home-container">
      <div className="box calendar-container">
        <Calendar />
      </div>

      <div className="box messages">
        <h3>Messages</h3>
        <p>No messages at this time.</p>
      </div>

      <div className="box upcoming-conferences">
        <EventList
          conferences={conferences}
          onDelete={handleDeleteConference}
        />
      </div>

      <div className="box add-conference">
        <h3>Add Conference via ID</h3>
        <p>Enter the conference ID to add it to the list.</p>
        <input
          type="text"
          value={conferenceId}
          onChange={(e) => setConferenceId(e.target.value)}
          placeholder="Conference ID"
        />
        <button onClick={handleAddConference}>Add Conference</button>
      </div>
      <div className="bottom-right">
        <p>{currentDateTime}</p>
      </div>

      <div className="box upcoming-talks">
        <TalkList talks={talks}
        onFlag={handleFlagTalk}
        flaggedTalks={flaggedTalks} // Pass flaggedTalks to TalkList
        />
      </div>

    </div>
  );
}

export default Home;
