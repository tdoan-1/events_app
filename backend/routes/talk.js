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
  
  // API to flag talks
  router.post('/flag', async (req, res) => {
    const { user_id, talks_id } = req.body;
  
    if (!user_id || !talks_id) {
      return res.status(400).json({ message: "Missing user_id or talks_id" });
    }
  
    try {
      await prisma.own_talks.create({
        data: {
          user_id: parseInt(user_id),
          talks_id: parseInt(talks_id)
        }
      });
  
      const talk = await prisma.talks.findUnique({
        where: { talks_id: parseInt(talks_id) }
      });
  
      const descText = talk.abstract.length > 25
        ? `${talk.abstract.slice(0, 25)}...`
        : talk.abstract;

      await prisma.markers.create({
        data: {
          marker_desc: `🚩 Flagged: "${descText}"`
        }
      });
  
      res.status(201).json({ message: "Talk flagged and marker added." });
    } catch (error) {
      if (error.code === 'P2002') {
        res.status(400).json({ message: "Talk already flagged." });
      } else {
        console.error("Error flagging talk:", error);
        res.status(500).json({ message: "Failed to flag talk." });
      }
    }
  });
  
  
// API to unflag talks
router.delete('/unflag', async (req, res) => {
  const { user_id, talks_id } = req.body;

  if (!user_id || !talks_id) {
    return res.status(400).json({ message: "Missing user_id or talks_id" });
  }

  try {
    const deleted = await prisma.own_talks.deleteMany({
      where: {
        user_id: parseInt(user_id),
        talks_id: parseInt(talks_id)
      }
    });
    if (deleted.count === 0) {
      return res.status(404).json({ message: "Flag not found." });
    }
    res.status(200).json({ message: "Talk unflagged successfully." });
  } catch (error) {
    console.error("Error unflagging talk:", error);
    res.status(500).json({ message: "Failed to unflag talk." });
  }
});

// API to get flagged talks for a user
router.get('/flagged', async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ message: "Missing user_id" });

  try {
    const flagged = await prisma.own_talks.findMany({
      where: { user_id: parseInt(user_id) }
    });
    res.json(flagged);
  } catch (error) {
    console.error("Error fetching flagged talks:", error);
    res.status(500).json({ message: "Failed to fetch flagged talks." });
  }
});

// Export the router to use in `server.js`
module.exports = router;