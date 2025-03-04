const express = require('express'); // import Express
const {PrismaClient} = require('@prisma/client');  // import PrismaClient
const prisma = new PrismaClient();  // instantiate PrismaClient
const router = express.Router(); // creating router

// API to fetch list of conferences
router.get('/list', (req, res) => {

    // test data
    res.json([
        { title: "Tech Meeting", location: "Silvercreek", date: "2030-06-15" },
        { title: "World Summit", location: "New York City", date: "2034-07-20" }
    ]);

    // fetch data from database
    /*
    try {
        const conferences = await prisma.conference.findMany();
        res.json(conferences);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch conferences" });
    }
    */
});

// API to create conference
router.post('/create', (req, res) => {
    const { title, location, date } = req.body;
    if (!title || !location || !date) {
        return res.status(400).json({ message: "All fields are required" });
    }
    res.status(201).json({ message: "Conference created successfully.", data: { title, location, date } });
});

// export router to use in `server.js`
module.exports = router;
