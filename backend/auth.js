const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

const codes = new Map(); // Temporary in-memory store for codes

router.post("/send-code", async (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit code
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
    res.status(200).send("Code sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Failed to send code.");
  }
});

router.post("/verify-code", (req, res) => {
  const { email, code } = req.body;
  const storedCode = codes.get(email);

  if (storedCode === code) {
    codes.delete(email); // Remove the code after successful verification
    res.status(200).send("Code verified successfully.");
  } else {
    res.status(400).send("Invalid code.");
  }
});

module.exports = router;
