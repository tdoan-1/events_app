import React, { useState } from "react";
import "./CreateConference.css";

function CreateConference() {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [shortName, setShortName] = useState("");
  const [loca, setLoca] = useState("");
  const [dates, setDates] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !shortName || !loca || !dates) {
      setMessage("All fields are required.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/conference/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, short_name: shortName, loca, dates }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Conference created successfully!");
        setTitle("");
        setShortName("");
        setLoca("");
        setDates("");
        setShowModal(false); // Close popup
      } else {
        setMessage(`❌ ${data.message || "Failed to create conference."}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ An error occurred. Try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <button className="open-popup-btn" onClick={() => setShowModal(true)}>
        + Create New Conference
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Conference</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Conference Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <input
                type="text"
                placeholder="Short Name"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Location"
                value={loca}
                onChange={(e) => setLoca(e.target.value)}
              />
              <input
                type="date"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
              />
              <div className="modal-buttons">
                <button type="submit" disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
            {message && <p className="status-message">{message}</p>}
          </div>
        </div>
      )}
    </>
  );
}

export default CreateConference;
