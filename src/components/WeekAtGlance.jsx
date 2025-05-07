import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";

function WeekAtGlance({ conferences, talks, onDeleteConference, onFlagTalk, onUnflagTalk, flaggedTalks }) {
  const [showAll, setShowAll] = useState(false);
  const [currentUserBaseId, setCurrentUserBaseId] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.id) {
      const baseId = user.id.toString(); // 6-digit base ID
      setCurrentUserBaseId(baseId);
      console.log("✅ Current user base ID (from user table):", baseId);
    } else {
      console.warn("⚠️ No user ID found in localStorage.");
    }
  }, []);

  const now = new Date();
  const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const upcomingConferences = conferences.filter(conf => {
    const confDate = new Date(conf.dates);
    const isSubscribed = conf.users?.some(user => {
      const userIdStr = String(user.user_id);
      const matches = user.role_id === 1 && userIdStr.startsWith(currentUserBaseId);
      console.log("🧪 Checking user for conference:", {
        conferenceTitle: conf.title,
        user_id: userIdStr,
        role_id: user.role_id,
        matches
      });
      return matches;
    });

    console.log("🔍 Conference check result:", {
      title: conf.title,
      date: confDate.toDateString(),
      isSubscribed,
      allUserIds: conf.users?.map(u => u.user_id)
    });

    return confDate >= now && confDate <= oneWeekFromNow && isSubscribed;
  });

  const allSubscribedConferences = conferences.filter(conf =>
    conf.users?.some(user =>
      user.role_id === 1 && String(user.user_id).startsWith(currentUserBaseId)
    )
  );

  const upcomingTalks = talks.filter(talk => {
    const talkDate = new Date(talk.time_);
    return talkDate >= now && talkDate <= oneWeekFromNow;
  });

  upcomingConferences.sort((a, b) => new Date(a.dates) - new Date(b.dates));
  allSubscribedConferences.sort((a, b) => new Date(a.dates) - new Date(b.dates));
  upcomingTalks.sort((a, b) => new Date(b.time_) - new Date(a.time_));

  // Group talks by conference_id
  const talksByConference = {};
  talks.forEach(talk => {
    if (!talksByConference[talk.conference_id]) {
      talksByConference[talk.conference_id] = [];
    }
    talksByConference[talk.conference_id].push(talk);
  });

  const handleCloseModal = (e) => {
    if (
      e.target.className === "conference-modal-overlay" ||
      e.target.className === "close-modal-btn"
    ) {
      setShowAll(false);
    }
  };

  const modal = (
    <div
      className="conference-modal-overlay"
      onClick={handleCloseModal}
      style={{
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
      }}
    >
      <div
        className="conference-modal-content"
        style={{
          background: "white",
          borderRadius: "12px",
          padding: "2.5rem",
          minWidth: "900px",
          maxWidth: "1200px",
          minHeight: "500px",
          maxHeight: "700px",
          boxShadow: "0 8px 32px rgba(30,41,59,0.18)",
          position: "relative",
        }}
      >
        <button
          className="close-modal-btn"
          onClick={handleCloseModal}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            color: "#64748b",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
        <h4 style={{ color: "#1e293b", marginBottom: "0.75rem" }}>All My Conferences</h4>
        {allSubscribedConferences.length === 0 ? (
          <p>You are not subscribed to any conferences.</p>
        ) : (
          <ul style={{ maxHeight: '60vh', overflowY: 'auto', padding: 0, margin: 0 }}>
            {allSubscribedConferences.map(conference => (
              <li key={conference.conference_id} className="glance-item">
                <div className="item-header">
                  <h5>{conference.title}</h5>
                  <button
                    onClick={() => onDeleteConference(conference.conference_id)}
                    className="unsubscribe-btn"
                  >
                    Unsubscribe
                  </button>
                </div>
                <p className="item-details">
                  <span>📍 {conference.loca}  📅 {new Date(conference.dates).toLocaleDateString()}</span>
                </p>
                {/* Talks for this conference */}
                {talksByConference[conference.conference_id] && talksByConference[conference.conference_id].length > 0 && (
                  <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem', background: '#f8f9fa', borderRadius: '6px', padding: '0.75rem' }}>
                    {talksByConference[conference.conference_id].map(talk => (
                      <li key={talk.talks_id} style={{ marginBottom: '0.5rem', color: '#334155', listStyle: 'disc' }}>
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
                            marginLeft: '1rem',
                            background: flaggedTalks.includes(talk.talks_id) ? '#facc15' : '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.35rem 0.85rem',
                            fontWeight: 600,
                            fontSize: '1rem',
                            cursor: 'pointer',
                            transition: 'background 0.2s',
                          }}
                          onMouseOver={e => e.currentTarget.style.background = flaggedTalks.includes(talk.talks_id) ? '#eab308' : '#2563eb'}
                          onMouseOut={e => e.currentTarget.style.background = flaggedTalks.includes(talk.talks_id) ? '#facc15' : '#3b82f6'}
                        >
                          {flaggedTalks.includes(talk.talks_id) ? '🚩 Unflag' : '🚩 Flag'}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
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
              {upcomingConferences.map((conference) => (
                <li key={conference.conference_id} className="glance-item">
                  <div className="item-header">
                    <h5>{conference.title}</h5>
                    <button
                      onClick={() => onDeleteConference(conference.conference_id)}
                      className="unsubscribe-btn"
                    >
                      Unsubscribe
                    </button>
                  </div>
                  <p className="item-details">
                    <span>📍 {conference.loca}  📅 {new Date(conference.dates).toLocaleDateString()}</span>
                  </p>
                  {/* Flagged talks for this conference */}
                  {talksByConference[conference.conference_id] &&
                    talksByConference[conference.conference_id].filter(talk => flaggedTalks.includes(talk.talks_id)).length > 0 && (
                      <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem', background: '#f8f9fa', borderRadius: '6px', padding: '0.75rem' }}>
                        {talksByConference[conference.conference_id]
                          .filter(talk => flaggedTalks.includes(talk.talks_id))
                          .map(talk => (
                            <li key={talk.talks_id} style={{ marginBottom: '0.5rem', color: '#334155', listStyle: 'disc' }}>
                              <strong>{talk.abstract}</strong> <span style={{ color: '#64748b' }}>by {talk.authors}</span><br />
                              <span style={{ color: '#64748b' }}>🕒 {talk.time_ ? new Date(talk.time_).toLocaleTimeString() : 'N/A'}</span>
                              {talk.loca && <span style={{ color: '#64748b', marginLeft: '1rem' }}>📍 {talk.loca}</span>}
                            </li>
                          ))}
                      </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
        <button
          onClick={() => setShowAll(true)}
          style={{
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "0.5rem 1.25rem",
            fontWeight: 500,
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          Show All My Conferences
        </button>
      </div>

      {showAll && createPortal(modal, document.body)}
    </div>
  );
}

export default WeekAtGlance;
