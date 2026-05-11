const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
   family: 4, 
});


const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Dawaya" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);
  } catch (error) {
    console.error("Email error:", error.message);
    throw new Error("Email sending failed");
  }
};

module.exports = { sendEmail };


// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
//   connectionTimeout: 10000,
//   socketTimeout: 15000,
//   family: 4,
// });

// transporter.verify((error, success) => {
//   if (error) {
//     console.error("SMTP Connection Failed:", error);
//   } else {
//     console.log("SMTP Ready ✓");
//   }
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

// module.exports = { sendEmail };