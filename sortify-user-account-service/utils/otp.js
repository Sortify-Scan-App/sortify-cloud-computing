const crypto = require("crypto");

// Fungsi untuk membuat OTP
function generateOtp() {
    return crypto.randomInt(100000, 999999).toString();
}

module.exports = { generateOtp };