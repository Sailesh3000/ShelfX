import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendApprovalEmail = async (buyerEmail, bookName) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    host: 'smtp.gmail.com',
    port:587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USR,
      pass: process.env.APP_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USR,
    to: [buyerEmail],
    subject: `Your request for ${bookName} has been approved!`,
    text: `Dear Buyer and Seller, your rental request for Book:- ${bookName} has been approved. Please proceed with the next steps.`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Email sending failed');
  }
};
