const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Dawaya" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);
    return true;

  } catch (error) {
    console.error("Email error:", error.message);
    return false;
  }
};

module.exports = {sendEmail};

// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// const sendEmail = async ({email, otp}) => {
//     console.log(email);
// console.log(otp);
//  console.log('EMAIL_USER:', process.env.EMAIL_USER);
//   console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: 'OTP Verification',
//     text: `  Hello,

//         Your verification code is: ${otp}

//         Please enter this code to complete your request.  

//         This code is valid for 3 minutes.

//         Thank you,  
//         Land Choice Team`
//   };

//   await transporter.sendMail(mailOptions);
// };

// module.exports = { sendEmail };