const nodemailer = require("nodemailer");

// Create a nodemailer transporter with your email service credentials
const transporter = nodemailer.createTransport({
  host: "mail.premiumdigitalaffiliate.com",
  port: 465,
  secure: true, // use TLS

  auth: {
    user: process.env.MY_EMAIL,
    pass: process.env.MY_PASS,
  },
});

// Function to send verification email
async function sendVerificationEmail(email, verificationToken) {
  try {
    // Create email message
    const mailOptions = {
      from: process.env.MY_EMAIL, // Sender address
      to: email, // Recipient address
      subject: "Account Verification", // Email subject
      html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Email Verification</title>
        </head>
      
        <body
          style="
            margin: 0;
            padding: 0;
            font-family: sans-serif;
            box-sizing: border-box;
          "
        >
          <div style="display: flex; justify-content: center; align-items: center">
            <div
              style="
                max-width: 28rem;
                margin-left: auto;
                margin-right: auto;
                background-color: rgba(255, 255, 255, 0.384);
                padding: 2rem;
                border-radius: 0.5rem;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                  0 2px 4px -1px rgba(0, 0, 0, 0.06);
              "
            >
              <h2
                style="
                  font-size: 1.875rem;
                  line-height: 2.25rem;
                  font-weight: 600;
                  text-align: center;
                  margin-bottom: 1rem;
                "
              >
                Premium Digital Affiliate
              </h2>
              <p style="font-size: 1rem; line-height: 1.5rem; text-align: left">
                Hello!
              </p>
              <p style="font-size: 1rem; line-height: 1.5rem; text-align: left">
                Please click the button below to verify your email address.
              </p>
              <div style="text-align: center; margin-bottom: 2rem">
                <!-- <a
                  href="#" -->
                <a
                  href="${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}"
                  style="
                    color: #fff;
                    padding-top: 0.5rem;
                    padding-bottom: 0.5rem;
                    padding-left: 1rem;
                    padding-right: 1rem;
                    border-radius: 0.375rem;
                    background: rgba(0, 98, 194, 0.8);
                    text-decoration: none;
                    display: inline-block;
                  "
                  >Verify Email</a
                >
              </div>
              <p
                style="
                  font-size: 1rem;
                  line-height: 1.5rem;
                  text-align: left;
                  margin-bottom: 2rem;
                "
              >
                If you did not create an account, no further action is required.
              </p>
      
              <p
                style="
                  font-size: 0.875rem;
                  line-height: 1.25rem;
                  text-align: left;
                  margin-bottom: 2rem;
                "
              >
                Regards,<br />Premium Digital Affiliate
              </p>
      
              <p
                style="
                  font-size: 0.875rem;
                  line-height: 1.25rem;
                  text-align: left;
                  margin-bottom: 1rem;
                "
              >
                If you're having trouble clicking the "Verify Email" button, copy and
                paste the URL below into your web browser:
              </p>
              <p
                style="
                  word-break: break-all;
                  font-size: 0.875rem;
                  line-height: 1.25rem;
                  text-align: left;
                  margin-bottom: 1rem;
                "
              >
                ${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}
              </p>
      
              <p
                style="
                  font-size: 0.75rem;
                  line-height: 1rem;
                  text-align: center;
                  margin-bottom: 1rem;
                "
              >
                © 2024 Premium Digital Affiliate. All rights reserved.
              </p>
            </div>
          </div>
        </body>
      </html>
      
      `,
    };

    // Send email
    const res = await transporter.sendMail(mailOptions);
    return res;
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = { sendVerificationEmail };
