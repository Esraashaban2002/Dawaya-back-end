const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
   host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure:false,
  family: 4,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async ({ to, subject, html}) => {
  try {
    console.log('Sending to:', to);
    console.log('USER:', process.env.EMAIL_USER);
    console.log('PASS exists:', !!process.env.EMAIL_PASS);
    
    const mailOptions = {
      from: `"Dawaya" <${process.env.EMAIL_USER}>` ,
      to,
      subject,
      html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent:', result);
  } catch (error) {
    console.error('Email error:', error.message);
    throw error;
  }
};

module.exports = { sendEmail }