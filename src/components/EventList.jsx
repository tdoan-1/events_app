import React, { useState } from "react";

function EventList() {
  const [events, setEvents] = useState([
    "become motivated",
    "Know every coding language",
    "Profit",
  ]);
  const [newEvent, setNewEvent] = useState("");

  const handleAddEvent = () => {
    if (newEvent.trim() !== "") {
      setEvents([...events, newEvent]); // Add the new event to the list
      setNewEvent(""); // Clear the input field
    }
  };

  const handleDeleteEvent = (indexToDelete) => {
    setEvents(events.filter((_, index) => index !== indexToDelete)); // Remove the event at the specified index
  };

  return (
    <div>
      <h2>Upcoming Events</h2>
      <ul>
        {events.map((event, index) => (
          <li key={index}>
            {event}
            <button onClick={() => handleDeleteEvent(index)}>Delete</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Add a new event"
        value={newEvent}
        onChange={(e) => setNewEvent(e.target.value)} // Update the input value
      />
      <button onClick={handleAddEvent}>Add Event</button>
    </div>
  );
}

export default EventList;