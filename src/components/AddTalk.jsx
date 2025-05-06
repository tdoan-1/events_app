import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddTalk.css";

function AddTalk() {
  const [conferences, setConferences] = useState([]);
  const [formData, setFormData] = useState({
    conference_id: "",
    abstract: "",
    authors: "",
    time_: "",
    loca: "",
    comments: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch conferences for the dropdown
    fetch("http://localhost:5000/api/conference/list")
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch conferences');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Fetched conferences:', data);
        setConferences(data);
      })
      .catch((err) => {
        console.error("Error fetching conferences:", err);
        setError("Failed to load conferences. Please try again.");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/talk/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          conference_id: parseInt(formData.conference_id),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to add talk");
      }

      // Navigate back to home page after successful submission
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="add-talk-container">
      <div className="add-talk-box">
        <h1>Add New Talk</h1>
        <p className="subtitle">Schedule a new talk for a conference</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="conference_id">Select Conference</label>
            <select
              id="conference_id"
              name="conference_id"
              value={formData.conference_id}
              onChange={handleChange}
              required
            >
              <option value="">Choose a conference</option>
              {conferences.map((conference) => (
                <option key={conference.conference_id} value={conference.conference_id}>
                  {conference.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="abstract">Talk Title</label>
            <input
              type="text"
              id="abstract"
              name="abstract"
              value={formData.abstract}
              onChange={handleChange}
              placeholder="Enter talk title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="authors">Speaker Name</label>
            <input
              type="text"
              id="authors"
              name="authors"
              value={formData.authors}
              onChange={handleChange}
              placeholder="Enter speaker name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="time_">Time</label>
            <input
              type="time"
              id="time_"
              name="time_"
              value={formData.time_}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="loca">Location</label>
            <input
              type="text"
              id="loca"
              name="loca"
              value={formData.loca}
              onChange={handleChange}
              placeholder="Enter talk location"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="comments">Description</label>
            <textarea
              id="comments"
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="Enter talk description"
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Add Talk
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddTalk; 