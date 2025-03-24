import React, { useState, useEffect } from "react";
import EventList from "./EventList";

function Home() {
  const [currentDateTime, setCurrentDateTime] = useState("");

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

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>what time is it? 'time for you to get a watch' {currentDateTime}</p>
      <EventList />
    </div>
  );
}

export default Home;