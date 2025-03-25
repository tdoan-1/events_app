const express = require('express'); // import Express
//const {PrismaClient} = require('@prisma/client');  // import PrismaClient
//const prisma = new PrismaClient();  // instantiate PrismaClient
const router = express.Router(); // creating router

// API to fetch list of conferences
router.get('/list', async (req, res) => {

    // test data
    const testConferences = [
        {
          conf_id: "1",
          date: "2030-06-15",
          time: "3:00pm",
        },
        {
          conf_id: "2",
          date: "2037-07-20",
          time: "10:00am",
        },
      ];
      res.json(testConferences);
    } 
);

// API to create conference
router.post('/create', (req, res) => {
    const { date, time } = req.body;
    if (!date || !time ) {
        return res.status(400).json({ message: "All fields are required" });
    }
    res.status(201).json({ message: "Conference created successfully.", data: { title, location, date } });
});

// export router to use in `server.js`
module.exports = router;
