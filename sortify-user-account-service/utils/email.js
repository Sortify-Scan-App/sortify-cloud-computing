const nodemailer = require('nodemailer');
require("dotenv").config();

// Config transport SMTP
const transporter = nodemailer.createTransport({
    //service: 'gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASS, 
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: process.env.ACCESS_TOKEN,
    },
});
async function sendOtpEmail(to, otp) {
    const mailOptions = {
        from: process.env.EMAIL,
        to,
        subject: "Sortify OTP Code",
        text: `Your OTP code is: ${otp}`,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('OTP email send successfully');
    } catch (error) {
        console.log('Error sending OTP email', error);
        throw new Error('Failed to send OTP email')
    }
}

module.exports = { sendOtpEmail };