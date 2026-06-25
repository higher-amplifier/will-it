<div align="center">

# 🕯️ WillIt

### *The internet finally has a dead man's switch.*

<br/>

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Google OAuth](https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white)
![AES-256](https://img.shields.io/badge/AES--256-Encrypted-red?style=for-the-badge&logo=letsencrypt&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-0F9DCE?style=for-the-badge&logo=gmail&logoColor=white)

</div>

---

## 🧠 The Concept

A **dead man's switch** is a mechanism that activates when someone *stops* acting — not when they do.

Nuclear facilities use them. Trains use them. Militaries use them.

**WillIt brings that to your digital life.**

You store messages, passwords, final instructions — encrypted. You check in periodically. As long as you check in, nothing happens. The moment you go dark long enough — the switch flips, and everything reaches the right people. Automatically. No human in the loop. No override.

> *It's not about death. It's about control — and making sure the right information survives you.*

---

## 🔐 What people actually store

- Last messages to people who matter
- **Account passwords and credentials** — so loved ones aren't locked out of your entire digital life
- Bank details, insurance info, legal instructions
- Anything that needs to survive you — but only if you can no longer stop it

---

## ⚡ How It Works

<div align="center">

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   📝 Write letters, passwords, instructions                     │
│   👤 Assign each one to a nominee                               │
│   ⏱️  Set your check-in interval (1 month → 20 years)           │
│                                                                 │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│              🔁  ARE YOU STILL THERE?                           │
│                                                                 │
│   ✅  Checked in?   →   clock resets. nothing happens.          │
│   ❌  Gone dark?    →   cron fires.                             │
│                         letters decrypt.                        │
│                         nominees get the email.                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

</div>

---

## 🖥️ UI Highlights

The UI is dark and intentional — nothing cheerful about a dead man's switch.

| Screen | What it does |
|---|---|
| 🏠 **Dashboard** | Live countdown to next check-in — turns red as deadline approaches |
| 💓 **Check-in button** | One click. Resets everything. The only thing standing between your nominees and your letters. |
| ✍️ **Letter editor** | Write per nominee, encryption status shown inline |
| 🔑 **Vault** | Separate section for passwords & credentials — clearly distinct from letters |
| 👥 **Nominee manager** | Add people, assign letters, control who gets what |
| ⏳ **Timer bar** | Visual progress of how much of your window is left |

---

## 🛠️ Tech Stack

```
Frontend      →  React
Backend       →  Node.js + Express
Database      →  MongoDB
Encryption    →  AES-256 (encrypted on write, decrypted only at delivery)
Auth          →  JWT + bcrypt + Google OAuth via Passport.js
Email         →  Nodemailer
Scheduler     →  node-cron  ← the actual switch. scans every user. pulls the trigger.
```

---

## 📁 Structure

```
willit/
├── client/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── context/            # global auth state
│       └── utils/
│
└── server/
    ├── models/
    │   ├── User.js             # stores last check-in timestamp + interval
    │   ├── Letter.js           # stores AES-encrypted content only
    │   └── Nominee.js          # recipient info
    ├── controllers/
    ├── middleware/             # JWT guard on protected routes
    ├── jobs/
    │   └── switchChecker.js    # runs on cron, finds overdue users, fires delivery
    └── utils/
        ├── encrypt.js          # AES-256 encrypt / decrypt
        └── mailer.js           # nodemailer delivery
```

---

## 🛣️ API

```
POST   /api/auth/register         register
POST   /api/auth/login            login
GET    /api/auth/google           Google OAuth

POST   /api/letters               create letter (encrypted on write)
GET    /api/letters               fetch all
PUT    /api/letters/:id           update
DELETE /api/letters/:id           delete

POST   /api/nominees              add a nominee
GET    /api/nominees              list nominees

POST   /api/checkin               💓 I'm alive — resets the clock
GET    /api/checkin/status        time left before switch flips
```

---

## 🔒 Security

| Threat | How WillIt handles it |
|---|---|
| DB breach | Letters are AES-256 ciphertext — useless without the key |
| Password leak | bcrypt hashed — not reversible |
| Session hijack | Short-lived JWTs, stateless and signed |
| Unauthorized access | JWT middleware on every protected route |
| Plaintext exposure | Decryption only at delivery — never stored or logged in plain |
