const nodemailer = require('nodemailer');

const sendEmail = async options => {
    //Step 1: Create the Transporter - Our service for sending the email
    const transporter = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
            user: process.env.SENDGRID_USERNAME,
            pass: process.env.SENDGRID_PASSWORD
        }
    });

    //Step 2: Define the email options - The data to be sent as well as the destination
    const mailOptions = {
        from: 'Immanuel Diai',
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    //Step 3: Send the email - The actual sending of the email to the intended user
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;