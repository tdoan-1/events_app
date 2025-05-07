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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getConferences().then((data) => {
      console.log("Fetched conferences:", data); // Debug log
      setConferences(data);
    }).catch(error => {
      console.error("Error fetching conferences:", error); // Debug log
    });
  }, []);

  // Debug log for conferences state
  useEffect(() => {
    console.log("Current conferences state:", conferences);
  }, [conferences]);

  const handleDeleteConference = (conferenceId) => {
    // TODO: Implement unsubscribe functionality
    console.log("Unsubscribe from conference:", conferenceId);
  };

  const handleFlagTalk = (talkId) => {
    setFlaggedTalks(prev => 
      prev.includes(talkId) 
        ? prev.filter(id => id !== talkId)
        : [...prev, talkId]
    );
  };

  return (
    <div className="home-container">
      {/* ✅ Reorder boxes to put Calendar in the center */}
      <div className="top-row">
        <div className="box week-at-glance">
          <WeekAtGlance 
            conferences={conferences}
            talks={talks}
            onDeleteConference={handleDeleteConference}
            onFlagTalk={handleFlagTalk}
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
