const nodemailer = require("nodemailer");

module.exports = async function sendEmail(to, subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: `"CRM IDX" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text
    });
  } catch (err) {
    console.error("❌ Email send error:", err);
  }
};
