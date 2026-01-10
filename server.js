const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const EMAILS_FILE = path.join(__dirname, 'waitlist.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Initialize emails file if it doesn't exist
if (!fs.existsSync(EMAILS_FILE)) {
    fs.writeFileSync(EMAILS_FILE, JSON.stringify({ emails: [], createdAt: new Date() }, null, 2));
}

// POST endpoint to add email to waitlist
app.post('/api/waitlist', (req, res) => {
    try {
        const { email } = req.body;

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // Read current emails
        const data = JSON.parse(fs.readFileSync(EMAILS_FILE, 'utf8'));

        // Check if email already exists
        if (data.emails.some(e => e.email.toLowerCase() === email.toLowerCase())) {
            return res.status(400).json({ error: 'Email already on waitlist' });
        }

        // Add new email with timestamp
        data.emails.push({
            email,
            timestamp: new Date().toISOString(),
            id: Date.now()
        });

        // Save to file
        fs.writeFileSync(EMAILS_FILE, JSON.stringify(data, null, 2));

        res.json({ success: true, message: 'Email added to waitlist' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET endpoint to retrieve all emails (optional - for admin use)
app.get('/api/waitlist', (req, res) => {
    try {
        const data = JSON.parse(fs.readFileSync(EMAILS_FILE, 'utf8'));
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Leakage waitlist server running on http://localhost:${PORT}`);
    console.log(`📧 Emails are being stored in ${EMAILS_FILE}`);
});
