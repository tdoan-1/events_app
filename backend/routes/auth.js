// backend/routes/auth.js
const express = require("express");
const nodemailer = require("nodemailer");
const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid"); // ✅ Add this
const prisma = new PrismaClient();
const router = express.Router();
require("dotenv").config();

const codes = new Map();

router.post("/send-code", async (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  codes.set(email, code);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Verification Code",
    text: `Your verification code is: ${code}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Code sent to ${email}: ${code}`);
    res.status(200).send("Code sent successfully.");
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).send("Failed to send code.");
  }
});

router.post("/verify-code", (req, res) => {
  const { email, code } = req.body;
  const storedCode = codes.get(email);

  if (storedCode === code) {
    codes.delete(email);
    res.status(200).send("Code verified successfully.");
  } else {
    res.status(400).send("Invalid code.");
  }
});

// API to create a new user or log in an existing one
router.post('/user/login-or-create', async (req, res) => {
  const { email } = req.body;

  // finding the user by email
  try { 
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      let newId, exists = true;
      while (exists) {
        newId = Math.floor(Math.random() * 1000000).toString();
        exists = await prisma.user.findUnique({ where: { id: newId } });
      }

      // creating a new user with a random id
      user = await prisma.user.create({
        data: {
          id: newId,
          email,
          name: email.split("@")[0],
        },
      });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error accessing/creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
