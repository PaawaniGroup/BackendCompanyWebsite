const express = require('express');
const router = express.Router();
const transporter = require('../config/nodemailer');

router.post('/send-contact-email', async (req, res) => {
    const { name, email, contact, subject, message } = req.body;
    const recipientEmail = process.env.RECIPENT_MAIL;
    const fromEmail = process.env.GMAIL_USER;

    const mailOptions = {
        from: `"${name}" <${fromEmail}>`,
        replyTo: email,
        to: recipientEmail,
        subject: `New Contact Form Submission: ${subject}`,
        html: `
            <h2>Hii, Paawani Group</h2>
            <p>You have got a new query through contact form on your website. Kindly, go through with it.</p>
            <p><b>Name:</b> ${name}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Contact Number:</b> ${contact}</p>
            <p><b>Subject:</b> ${subject}</p>
            <p><b>Message:</b></p>
            <p>${message}</p>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Error sending email. Please try again later.' });
    }
});

module.exports = router;