const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendEmail = async ({ to, subject, text }) => {
  await transporter.sendMail({
    from: `"CRM IDX" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
  });
};
