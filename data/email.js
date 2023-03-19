const nodemailer = require("nodemailer");

async function sendEmail(formData) {
  console.log('sendEmail Called');
  console.log(formData);
  // Configure your email transport using your email credentials
  let transporter = nodemailer.createTransport({
    service: "gmail", // You can use other email services like Yahoo, Outlook, etc.
    auth: {
      user: "coc.mail93@gmail.com",
      pass: "Oldat1993!",
    },
  });

  // Set up email options
  let mailOptions = {
    from: "konnor.young93@gmail.com",
    to: "coc.mail93@gmail.com",
    subject: "Private Tasting Contact",
    text: `Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Date: ${formData.date}
Message: ${formData.message}`,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
}

module.exports = {
  sendEmail,
}