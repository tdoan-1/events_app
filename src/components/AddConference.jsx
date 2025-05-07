import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AddConference.css";

function AddConference() {
  const [conferences, setConferences] = useState([]);
  const [user, setUser] = useState(null);
  const [subscribedConferences, setSubscribedConferences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [shortName, setShortName] = useState("");
  const [loca, setLoca] = useState("");
  const [dates, setDates] = useState("");
  const [message, setMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState("create"); // "create" or "list"
  const navigate = useNavigate();

  useEffect(() => {
    // Get user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (user) {
      // Fetch all conferences
      fetch("http://localhost:5000/api/conference/list")
        .then(response => response.json())
        .then(data => {
          setConferences(data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Error fetching conferences:", error);
          setError("Failed to load conferences");
          setLoading(false);
        });

      // Fetch user's subscribed conferences
      fetch(`http://localhost:5000/api/conference/list?email=${user.email}`)
        .then(response => response.json())
        .then(data => {
          // Consider both role_id 1 and 2 as subscribed
          const subscribedIds = data.filter(conf => 
            conf.users?.some(u => 
              u.user_id.toString().startsWith(user.id.toString()) && 
              (u.role_id === 1 || u.role_id === 2)
            )
          ).map(conf => conf.conference_id);
          setSubscribedConferences(subscribedIds);
        })
        .catch(error => {
          console.error("Error fetching subscribed conferences:", error);
        });
    }
  }, [user]);

  const handleCreateConference = async (e) => {
    e.preventDefault();
    if (!title || !shortName || !loca || !dates) {
      setMessage("All fields are required.");
      return;
    }

    if (!user || !user.email) {
      setMessage("You must be logged in to create a conference.");
      return;
    }

    setIsCreating(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/conference/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          short_name: shortName,
          loca,
          dates,
          userEmail: user.email
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setTitle("");
        setShortName("");
        setLoca("");
        setDates("");
        // Refresh both conferences list and subscribed conferences
        const updatedConferences = await fetch("http://localhost:5000/api/conference/list")
          .then(res => res.json());
        setConferences(updatedConferences);
        
        // Update subscribed conferences list
        const subscribedData = await fetch(`http://localhost:5000/api/conference/list?email=${user.email}`)
          .then(res => res.json());
        const subscribedIds = subscribedData.filter(conf => 
          conf.users?.some(u => 
            u.user_id.toString().startsWith(user.id.toString()) && 
            (u.role_id === 1 || u.role_id === 2)
          )
        ).map(conf => conf.conference_id);
        setSubscribedConferences(subscribedIds);
        
        // Switch to the list tab
        setActiveTab("list");
      } else {
        setMessage(`❌ ${data.message || "Failed to create conference."}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ An error occurred. Try again.");
    }

    setIsCreating(false);
  };

  const handleSubscribe = async (conferenceId) => {
    if (!user) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/conference/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          conferenceId: conferenceId,
          userEmail: user.email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to subscribe to conference");
      }

      // Update subscribed conferences list
      setSubscribedConferences(prev => [...prev, conferenceId]);
    } catch (error) {
      console.error("Error subscribing to conference:", error);
    }
  };

  const handleUnsubscribe = async (conferenceId) => {
    if (!user) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/conference/unsubscribe", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          conferenceId: conferenceId,
          userEmail: user.email
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to unsubscribe from conference");
      }

      // Update subscribed conferences list
      setSubscribedConferences(prev => prev.filter(id => id !== conferenceId));
    } catch (error) {
      console.error("Error unsubscribing from conference:", error);
    }
  };

  if (loading) {
    return <div className="loading">Loading conferences...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="add-conference-page">
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === "create" ? "active" : ""}`}
          onClick={() => setActiveTab("create")}
        >
          Create Conference
        </button>
        <button
          className={`tab-button ${activeTab === "list" ? "active" : ""}`}
          onClick={() => setActiveTab("list")}
        >
          Available Conferences
        </button>
      </div>

      {activeTab === "create" && (
        <div className="add-conference-container">
          <h2>Create New Conference</h2>
          <form onSubmit={handleCreateConference} className="conference-form">
            <div className="form-group">
              <label htmlFor="title">Conference Title</label>
              <input
                id="title"
                type="text"
                placeholder="Enter conference title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="shortName">Short Name</label>
              <input
                id="shortName"
                type="text"
                placeholder="Enter short name"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                type="text"
                placeholder="Enter location"
                value={loca}
                onChange={(e) => setLoca(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Conference"}
            </button>
          </form>
          {message && <p className="status-message">{message}</p>}
        </div>
      )}

      {activeTab === "list" && (
        <div className="add-conference-container">
          <h2>Available Conferences</h2>
          <div className="conferences-list">
            {conferences.map((conference) => (
              <div key={conference.conference_id} className="conference-card">
                <div className="conference-info">
                  <h3>{conference.title}</h3>
                  <p className="conference-short-name">{conference.short_name}</p>
                  <p className="conference-location">
                    <strong>Location:</strong> {conference.loca}
                  </p>
                  <p className="conference-date">
                    <strong>Date:</strong>{" "}
                    {new Date(conference.dates).toLocaleDateString()}
                  </p>
                </div>
                <div className="conference-actions">
                  {subscribedConferences.includes(conference.conference_id) ? (
                    <button
                      className="unsubscribe-btn"
                      onClick={() => handleUnsubscribe(conference.conference_id)}
                    >
                      Unsubscribe
                    </button>
                  ) : (
                    <button
                      className="subscribe-btn"
                      onClick={() => handleSubscribe(conference.conference_id)}
                    >
                      Subscribe
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AddConference; 