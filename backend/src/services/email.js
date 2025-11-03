// src/services/email.js
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, verifyUrl) {
  try {
    const { data, error } = await resend.emails.send({
      from: "CRM IDX <no-reply@crmidx.com>", // must match your verified domain
      to,
      subject: "Verify your email address",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to CRM IDX!</h2>
          <p>Please verify your email address by clicking the button below:</p>
          <a href="${verifyUrl}" 
             style="background: #007BFF; color: white; padding: 10px 15px; 
                    border-radius: 5px; text-decoration: none;">
            Verify Email
          </a>
          <p>If the button doesn’t work, copy and paste this link into your browser:</p>
          <p>${verifyUrl}</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error("Failed to send email");
    }

    console.log("Verification email sent:", data);
  } catch (err) {
    console.error("Email sending failed:", err);
  }
}

module.exports = { sendEmail };
