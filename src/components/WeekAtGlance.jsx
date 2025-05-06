import React from "react";

function WeekAtGlance({ conferences, talks, onDeleteConference, onFlagTalk, flaggedTalks }) {
  // Get current date and date one week from now
  const now = new Date();
  const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Filter conferences and talks within the next week
  const upcomingConferences = conferences.filter(conf => {
    const confDate = new Date(conf.dates);
    return confDate >= now && confDate <= oneWeekFromNow;
  });

  const upcomingTalks = talks.filter(talk => {
    const talkDate = new Date(talk.date);
    return talkDate >= now && talkDate <= oneWeekFromNow;
  });

  // Sort both arrays by date
  upcomingConferences.sort((a, b) => new Date(a.dates) - new Date(b.dates));
  upcomingTalks.sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="week-at-glance">
      <h3>Week at a Glance</h3>
      
      <div className="glance-sections">
        <div className="glance-section conferences">
          <h4>Upcoming Conferences</h4>
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
                    <span>📍 {conference.loca}</span>
                    <span>📅 {new Date(conference.dates).toLocaleDateString()}</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="glance-section talks">
          <h4>Upcoming Talks</h4>
          {upcomingTalks.length === 0 ? (
            <p>No talks scheduled for this week.</p>
          ) : (
            <ul>
              {upcomingTalks.map((talk) => (
                <li key={talk.id} className="glance-item">
                  <div className="item-header">
                    <h5>{talk.title}</h5>
                    <button
                      onClick={() => onFlagTalk(talk.id)}
                      className={`flag-btn ${flaggedTalks.includes(talk.id) ? 'flagged' : ''}`}
                    >
                      {flaggedTalks.includes(talk.id) ? '★' : '☆'}
                    </button>
                  </div>
                  <p className="item-details">
                    <span>👤 {talk.speaker}</span>
                    <span>📅 {new Date(talk.date).toLocaleDateString()}</span>
                    <span>⏰ {talk.time}</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default WeekAtGlance; 