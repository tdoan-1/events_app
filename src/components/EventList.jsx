import React, { useState } from "react";

function EventList({ conferences, onDelete }) {
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  // Filter conferences based on the search query
  const filteredConferences = conferences.filter(
    (conference) =>
      conference.conference_id.toString().includes(searchQuery) || // Match by ID
      conference.title?.toLowerCase().includes(searchQuery.toLowerCase()) // Match by title
  );

  return (
    <div>
      <h3>Upcoming Conferences</h3>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by ID or Title"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {filteredConferences.length === 0 ? (
        <p>No conferences found.</p>
      ) : (
        <ul>
          {filteredConferences.map((conference, index) => (
            <li key={index}>
              <h4>Conference ID: {conference.conference_id}</h4>
              <p>Title: {conference.title}</p>
              <p>Location: {conference.loca}</p>
              <p>Dates: {new Date(conference.dates).toLocaleString("en-US")}</p>
              <button onClick={() => onDelete(conference.conference_id)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EventList;