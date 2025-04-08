const express = require('express'); // import Express
const { PrismaClient } = require('@prisma/client'); // import PrismaClient
const prisma = new PrismaClient(); // instantiate PrismaClient
const router = express.Router(); // create router

// API to fetch list of talks
router.get('/list', async (req, res) => {
    try {
        const talks = await prisma.talks.findMany({
            orderBy: [
                {
                    talks_id: 'asc' // Adjusted to match the schema
                }
            ]
        });
        res.json(talks);
    } catch (error) {
        console.error("Error fetching talks:", error);
        res.status(500).json({ message: "Failed to fetch talks." });
    }
});

// Export the router to use in `server.js`
module.exports = router;