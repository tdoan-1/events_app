import React from "react";

function EventList({ conferences, onDelete }) {
  return (
    <div>
      <h2>Upcoming Conferences</h2>
      {conferences.length === 0 ? (
        <p>No conferences added yet.</p>
      ) : (
        <ul>
          {conferences.map((conference, index) => (
            <li key={index}>
              <h3>Conference ID: {conference.conference_id}</h3>
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
