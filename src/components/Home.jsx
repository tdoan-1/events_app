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
      <p>Today's Date: time for you to get a watch {currentDateTime}</p>
      <main>
        <EventList />
        <button onClick={() => console.log("Button clicked!")}>Click me</button>
      </main>
    </div>
  );
}

export default Home;