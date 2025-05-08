import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [error, setError] = useState("");
  const [currentFact, setCurrentFact] = useState("");
  const [weather, setWeather] = useState(null);
  const navigate = useNavigate();

  // Array of computer science facts
  const computerScienceFacts = [
    "The first computer programmer was Ada Lovelace, who wrote the first algorithm intended to be processed by a machine in the 1840s.",
    "The term 'bug' in computer science was coined by Grace Hopper when she found an actual bug (a moth) causing problems in the Harvard Mark II computer.",
    "The first computer mouse was made of wood and was invented by Doug Engelbart in 1964.",
    "The first computer virus was created in 1971 and was called 'Creeper'.",
    "The first computer to use a mouse and a graphical user interface (GUI) was the Xerox Alto, developed in 1973.",
    "The first computer to be called a 'personal computer' was the Programma 101, released in 1965.",
    "The first computer to use a hard disk drive was the IBM 305 RAMAC in 1956.",
    "The first computer to use a microprocessor was the Intel 4004, released in 1971.",
    "The first computer to use a graphical user interface (GUI) was the Xerox Alto, developed in 1973.",
    "The first computer to use a mouse was the Xerox Alto, developed in 1973.",
    "The first computer to use a hard disk drive was the IBM 305 RAMAC in 1956.",
    "The first computer to use a microprocessor was the Intel 4004, released in 1971.",
    "The first computer to use a graphical user interface (GUI) was the Xerox Alto, developed in 1973.",
    "The first computer to use a mouse was the Xerox Alto, developed in 1973.",
    "The first computer to use a hard disk drive was the IBM 305 RAMAC in 1956.",
    "The first computer to use a microprocessor was the Intel 4004, released in 1971.",
    "The first computer to use a graphical user interface (GUI) was the Xerox Alto, developed in 1973.",
    "The first computer to use a mouse was the Xerox Alto, developed in 1973.",
    "The first computer to use a hard disk drive was the IBM 305 RAMAC in 1956.",
    "The first computer to use a microprocessor was the Intel 4004, released in 1971."
  ];

  // Function to get a random fact
  const getRandomFact = () => {
    const randomIndex = Math.floor(Math.random() * computerScienceFacts.length);
    return computerScienceFacts[randomIndex];
  };

  // Set up the fact rotation
  useEffect(() => {
    // Set initial fact
    setCurrentFact(getRandomFact());

    // Rotate facts every 10 seconds
    const interval = setInterval(() => {
      setCurrentFact(getRandomFact());
    }, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Simplified weather fetch
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Using a fixed location (New York) for simplicity
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=40.71&longitude=-74.01&current=temperature_2m,weathercode'
        );
        
        if (!response.ok) {
          throw new Error('Weather data not available');
        }

        const data = await response.json();
        // Convert Celsius to Fahrenheit using the correct formula
        const celsiusTemp = data.current.temperature_2m;
        const tempF = Math.round((celsiusTemp * 9/5) + 32);
        
        console.log('Celsius temperature:', celsiusTemp); // Debug log
        console.log('Converted to Fahrenheit:', tempF); // Debug log
        
        setWeather({
          temperature: tempF,
          weatherCode: data.current.weathercode
        });
      } catch (err) {
        console.error('Weather fetch error:', err);
      }
    };

    fetchWeather();
  }, []);

  // Function to get weather description based on weather code
  const getWeatherDescription = (code) => {
    const weatherCodes = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    };
    return weatherCodes[code] || 'Unknown';
  };

  // Function to get weather message based on temperature and weather code
  const getWeatherMessage = (temp, code) => {
    // Temperature-based messages
    const tempMessages = {
      hot: [
        "It's a scorcher today! Stay cool and hydrated during your meetings.",
        "Hot day ahead! Maybe schedule those meetings in air-conditioned rooms.",
        "The sun is blazing! Don't forget to take breaks and stay cool."
      ],
      warm: [
        "Perfect weather for a productive day!",
        "It's a beautiful day outside! Hope your meetings aren't too long.",
        "Great day for a walk between meetings!"
      ],
      mild: [
        "Comfortable weather today! Perfect for focusing on your tasks.",
        "Nice day ahead! Hope your meetings go smoothly.",
        "Pleasant weather for getting things done!"
      ],
      cool: [
        "Cool day ahead! Perfect for staying focused indoors.",
        "Nice crisp weather today! Great for productivity.",
        "Comfortable temperature for your meetings!"
      ],
      cold: [
        "Bundle up! It's chilly out there.",
        "Cold day ahead! Stay warm during your meetings.",
        "Brr! It's cold outside. Perfect day for indoor meetings!"
      ]
    };

    // Weather condition messages
    const weatherMessages = {
      clear: [
        "Clear skies today! Perfect for a productive day.",
        "Beautiful sunny day! Hope your meetings are as bright as the weather.",
        "Sunshine and clear skies! Great day for getting things done."
      ],
      cloudy: [
        "Cloudy day ahead! Perfect for focusing on indoor tasks.",
        "Overcast skies today, but that's great for screen visibility!",
        "Cloudy weather means less glare on your screens!"
      ],
      rainy: [
        "Rainy day ahead! Perfect weather for indoor meetings.",
        "Don't forget your umbrella! Great day for indoor productivity.",
        "Rainy weather means more time to focus on your tasks!"
      ],
      snowy: [
        "Snowy day! Stay warm and cozy during your meetings.",
        "Winter wonderland outside! Perfect day for virtual meetings.",
        "Snowy weather means more time to focus indoors!"
      ],
      stormy: [
        "Stormy weather ahead! Stay safe and dry.",
        "Thunderstorms today! Perfect day for indoor meetings.",
        "Stormy weather means more time to focus on your tasks!"
      ]
    };

    // Determine temperature category
    let tempCategory;
    if (temp >= 85) tempCategory = 'hot';
    else if (temp >= 75) tempCategory = 'warm';
    else if (temp >= 65) tempCategory = 'mild';
    else if (temp >= 50) tempCategory = 'cool';
    else tempCategory = 'cold';

    // Determine weather category
    let weatherCategory;
    if (code >= 95) weatherCategory = 'stormy';
    else if (code >= 71) weatherCategory = 'snowy';
    else if (code >= 51) weatherCategory = 'rainy';
    else if (code >= 1) weatherCategory = 'cloudy';
    else weatherCategory = 'clear';

    // Get random messages for both temperature and weather
    const tempMessage = tempMessages[tempCategory][Math.floor(Math.random() * tempMessages[tempCategory].length)];
    const weatherMessage = weatherMessages[weatherCategory][Math.floor(Math.random() * weatherMessages[weatherCategory].length)];

    // Combine messages
    return `${tempMessage} ${weatherMessage}`;
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/send-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send verification code");
      }

      setIsCodeSent(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // First verify the code
      const verifyResponse = await fetch("http://localhost:5000/api/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      if (!verifyResponse.ok) {
        throw new Error("Invalid verification code");
      }

      // If code is verified, proceed with login
      const loginResponse = await fetch("http://localhost:5000/api/user/login-or-create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save user data to localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Navigate to home page
      navigate("/home");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Welcome</h1>
        <p className="subtitle">Sign in with your email to continue</p>

        {/* Simple Weather Display */}
        {weather && (
          <div className="weather-display">
            <div className="weather-info">
              <span className="temperature">{weather.temperature}°F</span>
              <span className="description">{getWeatherDescription(weather.weatherCode)}</span>
              <span className="weather-message">{getWeatherMessage(weather.temperature, weather.weatherCode)}</span>
            </div>
          </div>
        )}

        {/* Fact Display */}
        <div className="fact-display">
          <h3>Did You Know?</h3>
          <p className="fact-text">{currentFact}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        {!isCodeSent ? (
          <form onSubmit={handleSendCode}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <button type="submit" className="login-btn">
              Send Verification Code
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode}>
            <div className="form-group">
              <label htmlFor="verificationCode">Verification Code</label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter the code sent to your email"
                required
              />
            </div>

            <button type="submit" className="login-btn">
              Verify & Continue
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Login; 