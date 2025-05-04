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

// API to create a talk
router.post('/create', async (req, res) => {
    const { conference_id, abstract, authors, time_, loca, comments } = req.body;
  
    // Validate required fields
    if (!conference_id || !abstract || !loca) {
      return res.status(400).json({ message: "conference_id, abstract, and loca are required." });
    }
  
    try {
      const newTalk = await prisma.talks.create({
        data: {
          conference_id: parseInt(conference_id),
          abstract,
          authors: authors || null,
          time_: time_ && /^\d{2}:\d{2}$/.test(time_)
            ? new Date(`1970-01-01T${time_}:00`)
            : null,
          loca,
          comments: comments || null
        }
      });
  
      res.status(201).json({
        message: "Talk created successfully.",
        data: newTalk
      });
    } catch (error) {
      console.error("Error creating talk:", error);
      res.status(500).json({ message: "Failed to create talk." });
    }
  });
  



// Export the router to use in `server.js`
module.exports = router;