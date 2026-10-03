 // Path to your User model
import { Role } from '../@types/enum.types'; // Path to your Role enum
import { sendEmail } from './nodemailer.utils';

// Function to send registration success email
const sendRegistrationSuccessEmail = async (user: any) => {
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
    await sendEmail({
        html: htmlContent,
        subject: 'Welcome to Our Platform!',
        to: user.email,
    });
};

export default sendRegistrationSuccessEmail;

