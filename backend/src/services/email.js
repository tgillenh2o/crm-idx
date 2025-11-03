const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, verifyUrl) {
  try {
    const data = await resend.emails.send({
      from: "CRM IDX <noreply@findingathome.com>", // ✅ use your verified domain
      to,
      subject: "Verify your CRM IDX account",
      html: `
        <h2>Welcome to CRM IDX!</h2>
        <p>Click below to verify your account:</p>
        <a href="${verifyUrl}" target="_blank"
           style="display:inline-block;padding:10px 15px;background:#ff6b6b;color:white;border-radius:6px;text-decoration:none;">
           Verify Email
        </a>
      `,
    });

    console.log("✅ Email sent:", data);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
}

module.exports = { sendEmail };
