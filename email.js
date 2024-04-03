// Import Nodemailer
const nodemailer = require('nodemailer');

// Set up email configuration
const transporter = nodemailer.createTransport({
    service: 'smpt.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'rishi1640100@gmail.com',
        pass: 'nfab axnc mumt skze'
    }
});

// Create email message
const mailOptions = {
    from: 'rishi1640100@gmail.com',
    to: 'krishikesh780@gmail.com',
    subject: 'Test Email from Firebase',
    text: 'This is a test email sent from Firebase using Nodemailer.'
};

// Send the email
transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
        console.error('Error occurred while sending email:', error);
    } else {
        console.log('Email sent successfully:', info.response);
    }
});
