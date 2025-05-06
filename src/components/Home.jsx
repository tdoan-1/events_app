import React, { useState, useEffect } from "react";
import { getConferences } from "../api.js";
import EventList from "./EventList.jsx";
import TalkList from "./TalkList.jsx";
import CreateConference from "./CreateConference.jsx";
import CreateTalk from "./CreateTalk.jsx";
import "./Home.css";

function Calendar() {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();

  return (
    <div className="calendar-box">
      <div className="calendar-header">
        <button onClick={() => setCurrentMonth(prev => (prev === 0 ? 11 : prev - 1))}>&lt;</button>
        <h3>{months[currentMonth]} 2025</h3>
        <button onClick={() => setCurrentMonth(prev => (prev === 11 ? 0 : prev + 1))}>&gt;</button>
      </div>
      <div className="days">
        {Array.from({ length: getDaysInMonth(2025, currentMonth) }, (_, day) => (
          <div key={day + 1} className="day">{day + 1}</div>
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
    const interval = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchSubscribedConferences = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email;
    if (!email) return;

    fetch(`http://localhost:5000/api/conference/list?email=${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => setConferences(data))
      .catch((err) => console.error("Failed to load conferences", err));
  };

  useEffect(() => {
    fetchSubscribedConferences();
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/talk/list")
      .then((res) => res.json())
      .then((data) => setTalks(data))
      .catch((err) => console.error("Failed to load talks", err));
  }, []);

  const handleAddConference = () => {
    if (!conferenceTitle.trim()) {
      alert("Please enter a valid conference title.");
      return;
    }

    fetch(`http://localhost:5000/api/conference/list`)
      .then((response) => response.json())
      .then((allConfs) => {
        const match = allConfs.find(
          (conf) => conf.title.toLowerCase() === conferenceTitle.toLowerCase()
        );

        if (!match) {
          alert("Conference title not found.");
          return;
        }

        if (conferences.some((c) => c.conference_id === match.conference_id)) {
          alert("Conference is already in the list.");
          return;
        }

        setConferences((prev) => [...prev, match]);
        setConferenceTitle("");
      })
      .catch((error) => {
        console.error("Error searching conference by title:", error);
        alert("Failed to add conference. Please try again.");
      });
  };

  const handleDeleteConference = (conferenceIdToDelete) => {
    setConferences((prev) =>
      prev.filter((conf) => conf.conference_id !== conferenceIdToDelete)
    );
  };

  const handleFlagTalk = async (talkId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user?.id;
    if (!user_id) {
      alert("Login required.");
      return;
    }
  
    console.log("⚠️ Attempting to flag talk:", { user_id, talkId });
  
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
  
      console.log("✅ Talk successfully flagged:", result);
      setFlaggedTalks((prev) => [...prev, talkId]);
    } catch (err) {
      console.error("❌ Error flagging talk:", err.message);
      alert("Error flagging talk: " + err.message);
    }
  };

  return (
    <div className="home-container">
      <div className="left-panel">
        <div className="box upcoming-conferences">
          <EventList
            conferences={conferences}
            onDelete={handleDeleteConference}
          />
        </div>

        <div className="box add-conference">
          <h3>Add Conference by Title</h3>
          <input
            type="text"
            value={conferenceTitle}
            onChange={(e) => setConferenceTitle(e.target.value)}
            placeholder="Conference Title"
          />
          <button onClick={handleAddConference}>Subscribe to Conference</button>
          <hr style={{ margin: "15px 0" }} />
          <CreateConference />
        </div>
      </div>
      <div className="box calendar-container">
        <Calendar />
      </div>
      <div className="box messages">
        <h3>Messages</h3>
        <p>No messages yet.</p>
      </div>

      <div className="box upcoming-talks">
        <TalkList
          talks={talks}
          onFlag={handleFlagTalk}
          flaggedTalks={flaggedTalks}
        />
      </div>

      <div className="bottom-right">
        <p>{currentDateTime}</p>
      </div>
    </div>
  );
}

export default Home;
