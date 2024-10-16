import nodemailer from "nodemailer";

const sendMail = async (email, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "anupamy571@gmail.com",
      pass: process.env.MAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.MAIL_USERNAME,
    to: email,
    subject,
    html: message,
  };

  try {
    const info = await transporter.sendMail(mailOptions); // Await the Promise
    return info;
  } catch (error) {
    console.log("Error from sendMail:", error);
  }
};

export default sendMail;
