const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const { GMAIL_USER, GMAIL_APP_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
    },
});

module.exports = transporter;