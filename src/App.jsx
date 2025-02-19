import React from "react";
import Header from "./components/Header";
import EventList from "./components/EventList";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Header />
      <p>todays Date 2/19</p>
      <main>
        <EventList />
      </main>
      <Footer />
      <h1>thank you for checking us out!</h1>
    </div>
  );
}

export default App;