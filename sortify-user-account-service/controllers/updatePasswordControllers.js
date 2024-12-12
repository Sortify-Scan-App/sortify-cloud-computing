const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUser, updateUser } = require('../services/firestore');

const updatePassword = async (req, h) => {
    try {
        const { token, newPassword, confirmPassword } = req.payload;
        // Validasi input
        if (!token || !newPassword || !confirmPassword) {
            return h.response({ message: 'New password, and confirm password are required' }).code(400);
        }
        if (newPassword !== confirmPassword) {
            return h.response({ message: 'Passwords do not match' }).code(400);
        }
        // Verifikasi token
        const secret = process.env.JWT_SECRET || 'your_secret_key';
        const decoded = jwt.verify(token, secret);
        // Ambil user berdasarkan ID dari token
        const users = await getUser();
        const user = users.find((u) => u.id === decoded.id);
        if (!user) {
            return h.response({ message: 'User not found' }).code(404);
        }
        // Hash password baru
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        // Update password di database
        await updateUser(user.id, { password: hashedPassword });
        return h.response({ message: 'Password updated successfully' }).code(200);
    } catch (error) {
        console.error('Update Password Error:', error);
        if (error.name === 'JsonWebTokenError') {
            return h.response({ message: 'Invalid token' }).code(401);
        }
        return h.response({ message: 'An internal server error occurred' }).code(500);
    }
};

module.exports = { updatePassword };
