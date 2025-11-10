const nodemailer = require("nodemailer");

exports.sendEmail = async (to, verifyUrl) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.RESEND_API_KEY, // replace with your app password if you use Gmail SMTP
      },
    });

    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f8f9fb; padding: 40px 0;">
        <div style="max-width: 600px; background: #ffffff; margin: 0 auto; padding: 30px; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
          
          <h2 style="text-align: center; color: #2b2b2b;">Welcome to <span style="color:#ff7b00;">CRM IDX</span>!</h2>
          <p style="font-size: 16px; color: #333;">Hi there 👋,</p>
          <p style="font-size: 16px; color: #333;">
            Thanks for signing up! Please confirm your email address by clicking the button below.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" 
               style="background-color: #ff7b00; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: bold; font-size: 16px;">
               Verify My Email
            </a>
          </div>

          <p style="font-size: 14px; color: #666; text-align: center;">
            If the button doesn’t work, you can copy and paste this link into your browser:
          </p>

          <p style="font-size: 14px; color: #007bff; word-break: break-all; text-align: center;">
            <a href="${verifyUrl}" style="color:#007bff;">${verifyUrl}</a>
          </p>

          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">
            This email was sent by CRM IDX. If you didn’t request this, you can safely ignore it.
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: process.env.SMTP_FROM || "CRM IDX <noreply@crmidx.com>",
      to,
      subject: "Verify Your Email - CRM IDX",
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Beautiful verification email sent to:", to);
  } catch (error) {
    console.error("❌ Email sending failed:", error);
  }
};
