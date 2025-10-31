require("dotenv").config();
const nodemailer = require("nodemailer");

// Print environment variables to verify they're loading
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Loaded" : "❌ Missing");

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ Missing EMAIL_USER or EMAIL_PASS in .env file");
  process.exit(1);
}

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send test email
async function sendTestEmail() {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "yourpersonalemail@gmail.com", // <-- change this to your real inbox
      subject: "✅ Gmail Nodemailer Test",
      text: "If you're reading this, Gmail + Nodemailer is working!",
    });
    console.log("✅ Test email sent successfully!");
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}

sendTestEmail();
