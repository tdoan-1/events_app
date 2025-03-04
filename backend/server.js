const express = require('express');  // import Express
const cors = require('cors');  // allows frontend to connect
const {PrismaClient} = require('@prisma/client');  // import PrismaClient
const prisma = new PrismaClient();  // instantiate PrismaClient

const app = express();
app.use(cors());  // enable CORS
const conferenceRoutes = require('./routes/conference'); // import routes
app.use('/api/conference', conferenceRoutes); // use the routes
app.use(express.json());  // allow JSON request bodies

// test database
app.get('/test-db', async (req, res) => {
    try {
        const conference = await prisma.conference.findMany(); // fetch all conferences
        res.json(conference);
    } catch (error) {
        res.status(500).json({ error: "Database query failed" });
    }
});

// test route
app.get('/', (req, res) => {
    res.send('Can Confirm: Backend Works.');
});

// starting server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`GREATEST SERVER ON PORT ${PORT}`));
