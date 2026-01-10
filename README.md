# Leakage - Waitlist Landing Page

## Setup & Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
```bash
npm start
```

The server will run on `http://localhost:3000`

### 3. Open the Landing Page
Visit `http://localhost:3000` in your browser

## Waitlist Management

### View All Emails
- **File**: `waitlist.json` - Contains all submitted emails with timestamps
- **API Endpoint**: `GET /api/waitlist` - Retrieve all emails as JSON

### Example API Response
```json
{
  "emails": [
    {
      "email": "user@example.com",
      "timestamp": "2026-01-10T12:34:56.789Z",
      "id": 1234567890
    }
  ],
  "createdAt": "2026-01-10T12:00:00.000Z"
}
```

## Features

✅ Beautiful landing page with Tailwind CSS  
✅ Email validation on form submission  
✅ Duplicate email prevention  
✅ Persistent storage (JSON file)  
✅ Timestamps for each signup  
✅ Error handling & user feedback  
✅ Smooth animations  

## Files

- `index.html` - Landing page
- `server.js` - Express backend
- `package.json` - Dependencies
- `waitlist.json` - Stored emails (auto-generated)
- `leakage_logo.png` - Logo
- `icon.png` - Favicon

## Next Steps

To scale this:
1. Replace `waitlist.json` with a database (MongoDB, PostgreSQL, etc.)
2. Add email verification
3. Set up an email service to send confirmation emails
4. Add an admin dashboard to view/manage signups
5. Deploy to production (Heroku, Vercel, Railway, etc.)
