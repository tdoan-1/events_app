import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

function WeekAtGlance({ conferences, talks, onDeleteConference, onFlagTalk, onUnflagTalk, flaggedTalks }) {
  const [showAll, setShowAll] = useState(false);
  const [currentUserBaseId, setCurrentUserBaseId] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) {
      const baseId = user.id.toString();
      setCurrentUserBaseId(baseId);
      console.log("✅ Current user base ID (from user table):", baseId);
    } else {
      console.warn("⚠️ No user ID found in localStorage.");
    }
  }, []);

  const now = new Date();
  const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const isUserSubscribed = (conf) => {
    const confDate = new Date(conf.dates);
    const isSubscribed = conf.users?.some(user => {
      const userIdStr = String(user.user_id);
      return user.role_id === 1 && userIdStr.startsWith(currentUserBaseId);
    });
    return { isSubscribed, confDate };
  };

  const upcomingConferences = conferences.filter(conf => {
    const { isSubscribed, confDate } = isUserSubscribed(conf);
    return confDate >= now && confDate <= oneWeekFromNow && isSubscribed;
  });

  const allActiveConferences = conferences.filter(conf => {
    const { isSubscribed, confDate } = isUserSubscribed(conf);
    return confDate >= now && isSubscribed;
  });

  const talksByConferenceFlagged = {};
  talks
    .filter(talk => flaggedTalks.includes(talk.talks_id))
    .forEach(talk => {
      if (!talksByConferenceFlagged[talk.conference_id]) {
        talksByConferenceFlagged[talk.conference_id] = [];
      }
      talksByConferenceFlagged[talk.conference_id].push(talk);
    });

  const talksByConferenceAll = {};
  talks.forEach(talk => {
    if (!talksByConferenceAll[talk.conference_id]) {
      talksByConferenceAll[talk.conference_id] = [];
    }
    talksByConferenceAll[talk.conference_id].push(talk);
  });

  const handleCloseModal = (e) => {
    if (
      e.target.className === "conference-modal-overlay" ||
      e.target.className === "close-modal-btn"
    ) {
      setShowAll(false);
    }
  };

  const handleUnsubscribe = async (conferenceId) => {
    if (!currentUserBaseId) return;

    try {
      const response = await fetch("http://localhost:5000/api/conference/unsubscribe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conferenceId,
          userEmail: JSON.parse(localStorage.getItem("user")).email
        })
      });

      if (!response.ok) throw new Error("Failed to unsubscribe from conference");
      onDeleteConference(conferenceId);
    } catch (error) {
      console.error("Error unsubscribing from conference:", error);
    }
  };

  const renderTalks = (conferenceId, useFlagged) => {
    const talksMap = useFlagged ? talksByConferenceFlagged : talksByConferenceAll;
    const confTalks = talksMap[conferenceId] || [];

    return confTalks.length > 0 && (
      <div className="talks-list">
        <h6>Talks:</h6>
        <ul>
          {confTalks.map(talk => (
            <li key={talk.talks_id} style={{ color: '#334155', listStyle: 'disc', marginBottom: '1.2em' }}>
              <strong>{talk.abstract}</strong> <span style={{ color: '#64748b' }}>by {talk.authors}</span><br />
              <span style={{ color: '#64748b' }}>🕒 {talk.time_ ? new Date(talk.time_).toLocaleTimeString() : 'N/A'}</span>
              {talk.loca && <span style={{ color: '#64748b', marginLeft: '1rem' }}>📍 {talk.loca}</span>}
              <button
                onClick={() =>
                  flaggedTalks.includes(talk.talks_id)
                    ? onUnflagTalk(talk.talks_id)
                    : onFlagTalk(talk.talks_id)
                }
                className={`flag-btn ${flaggedTalks.includes(talk.talks_id) ? 'flagged' : ''}`}
                style={{
                  marginTop: '0.75em',
                  background: flaggedTalks.includes(talk.talks_id) ? '#facc15' : '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '7px',
                  marginLeft: '10px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.background = flaggedTalks.includes(talk.talks_id) ? '#eab308' : '#2563eb'}
                onMouseOut={e => e.currentTarget.style.background = flaggedTalks.includes(talk.talks_id) ? '#facc15' : '#3b82f6'}
              >
                <span style={{ marginRight: '0.5rem', fontSize: '1.2em' }}>🚩</span>
                {flaggedTalks.includes(talk.talks_id) ? 'Unflag' : 'Flag'}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const modal = (
    <div className="conference-modal-overlay" onClick={handleCloseModal} style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(30,41,59,0.25)",
      zIndex: 2000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div className="conference-modal-content" style={{
        background: "white",
        borderRadius: "12px",
        padding: "2.5rem",
        minWidth: "900px",
        maxWidth: "1200px",
        minHeight: "500px",
        maxHeight: "700px",
        boxShadow: "0 8px 32px rgba(30,41,59,0.18)",
        position: "relative",
      }}>
        <button className="close-modal-btn" onClick={handleCloseModal} style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          background: "none",
          border: "none",
          fontSize: "1.5rem",
          color: "#64748b",
          cursor: "pointer",
        }}>&times;</button>

        <h4 style={{ color: "#1e293b", marginBottom: "0.75rem" }}>All My Conferences</h4>
        {allActiveConferences.length === 0 ? (
          <p>You are not subscribed to any conferences.</p>
        ) : (
          <ul style={{ maxHeight: '60vh', overflowY: 'auto', padding: 0, margin: 0 }}>
            {allActiveConferences.map(conf => (
              <li key={conf.conference_id} className="glance-item">
                <div className="item-header">
                  <h5>{conf.title}</h5>
                  <button onClick={() => handleUnsubscribe(conf.conference_id)} className="unsubscribe-btn">Unsubscribe</button>
                </div>
                <p className="item-details">
                  <span>📍 {conf.loca}  📅 {new Date(conf.dates).toLocaleDateString()}</span>
                </p>
                {renderTalks(conf.conference_id, false)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

  return (
    <div className="week-at-glance">
      <h3>Week at a Glance</h3>

      <div className="glance-sections">
        <div className="glance-section conferences">
          <h4>Your Upcoming Conferences</h4>
          {upcomingConferences.length === 0 ? (
            <p>No conferences scheduled for this week.</p>
          ) : (
            <ul>
              {upcomingConferences.map(conf => (
                <li key={conf.conference_id} className="glance-item">
                  <div className="item-header">
                    <h5>{conf.title}</h5>
                    <button onClick={() => handleUnsubscribe(conf.conference_id)} className="unsubscribe-btn">
                      Unsubscribe
                    </button>
                  </div>
                  <p className="item-details">
                    <span>📍 {conf.loca}  📅 {new Date(conf.dates).toLocaleDateString()}</span>
                  </p>
                  {renderTalks(conf.conference_id, true)}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
        <button onClick={() => setShowAll(true)} style={{
          background: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "10px",
          padding: "1rem 2.5rem",
          fontWeight: 700,
          cursor: "pointer",
          fontSize: "1.35rem",
          boxShadow: "0 2px 8px rgba(59,130,246,0.15)",
          letterSpacing: "0.03em",
          transition: "background 0.2s, box-shadow 0.2s",
          whiteSpace: "nowrap",
        }}
        onMouseOver={e => e.currentTarget.style.background = "#2563eb"}
        onMouseOut={e => e.currentTarget.style.background = "#3b82f6"}>
          Show All My Conferences
        </button>
      </div>

      {showAll && createPortal(modal, document.body)}
    </div>
  );
}

export default WeekAtGlance;
