const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// Get announcements for a conference
router.get('/conference/:conferenceId', async (req, res) => {
  const { conferenceId } = req.params;

  try {
    const announcements = await prisma.announcement.findMany({
      where: {
        conference_id: parseInt(conferenceId)
      },
      include: {
        user: true,
        conference: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

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
    // Check if user is an admin for this conference
    const userRole = await prisma.users.findFirst({
      where: {
        user_id: parseInt(user_id),
        conference_id: parseInt(conference_id),
        role_id: 2 // Admin role
      }
    });

    if (!userRole) {
      return res.status(403).json({ message: "Only admins can create announcements" });
    }

    const announcement = await prisma.announcement.create({
      data: {
        conference_id: parseInt(conference_id),
        user_id: parseInt(user_id),
        announcement_desc
      }
    });

    res.status(201).json(announcement);
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({ message: "Failed to create announcement." });
  }
});

module.exports = router; 