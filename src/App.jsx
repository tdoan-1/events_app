import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import { getConferences } from "./api.js";
import Home from "./components/Home";
import MainMenu from "./components/MainMenu";
import AddConference from "./components/AddConference";
import Login from "./components/Login";
import AddTalk from "./components/AddTalk";

function App() {

  // 'setConferences' is the function to update 'conferences'
  const [conferences, setConferences] = useState([]);

  //sends request to backend
  useEffect(() => {
    getConferences().then((data) => {
      setConferences(data);
    });
  }, []);


  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/add-conference" element={<AddConference />} />
          <Route path="/add-talk" element={<AddTalk />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;