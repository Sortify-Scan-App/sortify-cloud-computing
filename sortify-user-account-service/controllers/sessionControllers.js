const jwt = require('jsonwebtoken');

const checkSession = async (req, h) => {
    try {
        const { token } = req.payload;
        if (!token) {
            return h.response({ message: 'Token is required' }).code(400);
        }
        // Verifikasi token
        const secret = process.env.JWT_SECRET || 'your_secret_key';
        const decoded = jwt.verify(token, secret);
        return h.response({
            message: 'Session valid',
            user: {
                id: decoded.id,
                email: decoded.email,
                fullname: decoded.fullname,
            },
        }).code(200);
    } catch (error) {
        console.error('Session Check Error:', error);
        // Jika token tidak valid
        if (error.name === 'JsonWebTokenError') {
            return h.response({ message: 'Invalid token' }).code(401);
        }
        return h.response({ message: 'An internal server error occurred' }).code(500);
    }
};

module.exports = { checkSession };
