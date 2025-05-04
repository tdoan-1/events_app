require('dotenv').config(); // Loads configuration values from .env
console.log("✅ DATABASE_URL loaded as:", process.env.DATABASE_URL);

const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const app = express();

// ✅ Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// ✅ Route imports
const conferenceRoutes = require('./routes/conference');
const talkRoutes = require('./routes/talk');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// ✅ Route mounting
app.use('/api/conference', conferenceRoutes);
app.use('/api/talk', talkRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes); // mount at /api/user-id


// ✅ Test DB connection
app.get('/db', async (req, res) => {
  try {
    const conferences = await prisma.conference.findMany();
    res.json(conferences);
  } catch (error) {
    console.error("Error in /db route:", error);
    res.status(500).json({ error: "Failed to fetch conferences from server.js" });
  }
});

// ✅ Root route
app.get('/', (req, res) => {
  res.send('Backend server is running 🚀');
});

// ✅ Start server
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

startServer();
