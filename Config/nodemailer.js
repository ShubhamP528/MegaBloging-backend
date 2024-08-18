// config/nodemailer.js
const nodemailer = require("nodemailer");

require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "Gmail", // Or use another email service provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendContactEmail = (contact) => {
  console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);
  const mailOptions = {
    from: contact.email,
    to: process.env.EMAIL_USER,
    subject: `Contact Us Message from ${contact.name}`,
    text: contact.message,
    html: `<p><strong>Name:</strong> ${contact.name}</p>
           <p><strong>Email:</strong> ${contact.email}</p>
           <p><strong>Message:</strong> ${contact.message}</p>`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendContactEmail;
