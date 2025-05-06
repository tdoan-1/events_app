const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// GET /api/conference/list?email=someone@example.com
router.get('/list', async (req, res) => {

    try {
        const conferences = await prisma.conference.findMany({
          orderBy: [
            {
              conference_id: 'asc'
            }
          ]
    });
        res.json(conferences);

    } 
    catch (error) {
      console.error("Error fetching conferences:", error);
      res.status(500).json({ message: "Failed to fetch conferences from conference.js" });
    }
  } 
);

// API to fetch a conference by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    return res.status(400).json({ message: "Invalid conference ID." });
  }

  try {
    const conference = await prisma.conference.findUnique({
      where: { conference_id: parsedId }
    });

    if (!conference) {
      return res.status(404).json({ message: "Conference not found." });
    }

    res.json(conference);
  } catch (error) {
    console.error("Error fetching conference by ID:", error);
    res.status(500).json({ message: "Failed to fetch conference." });
  }
});

// POST /api/conference/create
router.post('/create', async (req, res) => {
    const { title, short_name, loca, dates } = req.body;
    if (!title || !short_name || !loca || !dates ) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const newConference = await prisma.conference.create({
        data: {
          title,
          short_name,
          loca,
          dates: new Date(dates) // make sure this is a Date object
        }
      });

      res.status(201).json({ message: "Conference created successfully.", data: { title, short_name, loca, dates } });
    } 
    catch {
      console.error("Error creating conference:", error);
      res.status(500).json({ message: "Failed to create conference." });
    }
}); 



module.exports = router;
