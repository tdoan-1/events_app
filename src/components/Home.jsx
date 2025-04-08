import React, { useState, useEffect } from "react";
import { getConferences } from "../api.js";
import "./Home.css"; // Import the CSS file for styling

function Calendar() {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [currentMonth, setCurrentMonth] = useState(0); // State to track the current month

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1)); // Go to the previous month
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1)); // Go to the next month
  };

  return (
    <div className="calendar-box">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>&lt;</button>
        <h3>{months[currentMonth]} 2025</h3>
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      <div className="days">
        {Array.from({ length: getDaysInMonth(2025, currentMonth) }, (_, day) => (
          <div key={day + 1} className="day">
            {day + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

function Home() {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [conferences, setConferences] = useState([]);
  const [conferenceId, setConferenceId] = useState(""); // State to track the entered conference ID

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

  useEffect(() => {
    getConferences().then((data) => {
      setConferences(data); // Store the fetched events in state
    });
  }, []);

  const handleAddConference = () => {
    if (!conferenceId) {
      alert("Please enter a valid conference ID.");
      return;
    }

    // Fetch conference details by ID
    fetch(`/api/conferences/${conferenceId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Conference not found");
        }
        return response.json();
      })
      .then((conference) => {
        setConferences((prevConferences) => [...prevConferences, conference]); // Add the new conference to the list
        setConferenceId(""); // Clear the input field
      })
      .catch((error) => {
        console.error("Error adding conference:", error);
        alert("Failed to add conference. Please try again.");
      });
  };

  return (
    <div className="home-container">
      <div className="box calendar-container">
        <Calendar />
      </div>
      <div className="box upcoming-events"> 
        
        <h3>Upcoming Events</h3>  {/* Display the list of upcoming events */}
        <ul>
          {conferences.length > 0 ? (
            conferences.map((event, index) => (
              <li key={index}>{event.name}</li> 
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
        <input
          type="text"
          value={conferenceId}
          onChange={(e) => setConferenceId(e.target.value)}
          placeholder="Conference ID"
        />
        <button onClick={handleAddConference}>Add Conference</button>
      </div>
      
      <div className="bottom-right">
        <p>{currentDateTime}</p>
      </div>
    </div>
  );
}

export default Home;