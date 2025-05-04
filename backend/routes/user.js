const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// Get internal user_id (Int) from external user email
router.get('/user-id', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // Find the matching auth user
    const authUser = await prisma.user.findUnique({
      where: { email }
    });

    if (!authUser) {
      return res.status(404).json({ message: "User not found in User table." });
    }

    // Find the row in the `users` table linked to this User
    const userRow = await prisma.users.findFirst({
      where: { user_id: Number(authUser.id) }
    });

    if (!userRow) {
      return res.status(404).json({ message: "User not found in users table." });
    }

    res.status(200).json({ user_id: userRow.user_id });
  } catch (error) {
    console.error("Error fetching user ID:", error);
    res.status(500).json({ message: "Failed to fetch user ID." });
  }
});

module.exports = router;
