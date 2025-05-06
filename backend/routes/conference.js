const express = require('express'); // import Express
const {PrismaClient} = require('@prisma/client');  // import PrismaClient
const prisma = new PrismaClient();  // instantiate PrismaClient
const router = express.Router(); // creating router

// API to fetch list of conferences
router.get('/list', async (req, res) => {
  try {
    const conferences = await prisma.conference.findMany({
      include: {
        users: true
      }
    });
    res.json(conferences);
  } catch (error) {
    console.error("Error fetching conferences:", error);
    res.status(500).json({ message: "Failed to fetch conferences." });
  }
});

// API to fetch a conference by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId)) {
    return res.status(400).json({ message: "Invalid conference ID." });
  }

  try {
    const conference = await prisma.conference.findUnique({
      where: { conference_id: parsedId },
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

// API to create conference
router.post('/create', async (req, res) => {
    const { title, short_name, loca, dates, user_id } = req.body;
    if (!title || !short_name || !loca || !dates || !user_id) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
      // Create the conference first
      const newConference = await prisma.conference.create({
        data: {
          title,
          short_name,
          loca,
          dates: new Date(dates) // make sure this is a Date object
        }
      });

      // Then create the user-conference relationship with admin role (role_id: 2)
      await prisma.users.create({
        data: {
          user_id: parseInt(user_id),
          conference_id: newConference.conference_id,
          role_id: 2 // Admin role
        }
      });

      res.status(201).json({ 
        message: "Conference created successfully.", 
        data: { 
          conference: { title, short_name, loca, dates },
          role: "admin"
        } 
      });
    } 
    catch (error) {
      console.error("Error creating conference:", error);
      res.status(500).json({ message: "Failed to create conference." });
    }
}); 

// Get conferences for a specific user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const userConferences = await prisma.users.findMany({
      where: {
        user_id: parseInt(userId)
      },
      include: {
        conference: true
      }
    });

    res.json(userConferences.map(uc => uc.conference));
  } catch (error) {
    console.error("Error fetching user conferences:", error);
    res.status(500).json({ message: "Failed to fetch user conferences." });
  }
});

// Subscribe to a conference
router.post('/subscribe', async (req, res) => {
  const { user_id, conference_id, role_id } = req.body;

  if (!user_id || !conference_id || !role_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if user is already subscribed
    const existingSubscription = await prisma.users.findFirst({
      where: {
        user_id: parseInt(user_id),
        conference_id: parseInt(conference_id)
      }
    });

    if (existingSubscription) {
      return res.status(400).json({ message: "User is already subscribed to this conference" });
    }

    // Create subscription
    const subscription = await prisma.users.create({
      data: {
        user_id: parseInt(user_id),
        conference_id: parseInt(conference_id),
        role_id: parseInt(role_id)
      }
    });

    res.status(201).json(subscription);
  } catch (error) {
    console.error("Error subscribing to conference:", error);
    res.status(500).json({ message: "Failed to subscribe to conference." });
  }
});

// Unsubscribe from a conference
router.post('/unsubscribe', async (req, res) => {
  const { user_id, conference_id } = req.body;

  if (!user_id || !conference_id) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Delete subscription
    await prisma.users.deleteMany({
      where: {
        user_id: parseInt(user_id),
        conference_id: parseInt(conference_id)
      }
    });

    res.json({ message: "Successfully unsubscribed from conference" });
  } catch (error) {
    console.error("Error unsubscribing from conference:", error);
    res.status(500).json({ message: "Failed to unsubscribe from conference." });
  }
});

// export router to use in `server.js`
module.exports = router;