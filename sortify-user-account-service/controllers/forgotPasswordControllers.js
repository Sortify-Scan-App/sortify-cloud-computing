const { getUser, updateUser } = require('../services/firestore');
const bcrypt = require('bcrypt');
const { sendOtpEmail } = require('../utils/email');
const { generateOtp } = require('../utils/otp');

// Temporary storage for OTPs (in-memory, replace with Redis or DB in production)
const otpStore = new Map();
// Request OTP for Forgot Password
const requestForgotPasswordOtp = async (req, h) => {
    try {
        const { email } = req.payload;
        if (!email) {
            return h.response({ message: 'Email is required' }).code(400);
        }
        const users = await getUser();
        const user = users.find((u) => u.email === email);
        if (!user) {
            return h.response({ message: 'Email not found' }).code(404);
        }
        // Generate and store OTP
        const otp = generateOtp();
        otpStore.set(email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 }); 
        // Send OTP to user
        await sendOtpEmail(email, otp);
        return h.response({
            message: 'OTP has been sent to your email. Use it to reset your password.',
        }).code(200);
    } catch (error) {
        console.error('Forgot Password OTP Request Error:', error);
        return h.response({ message: 'An internal server error occurred' }).code(500);
    }
};
// Verify OTP for Forgot Password
const verifyForgotPasswordOtp = async (req, h) => {
    try {
        const { email, otp } = req.payload;
        if (!email || !otp) {
            return h.response({ message: 'Email and OTP are required' }).code(400);
        }
        const otpData = otpStore.get(email);
        if (!otpData) {
            return h.response({ message: 'OTP not found or expired' }).code(400);
        }
        const { otp: storedOtp, expiresAt } = otpData;
        if (Date.now() > expiresAt) {
            otpStore.delete(email); // Remove expired OTP
            return h.response({ message: 'OTP has expired' }).code(400);
        }
        if (storedOtp !== otp) {
            return h.response({ message: 'Invalid OTP' }).code(400);
        }
        // OTP is valid, allow password reset
        otpStore.delete(email);
        return h.response({
            message: 'OTP verified successfully. You can now reset your password.',
        }).code(200);
    } catch (error) {
        console.error('Verify Forgot Password OTP Error:', error);
        return h.response({ message: 'An internal server error occurred' }).code(500);
    }
};
// Reset Password
const resetPassword = async (req, h) => {
    try {
        const { email, newPassword, confirmPassword } = req.payload;
        // Validasi input
        if (!email || !newPassword || !confirmPassword) {
            return h.response({
                message: 'Email, new password, and confirm password are required',
            }).code(400);
        }
        if (newPassword !== confirmPassword) {
            return h.response({ message: 'Passwords do not match' }).code(400);
        }
        const users = await getUser();
        const user = users.find((u) => u.email === email);
        if (!user) {
            return h.response({ message: 'Email not found' }).code(404);
        }
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // Update user's password in the database
        await updateUser(user.id, { password: hashedPassword });
        return h.response({
            message: 'Password has been reset successfully. Please log in with your new password.',
        }).code(200);
    } catch (error) {
        console.error('Reset Password Error:', error);
        return h.response({ message: 'An internal server error occurred' }).code(500);
    }
};

module.exports = {
    requestForgotPasswordOtp,
    verifyForgotPasswordOtp,
    resetPassword,
};
