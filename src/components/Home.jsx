import React from "react";
import EventList from "./EventList";

function Home() {
  const handleClick = () => {
    alert("this took way too long to make work :-)!");
  };

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