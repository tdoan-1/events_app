const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// GET /api/conference/list?email=someone@example.com
router.get('/list', async (req, res) => {
  const email = req.query.email;

  try {
    if (!email) {
      // fallback to all conferences
      const allConfs = await prisma.conference.findMany({
        orderBy: { conference_id: 'asc' }
      });
      return res.json(allConfs);
    }

    // Step 1: Get 6-digit user ID from auth user table
    const authUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!authUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const baseId = authUser.id.toString();

    // Step 2: Get all users entries whose user_id starts with baseId
    const linked = await prisma.users.findMany();
    const userEntries = linked.filter(u =>
      u.user_id.toString().startsWith(baseId)
    );

    const conferenceIds = userEntries.map(u => u.conference_id);

    // Step 3: Get conference details
    const subscribedConfs = await prisma.conference.findMany({
      where: { conference_id: { in: conferenceIds } },
      orderBy: { conference_id: 'asc' }
    });

    res.json(subscribedConfs);
  } catch (error) {
    console.error("Error fetching user conferences:", error);
    res.status(500).json({ message: "Failed to fetch subscribed conferences" });
  }
});

// POST /api/conference/subscribe
router.post('/subscribe', async (req, res) => {
  const { conferenceId, userEmail } = req.body;

  try {
    console.log('Subscription attempt:', { conferenceId, userEmail });

    if (!conferenceId || !userEmail) {
      console.log('Missing required fields:', { conferenceId, userEmail });
      return res.status(400).json({ message: "Conference ID and user email are required" });
    }

    const authUser = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!authUser) {
      console.log('User not found:', userEmail);
      return res.status(404).json({ message: "User not found." });
    }

    console.log('Found user:', { userId: authUser.id, email: authUser.email });

    const baseId = authUser.id.toString();
    const allUsers = await prisma.users.findMany();

    // Check for existing subscription
    const existing = allUsers.find(
      u => u.user_id.toString().startsWith(baseId) && u.conference_id === conferenceId
    );

    if (existing) {
      console.log('User already subscribed:', { userId: existing.user_id, conferenceId });
      return res.status(200).json({ message: "Already subscribed." });
    }

    // Find unique 2-digit suffix
    let suffix = 0;
    let combinedId;
    const existingIds = allUsers.map(u => u.user_id.toString());

    while (suffix < 100) {
      combinedId = parseInt(baseId + suffix.toString().padStart(2, "0"));
      if (!existingIds.includes(combinedId.toString())) break;
      suffix++;
    }

    if (suffix >= 100) {
      console.log('No available user_id slots for:', { baseId });
      return res.status(500).json({ message: "No available user_id slots." });
    }

    console.log('Creating subscription with:', { combinedId, conferenceId });

    // Insert new subscription
    const newSubscription = await prisma.users.create({
      data: {
        user_id: combinedId,
        conference_id: conferenceId,
        role_id: 1
      }
    });

    console.log('Subscription created successfully:', newSubscription);
    res.status(201).json({ message: "Subscribed successfully.", data: newSubscription });
  } catch (error) {
    console.error("Subscribe error:", error);
    res.status(500).json({ message: "Failed to subscribe." });
  }
});

// DELETE /api/conference/unsubscribe
router.delete('/unsubscribe', async (req, res) => {
  const { conferenceId, userEmail } = req.body;

  try {
    const authUser = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (!authUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const baseId = authUser.id.toString();
    const allLinks = await prisma.users.findMany();

    const entriesToDelete = allLinks.filter(
      u =>
        u.conference_id === conferenceId &&
        u.user_id.toString().startsWith(baseId)
    );

    const idsToDelete = entriesToDelete.map(e => e.user_id);

    await prisma.users.deleteMany({
      where: {
        user_id: { in: idsToDelete },
        conference_id: conferenceId
      }
    });

    res.status(200).json({ message: "Unsubscribed successfully." });
  } catch (error) {
    console.error("Unsubscribe error:", error);
    res.status(500).json({ message: "Failed to unsubscribe." });
  }
});

// GET /api/conference/:id
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
  const { title, short_name, loca, dates, userEmail } = req.body;

  if (!title || !short_name || !loca || !dates || !userEmail) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // 1. Create conference
    const newConference = await prisma.conference.create({
      data: {
        title,
        short_name,
        loca,
        dates: new Date(dates)
      }
    });

    // 2. Find user who created it
    const authUser = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!authUser) return res.status(404).json({ message: "User not found." });

    const baseId = authUser.id.toString();
    const allUsers = await prisma.users.findMany();
    const existingIds = allUsers.map(u => u.user_id.toString());

    // 3. Find unique user_id with suffix
    let suffix = 0;
    let combinedId;
    while (suffix < 100) {
      combinedId = parseInt(baseId + suffix.toString().padStart(2, "0"));
      if (!existingIds.includes(combinedId.toString())) break;
      suffix++;
    }

    if (suffix >= 100) {
      return res.status(500).json({ message: "No available user_id slots." });
    }

    // 4. Create admin link in `users` table
    await prisma.users.create({
      data: {
        user_id: combinedId,
        conference_id: newConference.conference_id,
        role_id: 2 // mark as admin
      }
    });

    res.status(201).json({
      message: "Conference created and admin assigned.",
      data: newConference
    });

  } catch (error) {
    console.error("Create conference error:", error);
    res.status(500).json({ message: "Failed to create conference." });
  }
});

module.exports = router;
