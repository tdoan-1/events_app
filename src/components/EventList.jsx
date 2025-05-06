import React, { useState } from "react";

function EventList({ conferences, onDelete }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = conferences.filter(
    (c) =>
      c.conference_id.toString().includes(searchQuery) ||
      c.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h3>Subscribed Conferences</h3>
      <input
        type="text"
        placeholder="Search by ID or Title"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {filtered.length === 0 ? (
        <p>No conferences found.</p>
      ) : (
        <ul>
          {filtered.map((c) => (
            <li key={c.conference_id}>
              <h4>{c.title}</h4>
              <p>Location: {c.loca}</p>
              <p>Dates: {new Date(c.dates).toLocaleDateString()}</p>
              <button onClick={() => onDelete(c.conference_id)}>Unsubscribe</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EventList;
