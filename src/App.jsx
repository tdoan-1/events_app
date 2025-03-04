import React from "react";
import Header from "./components/Header";
import EventList from "./components/EventList";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import { getConferences } from "./api.js";

function App() {
  const [conferences, setConferences] = useState([]);

  //sends request to backend
  useEffect(() => {
    getConferences().then((data) => {
      setConferences(data);
    });
  }, []);


  return (
    <div className="App">
      <Header/>
      <h2>Upcoming Conferences</h2>
      <ul>
        {conferences.map((conference, index) => (
          <li key={index}>
            <h3>{conference.title}</h3>
            <p>{conference.location}</p>
            <p>{conference.date}</p>
          </li>
        ))}
      </ul>
      <EventList/>
      <Footer/>
    </div>
  );
}

export default App;