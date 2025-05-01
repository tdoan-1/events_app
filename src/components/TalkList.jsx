import React, { useState } from "react";

function TalkList({ talks, onFlag, flaggedTalks }) {
  const [importantTalks, setImportantTalks] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  const handleImportant = (talkId) => {
    setImportantTalks((prev) =>
      prev.includes(talkId)
        ? prev.filter((id) => id !== talkId)
        : [...prev, talkId]
    );
  };

  // Filter talks based on the search query
  const filteredTalks = talks.filter(
    (talk) =>
      talk.talks_id.toString().includes(searchQuery) || // Match by ID
      talk.title?.toLowerCase().includes(searchQuery.toLowerCase()) // Match by title
  );

  return (
    <div>
      <h2>Upcoming Talks</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by ID or Title"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {filteredTalks.length === 0 ? (
        <p>No talks found.</p>
      ) : (
        <ul>
          {filteredTalks.map((talk, index) => (
            <li key={index}>
              <h3>
                Talk ID: {talk.talks_id}{" "}
                {flaggedTalks.includes(talk.talks_id) && "🚩"}{" "}
                {importantTalks.includes(talk.talks_id) && "⭐"}
              </h3>
              <p>Abstract: {talk.abstract || "N/A"}</p>
              <p>Authors: {talk.authors || "N/A"}</p>
              <p>Location: {talk.loca}</p>
              <p>
                Time: {talk.time_ ? new Date(talk.time_).toLocaleString("en-US") : "N/A"}
              </p>
              <button onClick={() => onFlag(talk.talks_id)}>
                {flaggedTalks.includes(talk.talks_id) ? "Unflag Talk" : "Flag Talk"}
              </button>
              <button onClick={() => handleImportant(talk.talks_id)}>
                {importantTalks.includes(talk.talks_id) ? "Unmark Important" : "Mark Important"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TalkList;