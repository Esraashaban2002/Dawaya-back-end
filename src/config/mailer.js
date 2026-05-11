// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// const sendEmail = async ({ to, subject, html }) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"Dawaya" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     });

//     console.log("Email sent:", info.messageId);
//   } catch (error) {
//     console.error("Email error:", error.message);
//     throw new Error("Email sending failed");
//   }
// };

// const sendEmail = async ({ to, subject, html }) => {
//   try {
//     const info = await transporter.sendMail({
//       from: `"Dawaya" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     });

//     console.log("Email sent:", info.messageId);
//   } catch (error) {
//     console.error("Email error:", error.message);
//     throw new Error("Email sending failed");
//   }
// };

// module.exports = { sendEmail };


const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY); // ← من env مش في الكود

const sendEmail = async ({ to, subject, html }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "Dawaya <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error("Email sending failed");
    }

    console.log("Email sent:", data.id);
  } catch (error) {
    console.error("Email error:", error.message);
    throw new Error("Email sending failed");
  }
};

module.exports = { sendEmail };