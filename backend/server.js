require('dotenv').config(); // Loads configuration values from .env
console.log("✅ DATABASE_URL loaded as:", process.env.DATABASE_URL);

const express = require('express');  // Import Express
const cors = require('cors');  // Allows frontend to connect
const { PrismaClient } = require('@prisma/client');  // Import PrismaClient
const prisma = new PrismaClient();  // Instantiate PrismaClient

const app = express();
app.use(cors());  // Enable CORS
app.use(express.json());  // Allow JSON request bodies

// Import routes
const conferenceRoutes = require('./routes/conference'); // Import conference routes
const talkRoutes = require('./routes/talk'); // Import talk routes

// Use the routes
app.use('/api/conference', conferenceRoutes); // Use conference routes
app.use('/api/talk', talkRoutes); // Use talk routes

// Route for database
app.get('/db', async (req, res) => {
  try {
    const conference = await prisma.conference.findMany(); // Fetch all conferences
    res.json(conference);
  } catch (error) {
    console.error("Error in /db route:", error);
    res.status(500).json({ error: "Failed to fetch conferences from server.js" });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Backend server is running 🚀');
});

// Start server after connecting to the database
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect(); // Connect to the database
    console.log("✅ Successfully connected to Prisma DB");

    app.listen(PORT, () => {
      console.log(`✅ GREATEST SERVER ACTIVATED: PORT ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Prisma DB connection failed:", err);
    process.exit(1); // Exit if DB connection fails
  }
}

startServer(); // Kick off the server
