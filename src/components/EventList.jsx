import React, { useState, useEffect } from "react";
import { getConferences } from "../api.js";


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


  // 'setConferences' is the function to update 'conferences'
      const [conferences, setConferences] = useState([]);
    
      //sends request to backend
      useEffect(() => {
        getConferences().then((data) => {
          setConferences(data);
        });
      }, []);


  return (
    <div>
      <h2>Upcoming Events</h2>
      <ul>
      {/* Display the list of conferences from database*/}
        {conferences.map((conference, index) => (
          <li key={index}>
            <h3>{conference.conference_id}</h3> 
                <p>{conference.title}</p>
                <p>{conference.loca}</p>
                <p>{conference.dates}</p>
          </li>
        ))}            
      </ul>
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