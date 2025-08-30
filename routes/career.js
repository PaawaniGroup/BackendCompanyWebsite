const express = require("express");
const router = express.Router();
const transporter = require("../config/nodemailer");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    //Original filename with a timestamp to prevent conflicts
    cb(
      null,
      `${file.fieldname}-${file.originalname}-${Date.now()}${path.extname(
        file.originalname
      )}`
    );
  },
});

const upload = multer({ storage: storage });

router.post("/send-career-mail", upload.single("resume"), async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    position,
    experience,
    coverLetter,
  } = req.body;
  const resumeFile = req.file;

  if (!resumeFile) {
    return res.status(400).json({ message: "Resume File is required." });
  }
  console.log(req.body);
  console.log(resumeFile);
  const recipientEmail = process.env.RECIPENT_MAIL;
  const fromEmail = process.env.GMAIL_USER;

  const mailOptions = {
    from: `"${firstName}" <${fromEmail}`,
    replyTo: email,
    to: recipientEmail,
    subject: `New Job Application for the position of ${position}`,
    html: `
        <h2>Hii, Hiring Manager</h2>
        <p>You have got a new job apply through application form on your website. Kindly, go through with it.</p>
        <p><b>Name:</b> ${firstName} ${lastName}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Contact Number:</b> ${phone}</p>
        <p><b>Applied For:</b> ${position}</p>
        <p><b>Experience: ${experience}</b></p>
        <p><b>Cover Letter:</b>${coverLetter}</p>
        `,
    attachments: [
      {
        filename: resumeFile.originalname,
        path: resumeFile.path,
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", req.body);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending mail:", error);
    res
      .status(500)
      .json({ message: "Error sending email. Please try again later." });
  }
});

module.exports = router;
