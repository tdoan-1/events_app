import React, { useState } from 'react';
import './Calendar.css';

function Calendar({ conferences = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getConferencesForDate = (day) => {
    return conferences.filter(conf => {
      const confDate = new Date(conf.dates);
      return confDate.getDate() === day &&
             confDate.getMonth() === currentDate.getMonth() &&
             confDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const handleDayClick = (day) => {
    const conferencesForDay = getConferencesForDate(day);
    if (conferencesForDay.length > 0) {
      setSelectedDate(day);
      setShowPopup(true);
    }
  };

  const renderDays = () => {
    const days = [];
    const totalDays = 42; // 6 rows of 7 days

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="day empty"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === new Date().getDate() && 
                     currentDate.getMonth() === new Date().getMonth() &&
                     currentDate.getFullYear() === new Date().getFullYear();
      
      const conferencesForDay = getConferencesForDate(day);
      const hasConferences = conferencesForDay.length > 0;
      
      days.push(
        <div 
          key={day} 
          className={`day ${isToday ? 'today' : ''} ${hasConferences ? 'has-conferences' : ''}`}
          onClick={() => handleDayClick(day)}
        >
          {day}
          {hasConferences && <div className="conference-dot"></div>}
        </div>
      );
    }

    // Add empty cells for remaining days
    const remainingDays = totalDays - (firstDayOfMonth + daysInMonth);
    for (let i = 0; i < remainingDays; i++) {
      days.push(<div key={`empty-end-${i}`} className="day empty"></div>);
    }

    return days;
  };

  return (
    <div className="calendar-box">
      <div className="calendar-header">
        <button onClick={prevMonth}>&lt;</button>
        <h3>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
        <button onClick={nextMonth}>&gt;</button>
      </div>
      <div className="days">
        {dayNames.map(day => (
          <div key={day} className="day-name">{day}</div>
        ))}
        {renderDays()}
      </div>

      {showPopup && selectedDate && (
        <div className="calendar-popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="calendar-popup" onClick={e => e.stopPropagation()}>
            <button className="close-popup" onClick={() => setShowPopup(false)}>&times;</button>
            <h4>Conferences on {monthNames[currentDate.getMonth()]} {selectedDate}</h4>
            <div className="conference-list">
              {getConferencesForDate(selectedDate).map(conf => (
                <div key={conf.conference_id} className="conference-item">
                  <h5>{conf.title}</h5>
                  <p className="conference-short-name">{conf.short_name}</p>
                  <p className="conference-location">📍 {conf.loca}</p>
                  <p className="conference-date">📅 {new Date(conf.dates).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar; 