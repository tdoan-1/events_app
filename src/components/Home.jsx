import React, { useState, useEffect } from "react";
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
  const [conferenceTitle, setConferenceTitle] = useState("");
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

  const handleAddConference = async () => {
    if (!conferenceTitle.trim()) {
      alert("Please enter a valid conference title.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email;
    if (!email) {
      alert("Login required.");
      return;
    }

    const allConfs = await fetch("http://localhost:5000/api/conference/list")
      .then(res => res.json());

    const match = allConfs.find(conf =>
      conf.title.toLowerCase() === conferenceTitle.toLowerCase()
    );

    if (!match) {
      alert("Conference not found.");
      return;
    }

    const res = await fetch("http://localhost:5000/api/conference/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conferenceId: match.conference_id,
        userEmail: email,
      }),
    });

    if (res.ok) {
      setConferences(prev => [...prev, match]);
      setConferenceTitle("");
    } else {
      alert("Subscription failed.");
    }
  };

  const handleDeleteConference = async (confId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const email = user?.email;
    if (!email) return;

    const res = await fetch("http://localhost:5000/api/conference/unsubscribe", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conferenceId: confId, userEmail: email }),
    });

    if (res.ok) {
      setConferences(prev => prev.filter(c => c.conference_id !== confId));
    } else {
      alert("Failed to unsubscribe.");
    }
  };

  const handleFlagTalk = async (talkId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user?.id;
    if (!user_id) {
      alert("Login required.");
      return;
    }

    await fetch("http://localhost:5000/api/talk/flag", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, talks_id: talkId }),
    });

    setFlaggedTalks((prev) => [...prev, talkId]);
  };

  return (
    <div className="home-container">
      <div className="left-panel">
        <div className="box upcoming-conferences">
          <EventList conferences={conferences} onDelete={handleDeleteConference} />
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
          <hr />
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
        <TalkList talks={talks} onFlag={handleFlagTalk} flaggedTalks={flaggedTalks} />
        <CreateTalk />
      </div>
      <div className="bottom-right">
        <p>{currentDateTime}</p>
      </div>
    </div>
  );
}

export default Home;
