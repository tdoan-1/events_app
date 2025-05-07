import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";
import WeekAtGlance from "./WeekAtGlance";
import "./Home.css";
import { getConferences } from "../api";

function Home() {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [conferences, setConferences] = useState([]);
  const [talks, setTalks] = useState([]);
  const [flaggedTalks, setFlaggedTalks] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(1); // TODO: Get this from your auth system

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fetch conferences
    getConferences().then((data) => {
      console.log("Fetched conferences:", data);
      setConferences(data);
    }).catch(error => {
      console.error("Error fetching conferences:", error);
    });

    // Fetch talks
    fetch("http://localhost:5000/api/talk/list")
      .then(response => response.json())
      .then(data => {
        console.log("Fetched talks:", data);
        setTalks(data);
      })
      .catch(error => {
        console.error("Error fetching talks:", error);
      });
  }, []);

  // Fetch flagged talks for the user on load
  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:5000/api/talk/flagged?user_id=${user.id}`)
        .then(res => res.json())
        .then(data => setFlaggedTalks(data.map(t => t.talks_id)))
        .catch(err => console.error("Failed to fetch flagged talks:", err));
    }
  }, [user?.id]);

  // Debug log for conferences state
  useEffect(() => {
    console.log("Current conferences state:", conferences);
  }, [conferences]);

  const handleDeleteConference = (conferenceId) => {
    // TODO: Implement unsubscribe functionality
    console.log("Unsubscribe from conference:", conferenceId);
  };

  // Flag a talk
  const handleFlagTalk = async (talkId) => {
    if (!user?.id) return alert("User not found.");
    try {
      const res = await fetch("http://localhost:5000/api/talk/flag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, talks_id: talkId }),
      });
      if (!res.ok) throw new Error("Failed to flag talk");
      setFlaggedTalks(prev => [...prev, talkId]);
    } catch (err) {
      alert("Error flagging talk: " + err.message);
    }
  };

  // Unflag a talk
  const handleUnflagTalk = async (talkId) => {
    if (!user?.id) return alert("User not found.");
    try {
      const res = await fetch("http://localhost:5000/api/talk/unflag", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, talks_id: talkId }),
      });
      if (!res.ok) throw new Error("Failed to unflag talk");
      setFlaggedTalks(prev => prev.filter(id => id !== talkId));
    } catch (err) {
      alert("Error unflagging talk: " + err.message);
    }
  };

  return (
    <div className="home-container">
      <div className="top-row">
        <div className="box week-at-glance">
          <WeekAtGlance 
            conferences={conferences}
            talks={talks}
            onDeleteConference={handleDeleteConference}
            onFlagTalk={handleFlagTalk}
            onUnflagTalk={handleUnflagTalk}
            flaggedTalks={flaggedTalks}
            currentUserId={currentUserId}
          />
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
