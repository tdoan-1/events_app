const express = require('express'); // import Express
const {PrismaClient} = require('@prisma/client');  // import PrismaClient
const prisma = new PrismaClient();  // instantiate PrismaClient
const router = express.Router(); // creating router

// API to fetch list of conferences
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

// API to create conference
router.post('/create', (req, res) => {
    const { title, loca, dates } = req.body;
    if (!title || !loca || !dates ) {
        return res.status(400).json({ message: "All fields are required" });
    }
    res.status(201).json({ message: "Conference created successfully.", data: { title, loca, dates } });
}); 

// export router to use in `server.js`
module.exports = router;
