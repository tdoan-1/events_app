import React from "react";
import EventList from "./EventList";
import { useEffect, useState } from "react";
import { getConferences } from "../api.js";

function Home() {
  const handleClick = () => {
    alert("this took way too long to make work :-)!");
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
      <p>Today's Date: time for you to get a watch(its march 5th)</p>
      <main>
      <ul>
        {conferences.map((conference, index) => (
          <li key={index}>
            <h3>{conference.title}</h3>
            <p>{conference.location}</p>
            <p>{conference.date}</p>
          </li>
        ))}
      </ul>
        <EventList />
        <button onClick={handleClick}>Click me</button>
      </main>
    </div>
  );
}

export default Home;