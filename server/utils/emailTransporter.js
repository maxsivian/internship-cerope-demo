import nodemailer from "nodemailer"

export const emailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_TRANSPORTER_USER,
        pass: process.env.EMAIL_TRANSPORTER_PASS 
    }
});