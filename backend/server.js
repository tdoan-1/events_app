const express = require('express');  // import Express
const cors = require('cors');  // allows frontend to connect
const {PrismaClient} = require('@prisma/client');  // import PrismaClient
const prisma = new PrismaClient();  // instantiate PrismaClient

const app = express();
app.use(cors());  // enable CORS
app.use(express.json());  // allow JSON request bodies
const conferenceRoutes = require('./routes/conference'); // import routes
app.use('/api/conference', conferenceRoutes); // use the routes

// route for database
app.get('/db', async (req, res) => {
    try {
        const conference = await prisma.conference.findMany(); // fetch all conferences
        res.json(conference);
    } catch (error) {
        console.error("Error in /db route:", error);
        res.status(500).json({ error: "Failed to fetch conferences from server.js" });
    }
});

// root route
app.get('/', (req, res) => {
    res.send('Backend server is running 🚀');
});

// starting server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`GREATEST SERVER ACTIVATED: PORT ${PORT}`));
