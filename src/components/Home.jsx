import React, { useState, useEffect } from "react";
import EventList from "./EventList";
import { getConferences } from "../api.js";
import "./Home.css"; // Import the CSS file for styling

function Home() {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [conferences, setConferences] = useState([]);

  // Fetch the current date and time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formattedDateTime = now.toLocaleString(); // Format the date and time
      setCurrentDateTime(formattedDateTime);
    };

    updateDateTime(); // Set the initial date and time
    const interval = setInterval(updateDateTime, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, []);

  // Fetch events from the database
  useEffect(() => {
    getConferences().then((data) => {
      setConferences(data); // Store the fetched events in state
    });
  }, []);

  return (
    <div className="home-container">
      <div className="box upcoming-events">
        <h3>Upcoming Events</h3>
        <ul>
          {conferences.length > 0 ? (
            conferences.map((event, index) => (
              <li key={index}>{event.name}</li> // Display each event's name
            ))
          ) : (
            <p>No upcoming events</p> // Display a message if no events are available
          )}
        </ul>
      </div>
      <div className="box messages">
        <h3>Messages:</h3>
        <p>Some placeholder messages</p>
      </div>
      <div className="box add-conference">
        <h3>Add Conference via ID</h3>
        <p>Enter the conference ID to add it to the list.</p>
      </div>
      <div className="center">
        <EventList />
      </div>
      <div className="bottom-right">
        <p>{currentDateTime}</p>
      </div>
    </div>
  );
}

export default Home;