const nodemailer = require("nodemailer");

// const MY_EMAIL = process.env.MY_EMAIL;
// const MY_PASS = process.env.MY_PASS;

// Create a nodemailer transporter with your email service credentials
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_PASS,
  },
});

// Function to send password reset email
async function sendPasswordResetEmail(email, token) {
  try {
    // Create email message
    const mailOptions = {
      from: process.env.MY_EMAIL, // Sender address
      to: email, // Recipient address
      subject: "Password Reset", // Email subject
      html: `<p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
            <p>Please click on the following link, or paste this into your browser to complete the process:</p>
            <p><a href="${process.env.FRONTEND_URL}/password.html?token=${token}&email=${email}">Reset Password</a></p>
            <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
    };

    // Send email
    const res = await transporter.sendMail(mailOptions);
    return res;
  } catch (error) {
    return error;
  }
}

module.exports = { sendPasswordResetEmail };
