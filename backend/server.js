require('dotenv').config(); // Loads configuration values from .env
console.log("✅ DATABASE_URL loaded as:", process.env.DATABASE_URL);

const express = require('express');           // Import Express
const cors = require('cors');                 // Allows frontend to connect
const { PrismaClient } = require('@prisma/client');  // Import PrismaClient
const prisma = new PrismaClient();            // Instantiate PrismaClient

const app = express();

// ✅ CORS setup (only allow frontend URL during dev)
app.use(cors({ origin: 'http://localhost:5173' }));

// ✅ Allow JSON request bodies
app.use(express.json());

// ✅ Import routes
const conferenceRoutes = require('./routes/conference');
const talkRoutes = require('./routes/talk');
const authRoutes = require('./routes/auth');
app.use('/api', authRoutes);

// ✅ Mount routes
app.use('/api/conference', conferenceRoutes);
app.use('/api/talk', talkRoutes);
app.use('/api', authRoutes); // <-- Handles /send-code and /verify-code

// ✅ Test route to confirm DB connection
app.get('/db', async (req, res) => {
  try {
    const conference = await prisma.conference.findMany();
    res.json(conference);
  } catch (error) {
    console.error("Error in /db route:", error);
    res.status(500).json({ error: "Failed to fetch conferences from server.js" });
  }
});

// ✅ Root route
app.get('/', (req, res) => {
  res.send('Backend server is running 🚀');
});

// ✅ Server setup
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Successfully connected to Prisma DB");

    app.listen(PORT, () => {
      console.log(`✅ GREATEST SERVER ACTIVATED: PORT ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Prisma DB connection failed:", err);
    process.exit(1);
  }
}

startServer(); // 🚀 Launch server
