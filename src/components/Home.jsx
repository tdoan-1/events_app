import React, { useState, useEffect } from "react";
import EventList from "./EventList";
import { useEffect, useState } from "react";
import { getConferences } from "../api.js";

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
      <p>Today's Date: time for you to get a watch(its march 5th)</p>
      <main>
        <EventList />
        <button onClick={handleClick}>Click me</button>
      </main>
    </div>
  );
}

export default Home;