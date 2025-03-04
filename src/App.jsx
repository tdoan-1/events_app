import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useEffect, useState } from "react";
import { getConferences } from "./api.js";
import Home from "./components/Home";
import MainMenu from "./components/MainMenu";

function App() {
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
          <Route path="/" element={<MainMenu />} />
          <Route path="/home" element={<Home />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;