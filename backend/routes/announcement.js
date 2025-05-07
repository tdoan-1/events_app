const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// Get announcements for a conference
router.get('/conference/:conferenceId', async (req, res) => {
  const { conferenceId } = req.params;

  try {
    const reminders = await prisma.reminder.findMany({
      where: {
        conference_id: parseInt(conferenceId)
      },
      orderBy: {
        reminder_id: 'desc'
      }
    });

    // Transform reminders to match the expected announcement format
    const announcements = reminders.map(reminder => ({
      announcement_id: reminder.reminder_id,
      announcement_desc: reminder.title,
      created_at: reminder.Event_time
    }));

    res.json(announcements);
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ message: "Failed to fetch announcements." });
  }
});

// Create a new announcement (admin only)
router.post('/create', async (req, res) => {
  const { conference_id, user_id, announcement_desc } = req.body;

  if (!conference_id || !user_id || !announcement_desc) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Get all users for this conference
    const allUsers = await prisma.users.findMany({
      where: {
        conference_id: parseInt(conference_id)
      }
    });

    // Check if any user entry matches the pattern
    const userRole = allUsers.find(u => 
      u.user_id.toString().startsWith(user_id.toString()) && 
      u.role_id === 2
    );

    if (!userRole) {
      return res.status(403).json({ message: "Only admins can create announcements" });
    }

    // Create reminder with the message content
    const reminder = await prisma.reminder.create({
      data: {
        conference_id: parseInt(conference_id),
        title: announcement_desc,
        Event_time: new Date()
      }
    });

    res.status(201).json(reminder);
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({ message: "Failed to create announcement." });
  }
});

module.exports = router; 