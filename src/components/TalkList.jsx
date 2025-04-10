import React from "react";


function TalkList({ talks, onFlag, flaggedTalks }) {
  return (
    <div>
      <h2>Upcoming Talks</h2>
      {talks.length === 0 ? (
        <p>No talks added yet.</p>
      ) : (
        <ul>
          {talks.map((talk, index) => (
            <li key={index}>
              <h3>Talk ID: {talk.talks_id} {" "}
                 {flaggedTalks.includes(talk.talks_id) && "🚩"}
                 </h3>
              <p>Abstract: {talk.abstract || "N/A"}</p>
              <p>Authors: {talk.authors || "N/A"}</p>
              <p>Location: {talk.loca}</p>
              <p>Time: {talk.time_ ? new Date(talk.time_).toLocaleString("en-US") : "N/A"}</p>
              <button onClick={() => onFlag(talk.talks_id)}>
                {flaggedTalks.includes(talk.talks_id) ? "Unflag Talk" : "Flag Talk"}
                </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TalkList;