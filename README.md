# WillIt 🕯️

> A dead man's switch that makes sure your words reach the right people — even if you can't deliver them yourself.

---

## 💀 What's the problem?

Most people have things they'd want someone to know — after they're gone, or if they go missing, or just *in case*. But those things stay unsaid. Buried in drafts. Locked in your head.

Email drafts don't send themselves. Journals don't get found. And the people who matter most end up with no context, no closure, nothing.

**WillIt fixes that.**

Write what you want. Pick who should get it. Keep checking in — and as long as you do, nothing happens. The moment you stop? Your letters go out. Automatically.

---

## ⚙️ How it works

1. **Sign up** and create your account
2. **Write letters** — one per person, or as many as you want
3. **Add nominees** — the people who should receive them
4. **Set a check-in interval** — anywhere from 1 month to 20 years
5. **Check in regularly** — one click resets the timer
6. **If you stop checking in**, WillIt waits out the interval and then delivers everything

Your letters are AES-256 encrypted at rest. Nobody reads them. Not even us. 🔒

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React |
| Backend | Node.js + Express |
| Database | MongoDB |
| Auth | JWT + bcrypt, Google OAuth (Passport.js) |
| Encryption | AES-256 |
| Emails | Nodemailer |
| Scheduling | node-cron |
| Containers | Docker |

---

## 📁 Project Structure

```
willit/
├── client/                  # React frontend
│   ├── public/
│   └── src/
│       ├── components/      # UI components
│       ├── pages/           # Route-level pages
│       ├── context/         # Auth context
│       └── utils/           # Helpers
│
├── server/                  # Express backend
│   ├── config/              # DB + passport config
│   ├── controllers/         # Route handlers
│   ├── middleware/          # Auth middleware
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   ├── Letter.js
│   │   └── Nominee.js
│   ├── routes/              # API routes
│   ├── jobs/                # Cron jobs (the switch logic)
│   ├── utils/               # Encryption, mailer
│   └── index.js
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 🔐 Environment Variables

Copy `.env.example` to `.env` inside `/server` and fill it in:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_aes256_key

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
EMAIL_FROM=WillIt <noreply@willit.app>

CLIENT_URL=http://localhost:3000
```

---

## 🚀 Getting Started

### With Docker (recommended)

```bash
git clone https://github.com/yourusername/willit.git
cd willit
cp server/.env.example server/.env
# fill in the .env
docker-compose up --build
```

### Without Docker

```bash
# backend
cd server
npm install
npm run dev

# frontend (new terminal)
cd client
npm install
npm start
```

App runs at `http://localhost:3000` 🎉

---

## 📡 API Overview

| Method | Endpoint | What it does |
|---|---|---|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/google` | Google OAuth |
| GET | `/api/auth/me` | Current user |
| POST | `/api/letters` | Create a letter |
| GET | `/api/letters` | Get all letters |
| PUT | `/api/letters/:id` | Update a letter |
| DELETE | `/api/letters/:id` | Delete a letter |
| POST | `/api/nominees` | Add a nominee |
| GET | `/api/nominees` | Get nominees |
| POST | `/api/checkin` | Reset the timer ✅ |
| GET | `/api/checkin/status` | Check timer status |

---

## ⏱️ Check-in Intervals

How long WillIt waits before it sends anything:

`1 month` · `3 months` · `6 months` · `1 year` · `2 years` · `5 years` · `10 years` · `20 years`

Stored as days internally, shown as human-readable text in the UI.

---

## 🛡️ Security

- Passwords hashed with bcrypt
- Letters encrypted with AES-256 before hitting the DB
- Decryption only happens at delivery time
- JWT sessions
- Google OAuth via Passport.js

---

## 🎨 Design

Dark by default — because of course it is.

| Token | Value |
|---|---|
| Background | `#0f0f0f` |
| Accent | `#c84b31` |
| Heading font | Playfair Display |
| Body font | Inter |

---

## 📄 License

MIT
