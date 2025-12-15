const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const db = require('../local-db');
const nodemailer = require('nodemailer');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER?.trim(),
        pass: process.env.EMAIL_PASS?.trim()
    }
});

exports.forgotPassword = async (req, res) => {
    try {
        let { email } = req.body;
        if (typeof email !== 'string') return res.status(400).json({ success: false, message: "Invalid input." });
        email = email.trim().toLowerCase();

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Invalid email." });
        }

        const user = db.users.findByEmail(email);

        if (!user) {
            console.log(`[Forgot Password] User not found: ${email}`);
            return res.status(200).json({ success: true, message: "If your account exists, a reset link has been sent." });
        }

        // Generate Token
        const rawToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
        const expiresAt = new Date(Date.now() + 3600000).toISOString();

        db.tokens.create(user.id, tokenHash, expiresAt);

        // Send Email
        const resetLink = `http://localhost:5173/reset-password?token=${rawToken}`;
        const mailOptions = {
            from: `"Medivia Security" <${process.env.EMAIL_USER?.trim()}>`,
            to: email,
            subject: "Reset Your Password",
            html: `
                <h3>Medivia Password Reset</h3>
                <p>Click below to reset your password:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>Expires in 1 hour.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`[Success] Email sent to ${email}`);
        res.status(200).json({ success: true, message: "If your account exists, a reset link has been sent." });

    } catch (error) {
        console.error("Auth Error:", error);
        res.status(500).json({ success: false, message: "Server error during request." });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token || !password) return res.status(400).json({ success: false, message: "Missing data." });

        const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
        const validTokenRecord = db.tokens.findValid(tokenHash);

        if (!validTokenRecord) {
            return res.status(400).json({ success: false, message: "Invalid or expired token." });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        db.users.updatePassword(validTokenRecord.user_id, passwordHash);
        db.tokens.markUsed(validTokenRecord.id);

        res.status(200).json({ success: true, message: "Password updated successfully." });
    } catch (error) {
        console.error("Reset Error:", error);
        res.status(500).json({ success: false, message: "Server error during reset." });
    }
};
