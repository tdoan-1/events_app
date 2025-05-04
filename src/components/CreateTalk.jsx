import React, { useState } from "react";
import "./CreateTalk.css";

function CreateTalk() {
  const [formData, setFormData] = useState({
    conference_id: "",
    abstract: "",
    authors: "",
    time_: "",
    loca: "",
    comments: "",
  });

  const [statusMessage, setStatusMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure time_ is formatted properly
    const formattedTime = formData.time_
      ? new Date(`1970-01-01T${formData.time_}:00`)
      : null;

    const payload = {
      ...formData,
      conference_id: parseInt(formData.conference_id),
      time_: formattedTime,
    };

    try {
      const response = await fetch("http://localhost:5000/api/talk/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        setStatusMessage("✅ Talk created successfully!");
        setFormData({
          conference_id: "",
          abstract: "",
          authors: "",
          time_: "",
          loca: "",
          comments: "",
        });
      } else {
        setStatusMessage("❌ " + (data.message || "Failed to create talk."));
      }
    } catch (error) {
      console.error("Error creating talk:", error);
      setStatusMessage("❌ An error occurred while creating the talk.");
    }
  };

  return (
    <>
      <button className="create-talk-btn" onClick={() => setIsModalOpen(true)}>
        + Create New Talk
      </button>

      {isModalOpen && (
        <div className="create-talk-modal-overlay">
          <div className="create-talk-modal-content">
            <h3>Create New Talk</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="number"
                name="conference_id"
                placeholder="Conference ID (that this talk belongs to)"
                value={formData.conference_id}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="abstract"
                placeholder="Abstract (max 250 chars)"
                value={formData.abstract}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="authors"
                placeholder="Authors (optional)"
                value={formData.authors}
                onChange={handleChange}
              />
              <input
                type="time"
                name="time_"
                placeholder="Time (HH:MM)"
                value={formData.time_}
                onChange={handleChange}
              />
              <input
                type="text"
                name="loca"
                placeholder="Location"
                value={formData.loca}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="comments"
                placeholder="Comments (optional)"
                value={formData.comments}
                onChange={handleChange}
              />
              <div className="create-talk-modal-buttons">
                <button type="submit">Submit</button>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
              </div>
              {statusMessage && (
                <div className="create-talk-status-message">
                  {statusMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default CreateTalk;
