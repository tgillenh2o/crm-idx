const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendConfirmationEmail(to, token) {
  const confirmUrl = `${process.env.FRONTEND_URL}/confirm-email/${token}`;
  const message = {
    from: `"CRM IDX" <${process.env.SMTP_USER}>`,
    to,
    subject: "Confirm your email",
    html: `<p>Welcome! Confirm your email:</p><a href="${confirmUrl}">Confirm Email</a>`,
  };
  await transporter.sendMail(message);
}

module.exports = { sendConfirmationEmail };
