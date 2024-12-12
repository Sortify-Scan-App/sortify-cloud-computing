const { storeUser, getUser } = require('../services/firestore');
const { v4: uuidv4 } = require('uuid'); // Untuk membuat ID unik
const bcrypt = require('bcrypt'); //hash
const jwt = require('jsonwebtoken'); //token
const { sendOtpEmail } = require('../utils/email');
const { generateOtp } = require('../utils/otp');

// Temporary storage for OTPs (in-memory, replace with Redis or DB in production)
const otpStore = new Map();
// Fungsi untuk Register User
const registerUser = async (req, h) => {
    try {
        const { fullname, email, password } = req.payload; 
        // Validasi input
        if (!fullname || !email || !password) {
            return h.response({ message: 'All fields are required' }).code(400);
        }
        // Ambil semua pengguna
        const users = await getUser();
        const isEmailExists = users.some((u => u.email === email));
        if (isEmailExists) {
            return h.response({ message: 'Email already exist' }).code(400);
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Buat ID unik untuk pengguna
        const userId = uuidv4();
        // Simpan ke database Firestore
        await storeUser(userId, {
            fullname,
            email,
            password: hashedPassword, 
            createdAt: new Date().toISOString(),
        });
        return h.response({ message: 'User registered successfully' }).code(201);
    } catch (error) {
        console.error('Registration Error:', error);
        return h.response({ message: 'An internal server error occurred' }).code(500);
    }
};
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key';
// Fungsi untuk Login User
const loginUser = async (req, h) => {
    try {
        const { email, password } = req.payload; 
        // Validasi input
        if (!email || !password) {
            return h.response({ message: 'Email and password are required' }).code(400);
        }
        // Cari pengguna di database
        const users = await getUser(); // Ambil semua pengguna
        const user = users.find((u) => u.email === email);
        console.log('Matched User:', user);
        if (!user) {
            return h.response({ message: 'Invalid email or password' }).code(401);
        }
        
         // Periksa apakah password cocok
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return h.response({ message: 'Invalid email or password' }).code(401);
        }
        // Generate OTP
        const otp = generateOtp();
        // OTP valid for 5 minutes
        otpStore.set(user.email, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });
        // Send OTP ke user
        await sendOtpEmail(user.email, otp);
        return h.response({
            message: 'OTP has been sent to your email. Verify to complete login',
        }).code(200);
    } catch (error) {
        console.error('Login Error', error);
        return h.response({ message: 'An internal server error occurred' }).code(500);
    }
};
// Verify OTP
const verifyOtp = async (req, h) => {
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
            otpStore.delete(email);
            return h.response({ message: 'OTP has expired' }).code(400);
        }
        if (storedOtp !== otp) {
            return h.response({ message: 'invalid OTP' }).code(400);
        }
        // Generate JWT token
        const user = (await getUser()).find((u) => u.email === email);
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            SECRET_KEY,
        );
         // Clear OTP from store after successful verification
        otpStore.delete(email);
        return h.response({
            message: 'Login successful',
            token,
        }).code(200);
    } catch (error) {
        console.error('Verify OTP Error:', error);
        return h.response({ message: 'An internal server error occurred' }).code(500);
    }
};

module.exports = { registerUser, loginUser, verifyOtp };
