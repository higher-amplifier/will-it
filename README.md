# WillIt — Digital Legacy Platform

A dead man's switch web app. Write letters, name a nominee, and if you stop checking in — your letters get automatically delivered.

## Stack
- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Cache/Jobs**: Redis + node-cron
- **Auth**: JWT + bcrypt
- **Encryption**: AES-256 (crypto-js)
- **Email**: Nodemailer (Gmail SMTP)

## Setup

### 1. Clone and install
```bash
npm run install:all
```

### 2. Configure environment
```bash
cp server/.env.example server/.env
```
Fill in your values in `server/.env`.

For Gmail SMTP: enable 2FA → generate an App Password → use that as `SMTP_PASS`.

### 3. Run locally
```bash
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

### 4. Deploy with Docker
```bash
cp server/.env.example .env
# fill .env values
docker-compose up -d
```

Then build and serve the frontend separately:
```bash
cd client && npm run build
# serve dist/ with nginx or Vercel
```

## How it works

1. User registers, sets a check-in interval (7–90 days)
2. Writes encrypted letters with a nominee's email
3. Cron job runs daily at 9 AM — checks every user's last check-in
4. At 80% of the interval → sends a reminder email with a one-click check-in link
5. At 100% → decrypts all letters and emails them to the nominee
6. Trigger is irreversible until the user checks in again

## Project Structure
```
willit/
├── server/
│   ├── models/       # Mongoose schemas
│   ├── routes/       # Express routes
│   ├── middleware/   # JWT auth
│   ├── utils/        # Mailer, encryption
│   ├── jobs/         # Dead man switch cron
│   └── index.js
└── client/
    └── src/
        ├── pages/    # Landing, Login, Register, Dashboard, Checkin
        ├── components/ # Sidebar, WillModal
        ├── context/  # AuthContext
        └── utils/    # Axios instance
```
