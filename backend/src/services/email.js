require("dotenv").config();
const nodemailer = require("nodemailer");

// Check env variables
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // 16-char Gmail App Password
  },
});

// Send confirmation email
async function sendConfirmationEmail(to, url) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: "Confirm your email",
      html: `<p>Please confirm your email by clicking <a href="${url}">here</a></p>`,
    });
    console.log("Email sent:", info.messageId);
  } catch (err) {
    console.error("Error sending email:", err);
    throw err;
  }
}

// Quick test function
if (require.main === module) {
  (async () => {
    try {
      await sendConfirmationEmail(
        process.env.EMAIL_USER,
        "https://example.com/confirm?token=123"
      );
      console.log("Test email sent successfully!");
    } catch (err) {
      console.error("Test email failed:", err);
    }
  })();
}

module.exports = { sendConfirmationEmail };
