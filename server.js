const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");

// Initialize express app
const app = express();
const port = process.env.PORT || 10000;

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// Directly specify email credentials
const EMAIL_USER = "akilanammudhina02@gmail.com";
const EMAIL_PASS = "dkql labe rtac dlkb";
const EMAIL_RECEIVER = "ammudhina02@gmail.com";

// Create a Nodemailer transporter using SMTP
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // Use SSL
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

// Route to serve the main.html file at the root URL
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "main.html"));
});

// Route for serving feedback.html
app.get("/feedback", (req, res) => {
    res.sendFile(path.join(__dirname, "feedback.html"));
});

// Route for submitting feedback form
app.post("/submit-feedback", (req, res) => {
    const { name, email, message } = req.body;

    let mailOptions = {
        from: EMAIL_USER,
        to: EMAIL_RECEIVER,
        subject: "New Feedback Submission",
        text: `New Feedback Submission:\n\nName: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            return res.status(500).send("Error sending email");
        } else {
            console.log("Email sent:", info.response);
            return res.redirect("/thank-you.html"); // Redirect to thank-you page on success
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
