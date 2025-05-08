import React, { useState, useEffect } from "react";
import Calendar from "./Calendar";
import WeekAtGlance from "./WeekAtGlance";
import "./Home.css";
import { getConferences } from "../api";
import { useNavigate } from "react-router-dom";

function Home() {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [conferences, setConferences] = useState([]);
  const [talks, setTalks] = useState([]);
  const [flaggedTalks, setFlaggedTalks] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(1); // TODO: Get this from your auth system
  const [messages, setMessages] = useState([]);
  const [selectedConference, setSelectedConference] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminConferences, setAdminConferences] = useState([]);
  const [subscribedConferences, setSubscribedConferences] = useState([]);
  const [allMessages, setAllMessages] = useState([]);

  const navigate = useNavigate();

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fetch conferences
    getConferences().then((data) => {
      console.log("Debug - Fetched conferences:", data);
      setConferences(data);
    }).catch(error => {
      console.error("Error fetching conferences:", error);
    });

    // Fetch talks
    fetch("http://localhost:5000/api/talk/list")
      .then(response => response.json())
      .then(data => {
        console.log("Fetched talks:", data);
        setTalks(data);
      })
      .catch(error => {
        console.error("Error fetching talks:", error);
      });
  }, []);

  // Fetch flagged talks for the user on load
  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:5000/api/talk/flagged?user_id=${user.id}`)
        .then(res => res.json())
        .then(data => setFlaggedTalks(data.map(t => t.talks_id)))
        .catch(err => console.error("Failed to fetch flagged talks:", err));
    }
  }, [user?.id]);

  // Debug log for conferences state
  useEffect(() => {
    console.log("Current conferences state:", conferences);
  }, [conferences]);

  // Check if user is an admin of any conferences
  useEffect(() => {
    if (user?.id && conferences.length > 0) {
      console.log("=== ADMIN CHECK DEBUG ===");
      console.log("User ID:", user.id);
      console.log("All conferences:", conferences);
      
      const adminConfs = conferences.filter(conf => {
        console.log(`\nChecking conference: ${conf.title} (ID: ${conf.conference_id})`);
        console.log("Conference users:", conf.users);
        
        const isAdmin = conf.users?.some(u => {
          const isMatch = u.user_id.toString().startsWith(user.id.toString()) && u.role_id === 2;
          console.log("User check details:", {
            userId: u.user_id,
            userRole: u.role_id,
            isMatch: isMatch,
            user_id_starts_with: u.user_id.toString().startsWith(user.id.toString()),
            current_user_id: user.id
          });
          return isMatch;
        });
        
        console.log(`Is admin of ${conf.title}:`, isAdmin);
        return isAdmin;
      });
      
      console.log("Final admin conferences:", adminConfs);
      setAdminConferences(adminConfs);
      setIsAdmin(adminConfs.length > 0);
    }
  }, [conferences, user?.id]);

  // Fetch messages for the selected conference
  useEffect(() => {
    if (selectedConference) {
      console.log("=== FETCHING MESSAGES DEBUG ===");
      console.log("Selected conference ID:", selectedConference);
      
      fetch(`http://localhost:5000/api/announcement/conference/${selectedConference}`)
        .then(res => {
          console.log("Message fetch response status:", res.status);
          return res.json();
        })
        .then(data => {
          console.log("Fetched messages:", data);
          setMessages(data);
        })
        .catch(err => {
          console.error("Failed to fetch messages:", err);
        });
    }
  }, [selectedConference]);

  // Add this useEffect to get subscribed conferences
  useEffect(() => {
    if (user?.id && conferences.length > 0) {
      const subscribedConfs = conferences.filter(conf => 
        conf.users?.some(u => 
          u.user_id.toString().startsWith(user.id.toString()) && 
          (u.role_id === 1 || u.role_id === 2)  // include both subscribers and admins
        )
      );
      setSubscribedConferences(subscribedConfs);
    }
  }, [conferences, user?.id]);

  // Add this new useEffect to fetch all messages
  useEffect(() => {
    if (user?.id) {
      // Fetch messages for all subscribed and admin conferences
      const fetchAllMessages = async () => {
        try {
          const allConfs = [...adminConferences, ...subscribedConferences];
          const messagesPromises = allConfs.map(conf => 
            fetch(`http://localhost:5000/api/announcement/conference/${conf.conference_id}`)
              .then(res => res.json())
              .then(data => data.map(msg => ({
                ...msg,
                conference_title: conf.title
              })))
          );
          
          const messagesArrays = await Promise.all(messagesPromises);
          const allMsgs = messagesArrays.flat();
          setAllMessages(allMsgs);
        } catch (err) {
          console.error("Failed to fetch all messages:", err);
        }
      };

      fetchAllMessages();
    }
  }, [adminConferences, subscribedConferences, user?.id]);

  const handleDeleteConference = async (conferenceId) => {
    if (!user?.id) {
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

      if (!response.ok) {
        throw new Error("Failed to unsubscribe from conference");
      }

      // Update the conferences list by removing the unsubscribed conference
      setConferences(prevConferences => 
        prevConferences.filter(conf => conf.conference_id !== conferenceId)
      );
    } catch (error) {
      console.error("Error unsubscribing from conference:", error);
    }
  };

  // Flag a talk
  const handleFlagTalk = async (talkId) => {
    if (!user?.id) return alert("User not found.");
    try {
      const res = await fetch("http://localhost:5000/api/talk/flag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, talks_id: talkId }),
      });
      if (!res.ok) throw new Error("Failed to flag talk");
      setFlaggedTalks(prev => [...prev, talkId]);
    } catch (err) {
      alert("Error flagging talk: " + err.message);
    }
  };

  // Unflag a talk
  const handleUnflagTalk = async (talkId) => {
    if (!user?.id) return alert("User not found.");
    try {
      const res = await fetch("http://localhost:5000/api/talk/unflag", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, talks_id: talkId }),
      });
      if (!res.ok) throw new Error("Failed to unflag talk");
      setFlaggedTalks(prev => prev.filter(id => id !== talkId));
    } catch (err) {
      alert("Error unflagging talk: " + err.message);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!selectedConference || !newMessage.trim()) return;

    console.log("=== SENDING MESSAGE DEBUG ===");
    console.log("Selected conference:", selectedConference);
    console.log("User object:", user);
    console.log("User ID:", user.id);
    console.log("Message content:", newMessage);

    // Log the exact data being sent
    const requestData = {
      conference_id: selectedConference,
      user_id: user.id,
      announcement_desc: newMessage
    };
    console.log("Data being sent to server:", requestData);

    try {
      const response = await fetch("http://localhost:5000/api/announcement/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData)
      });

      console.log("Server response status:", response.status);
      const responseData = await response.json();
      console.log("Server response data:", responseData);

      if (response.ok) {
        setNewMessage("");
        // Refresh messages
        const updatedMessages = await fetch(`http://localhost:5000/api/announcement/conference/${selectedConference}`)
          .then(res => res.json());
        console.log("Updated messages after sending:", updatedMessages);
        setMessages(updatedMessages);
      } else {
        alert("Failed to send message: " + responseData.message);
      }
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Error sending message: " + err.message);
    }
  };

  const handleEditConference = (conference) => {
    try {
      console.log("Editing conference:", conference);
      // Navigate to the AddConference page with the conference data
      navigate('/add-conference', { 
        state: { 
          conference: conference,
          isEditing: true 
        }
      });
    } catch (error) {
      console.error("Error in handleEditConference:", error);
      alert("An error occurred while preparing to edit the conference. Please try again.");
    }
  };

  return (
    <div className="home-container">
      <div className="top-row">
        <div className="box week-at-glance">
          <WeekAtGlance 
            conferences={conferences}
            talks={talks}
            onDeleteConference={handleDeleteConference}
            onFlagTalk={handleFlagTalk}
            onUnflagTalk={handleUnflagTalk}
            flaggedTalks={flaggedTalks}
            onEditConference={handleEditConference}
          />
        </div>

        <div className="box calendar-container">
          <Calendar conferences={subscribedConferences} />
        </div>

        <div className="box messages">
          <h3>Messages</h3>
          {isAdmin ? (
            <div className="admin-messages">
              <select 
                value={selectedConference === null ? "" : selectedConference} 
                onChange={(e) => setSelectedConference(e.target.value ? Number(e.target.value) : null)}
                className="conference-select"
              >
                <option value="">All Conferences</option>
                
                {/* Admin Conferences Group */}
                {adminConferences.length > 0 && (
                  <optgroup label="My Admin Conferences">
                    {adminConferences.map(conf => (
                      <option key={conf.conference_id} value={conf.conference_id}>
                        {conf.title} (Admin)
                      </option>
                    ))}
                  </optgroup>
                )}
                
                {/* Subscribed Conferences Group */}
                {subscribedConferences.length > 0 && (
                  <optgroup label="My Subscribed Conferences">
                    {subscribedConferences.map(conf => (
                      <option key={conf.conference_id} value={conf.conference_id}>
                        {conf.title}
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>

              {selectedConference && (
                <form onSubmit={handleSendMessage} className="message-form">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message to conference subscribers..."
                    className="message-input"
                  />
                  <button type="submit" className="send-button">Send Message</button>
                </form>
              )}

              <div className="message-list">
                {(selectedConference ? messages : allMessages)
                  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                  .map(msg => (
                    <div key={msg.announcement_id} className="message-item">
                      <p className="message-content">{msg.announcement_desc}</p>
                      <div className="message-meta">
                        <small className="message-conference">
                          {msg.conference_title || 'Unknown Conference'}
                        </small>
                        <small className="message-time">
                          {new Date(msg.created_at).toLocaleString()}
                        </small>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="user-messages">
              {(selectedConference ? messages : allMessages)
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .map(msg => (
                  <div key={msg.announcement_id} className="message-item">
                    <p className="message-content">{msg.announcement_desc}</p>
                    <div className="message-meta">
                      <small className="message-conference">
                        {msg.conference_title || 'Unknown Conference'}
                      </small>
                      <small className="message-time">
                        {new Date(msg.created_at).toLocaleString()}
                      </small>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <div className="bottom-right">
        <p>{currentDateTime}</p>
      </div>
    </div>
  );
}

export default Home;
