const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER, // your gmail address
    pass: process.env.EMAIL_PASS, // your Gmail app password
  },
});

const sendConfirmationEmail = async (to, confirmUrl) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Confirm your email - CRM IDX",
    html: `
      <h2>Welcome to CRM IDX!</h2>
      <p>Please confirm your email by clicking the link below:</p>
      <a href="${confirmUrl}" target="_blank">Confirm Email</a>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendConfirmationEmail };
