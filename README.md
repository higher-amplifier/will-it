# WillIt 🕯️

> A dead man's switch web app that automatically delivers your encrypted letters to nominated people if you stop checking in.

---

## 💡 The Idea

People have things they'd want someone to know — after they're gone, or if they disappear, or just *in case*. Those things usually stay unsaid.

WillIt lets you write letters, nominate recipients, and set a timer. As long as you keep checking in, nothing happens. The moment you stop — your letters are delivered automatically.

---

## ⚙️ How It Works

1. Sign up and write your letters
2. Add nominees (who should receive each letter)
3. Set a check-in interval — from 1 month to 20 years
4. Check in periodically with one click to reset the timer
5. If you miss your check-in window, WillIt delivers every letter to its nominee via email

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React |
| Backend | Node.js + Express |
| Database | MongoDB |
| Auth | JWT, bcrypt, Google OAuth (Passport.js) |
| Encryption | AES-256 |
| Email | Nodemailer |
| Scheduling | node-cron |

---

## 📁 Project Structure

```
willit/
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/         # Auth context
│       └── utils/
│
├── server/
│   ├── config/              # DB + Passport setup
│   ├── controllers/         # Business logic
│   ├── middleware/          # JWT auth guard
│   ├── models/
│   │   ├── User.js
│   │   ├── Letter.js
│   │   └── Nominee.js
│   ├── routes/
│   ├── jobs/                # node-cron — the switch logic
│   └── utils/               # AES encryption + mailer
```

---

## 📡 API Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register with email/password |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/google` | Google OAuth login |
| POST | `/api/letters` | Create a letter |
| GET | `/api/letters` | Fetch all letters |
| PUT | `/api/letters/:id` | Edit a letter |
| DELETE | `/api/letters/:id` | Delete a letter |
| POST | `/api/nominees` | Add a nominee |
| POST | `/api/checkin` | Reset the dead man's timer |
| GET | `/api/checkin/status` | Get current timer status |

---

## 🛡️ Security

- Passwords hashed with **bcrypt**
- Letters encrypted with **AES-256** before storage — decrypted only at delivery
- **JWT** for session management
- **Google OAuth** via Passport.js
