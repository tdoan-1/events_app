import React, { useState } from "react";
import CreateTalk from "./CreateTalk";
import "./TalkList.css";

function TalkList({ talks, onFlag, flaggedTalks }) {
  const [importantTalks, setImportantTalks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleImportant = (talkId) => {
    setImportantTalks((prev) =>
      prev.includes(talkId)
        ? prev.filter((id) => id !== talkId)
        : [...prev, talkId]
    );
  };

  const filteredTalks = talks.filter(
    (talk) =>
      talk.talks_id.toString().includes(searchQuery) ||
      talk.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h3>Upcoming Talks</h3>

      <div className="talk-header">
        <input
          type="text"
          placeholder="Search by ID or Title"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <CreateTalk />
      </div>

      {filteredTalks.length === 0 ? (
        <p>No talks found.</p>
      ) : (
        <ul className="talk-list">
          {filteredTalks.map((talk, index) => (
            <li key={index} className="talk-item">
              <h4>
                Talk ID: {talk.talks_id}{" "}
                {flaggedTalks.includes(talk.talks_id) && "🚩"}{" "}
                {importantTalks.includes(talk.talks_id) && "⭐"}
              </h4>
              <p>Abstract: {talk.abstract || "N/A"}</p>
              <p>Authors: {talk.authors || "N/A"}</p>
              <p>Location: {talk.loca}</p>
              <p>
                Time:{" "}
                {talk.time_
                  ? new Date(talk.time_).toLocaleString("en-US")
                  : "N/A"}
              </p>
              <div className="button-row">
                <button onClick={() => onFlag(talk.talks_id)}>
                  {flaggedTalks.includes(talk.talks_id)
                    ? "Unflag Talk"
                    : "Flag Talk"}
                </button>
                <button onClick={() => handleImportant(talk.talks_id)}>
                  {importantTalks.includes(talk.talks_id)
                    ? "Unmark Important"
                    : "Mark Important"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TalkList;
