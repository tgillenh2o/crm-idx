const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

// Your verified sending domain — update if needed
const FROM_EMAIL = "noreply@findingathome.com";

// Base URL for backend (for API links)
const BACKEND_URL = process.env.BASE_URL || "https://crm-idx.onrender.com";

// Optional: Frontend URL (for success redirect after verification)
const FRONTEND_URL = process.env.FRONTEND_URL || "https://crmidxclient.onrender.com"; 
// ^ change this to your actual frontend domain if different

/**
 * Sends an account confirmation email
 */
async function sendConfirmationEmail(to, token) {
  try {
    const confirmUrl = `${BACKEND_URL}/api/auth/verify/${token}`;
    console.log("📨 Sending Resend email to:", to);
    console.log("🔗 Verification URL:", confirmUrl);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "Confirm Your Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <h2 style="color:#111;">Welcome to CRM IDX 👋</h2>
          <p>Thanks for signing up! Please confirm your email address by clicking below:</p>
          <p>
            <a href="${confirmUrl}" 
              style="background-color:#2563eb;color:#fff;padding:10px 16px;border-radius:6px;
              text-decoration:none;display:inline-block;">
              Verify Email
            </a>
          </p>
          <p>If you didn’t create this account, you can safely ignore this message.</p>
          <p style="font-size:12px;color:#888;">© ${new Date().getFullYear()} CRM IDX. All rights reserved.</p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ Error sending email:", error);
    } else {
      console.log("✅ Email sent successfully:", data);
    }
  } catch (err) {
    console.error("💥 sendConfirmationEmail error:", err);
  }
}

/**
 * Sends a success email once the user verifies their account
 */
async function sendVerificationSuccessEmail(to) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: "✅ Email Verified Successfully!",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
          <h2>Your email has been verified!</h2>
          <p>You can now log in to your CRM IDX account.</p>
          <p>
            <a href="${FRONTEND_URL}/login" 
              style="background-color:#16a34a;color:#fff;padding:10px 16px;border-radius:6px;
              text-decoration:none;display:inline-block;">
              Go to Login
            </a>
          </p>
        </div>
      `,
    });

    console.log(`✅ Verification success email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending verification success email:", error);
  }
}

module.exports = {
  sendConfirmationEmail,
  sendVerificationSuccessEmail,
};
