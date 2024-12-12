const { getUser, updateUser } = require('../services/firestore');
const jwt = require('jsonwebtoken');
require("dotenv").config();

// Update Full Name
const updateFullName = async (req, h) => {
    try {
        const { token, newFullName } = req.payload;
        // Validate input
        if (!token || !newFullName) {
            return h.response({ message: 'Token and new full name are required' }).code(400);
        }
        // Verify token
        const secret = process.env.JWT_SECRET || 'your_secret_key';
        const decoded = jwt.verify(token, secret);
        const users = await getUser();
        const user = users.find((u) => u.id === decoded.id);
        if (!user) {
            return h.response({ message: 'User not found' }).code(404);
        }
        // Update the user's fullname
        await updateUser(user.id, { fullname: newFullName });
        return h.response({ message: 'Full name updated successfully' }).code(200);
    } catch (error) {
        console.error('Update Full Name Error:', error);
        return h.response({ message: 'An internal server error occurred' }).code(500);
    }
};
// Update Email
const updateEmail = async (req, h) => {
    try {
        const { token, newEmail } = req.payload;
        // Validate input
        if (!token || !newEmail) {
            return h.response({ message: 'Token and new email are required' }).code(400);
        }
        // Verify token
        const secret = process.env.JWT_SECRET || 'your_secret_key';
        const decoded = jwt.verify(token, secret);
        const users = await getUser();
        // Check if the new email is already in use
        const isEmailExists = users.some((u) => u.email === newEmail);
        if (isEmailExists) {
            return h.response({ message: 'Email is already in use' }).code(400);
        }
        const user = users.find((u) => u.id === decoded.id);
        if (!user) {
            return h.response({ message: 'User not found' }).code(404);
        }
        // Update the user's email in the database
        await updateUser(user.id, { email: newEmail });
        return h.response({ message: 'Email updated successfully' }).code(200);
    } catch (error) {
        console.error('Update Email Error:', error);
        return h.response({ message: 'An internal server error occurred' }).code(500);
    }
};

module.exports = { updateFullName, updateEmail };
