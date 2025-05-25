const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendShareEmail = async (recipient, link, pdfName = "PDF") => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject: "PDF Shared with You",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>View Shared PDF</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', system-ui, -apple-system, sans-serif; line-height: 1.5; background-color: white;">
          <div style="max-width: 440px; margin: 0 auto; padding: 40px 20px;">
            <!-- Blue Accent Line -->
            <div style="width: 50px; height: 4px; background-color: #2563EB; margin-bottom: 32px;"></div>

            <!-- Header -->
            <div style="margin-bottom: 40px;">
              <h1 style="font-size: 24px; color: #111827; margin: 0 0 12px; font-weight: 600; line-height: 1.3;">
                You've received a PDF document
              </h1>
              <p style="font-size: 16px; color: #6B7280; margin: 0;">
                Access it securely with a single click
              </p>
            </div>

            <!-- Document Info -->
            <div style="margin-bottom: 36px;">
              <div style="border-left: 3px solid #2563EB; padding-left: 16px;">
                <div style="margin-bottom: 6px;">
                  <span style="font-size: 13px; color: #2563EB; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">
                    Document Name
                  </span>
                </div>
                <div style="font-size: 17px; color: #111827; font-weight: 500;">
                  ${pdfName}
                </div>
              </div>
            </div>

            <!-- Action Button -->
            <div style="margin-bottom: 36px;">
              <table cellpadding="0" cellspacing="0" role="presentation" style="width: 100%;">
                <tr>
                  <td>
                    <a href="${link}"
                       style="display: inline-block; background-color: #2563EB; color: white; text-decoration: none;
                              padding: 13px 24px; border-radius: 6px; font-weight: 500; font-size: 15px;
                              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);">
                      View Document
                    </a>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Alternative Link Box -->
            <div style="border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden; margin-bottom: 36px;">
              <div style="padding: 12px 16px; background-color: #F9FAFB; border-bottom: 1px solid #E5E7EB;">
                <span style="font-size: 13px; color: #4B5563; font-weight: 500;">Alternative Access</span>
              </div>
              <div style="padding: 12px 16px; background-color: white;">
                <a href="${link}" 
                   style="color: #2563EB; font-size: 13px; text-decoration: none; 
                          word-break: break-all; display: block; line-height: 1.5;">
                  ${link}
                </a>
              </div>
            </div>

            <!-- Security Notice -->
            <div style="background-color: #F9FAFB; border-radius: 8px; padding: 16px;">
              <p style="margin: 0; color: #4B5563; font-size: 13px; line-height: 1.5;">
                🔒 This is a secure, single-use link. For your security, please don't forward this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent: ${info.response}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};
