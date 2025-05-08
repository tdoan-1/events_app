const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const markers = await prisma.markers.findMany({
      orderBy: { marker_id: 'desc' },
      take: 15
    });
    res.json(markers);
  } catch (err) {
    console.error("Error fetching markers:", err);
    res.status(500).json({ message: "Failed to fetch markers" });
  }
});

module.exports = router;
