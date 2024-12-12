const { registerUser, loginUser } = require('../controllers/authControllers');
const { updatePassword } = require('../controllers/updatePasswordControllers');
const { checkSession } = require('../controllers/sessionControllers');
const { verifyOtp } = require('../controllers/authControllers');
const { requestForgotPasswordOtp } = require('../controllers/forgotPasswordControllers');
const { verifyForgotPasswordOtp } = require('../controllers/forgotPasswordControllers');
const { resetPassword } = require('../controllers/forgotPasswordControllers');
const { updateFullName, updateEmail } = require('../controllers/editProfileControllers');

const authRoutes = [
    {
        method: 'POST',
        path: '/auth/signup',
        handler: registerUser,
    },
    {
        method: 'POST',
        path: '/auth/login',
        handler: loginUser,
    },
    {
        method: 'POST',
        path: '/auth/update-password',
        handler: updatePassword,
    },
    {
        method: 'POST',
        path: '/auth/check-session',
        handler: checkSession,
    },
    {
        method: 'POST',
        path: '/auth/verify-otp',
        handler: verifyOtp,
    },
    {
        method: 'POST',
        path: '/auth/forgot-password/request-otp',
        handler: requestForgotPasswordOtp,
    },
    {
        method: 'POST',
        path: '/auth/forgot-password/verify-otp',
        handler: verifyForgotPasswordOtp,
    },
    {
        method: 'POST',
        path: '/auth/forgot-password/reset-password',
        handler: resetPassword,
    },
    {
        method: 'POST',
        path: '/auth/profile/update-fullname',
        handler: updateFullName,
    },
    {
        method: 'POST',
        path: '/auth/profile/update-email',
        handler: updateEmail,
    },
];

module.exports = authRoutes;