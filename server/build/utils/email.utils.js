"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_utils_1 = require("./nodemailer.utils");
// Function to send registration success email
const sendRegistrationSuccessEmail = async (user) => {
    // Create a success message with user details
    const htmlContent = `
        <h1>Welcome to Our Platform, ${user.first_name}!</h1>
        <p>We're excited to have you on board. Your account has been successfully created.</p>
        <p>Your registered email: ${user.email}</p>
        <p>If you have any questions or need assistance, feel free to contact us.</p>
        <p>Best regards,</p>
        <p>The Team</p>
    `;
    // Send the email
    await (0, nodemailer_utils_1.sendEmail)({
        html: htmlContent,
        subject: 'Welcome to Our Platform!',
        to: user.email,
    });
};
exports.default = sendRegistrationSuccessEmail;
