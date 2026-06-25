<div align="center">

# 🕯️ WillIt

### *The internet finally has a dead man's switch.*

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

</div>

---

## 🧠 The Concept

A **dead man's switch** is a mechanism that activates when someone *stops* acting — not when they do.

Nuclear facilities use them. Trains use them. Militaries use them.

**WillIt brings that to your digital life.**

You store messages, passwords, final instructions — encrypted. You check in periodically. As long as you check in, nothing happens. The moment you go dark long enough — the switch flips, and everything reaches the right people. Automatically. No human in the loop. No override.

> *It's not about death. It's about control — and making sure the right information survives you.*

---

## 🔐 What People Store

- Last messages to family, friends, or anyone who matters
- Account passwords and credentials — so loved ones aren't locked out
- Legal instructions, insurance details, anything critical
- Anything you'd want someone to have — but **only** if you can no longer stop it

---

## ⚡ How It Works

```
  [ You ]
     │
     ▼
  Write letters → encrypt with AES-256 → store in DB (ciphertext only)
  Add nominees  → who gets what
  Set interval  → 1 month to 20 years
     │
     ▼
  ┌─────────────────────────────────┐
  │        ARE YOU ALIVE?           │
  │                                 │
  │  Checked in?  →  clock resets   │
  │  Gone dark?   →  cron fires     │
  │                 letters decrypt  │
  │                 nominees notified│
  └─────────────────────────────────┘
```

---

## 🖥️ UI

Built dark, built minimal — nothing cheerful about a dead man's switch.

- **Dashboard** — live countdown to your next required check-in, turns red as deadline approaches
- **One-click check-in** — the only thing standing between your nominees and your letters
- **Letter editor** — write per nominee, see encryption status in real time
- **Nominee manager** — add, verify, assign letters
- **Timer visualizer** — progress bar showing how much of your window remains
- **Google OAuth** — sign in fast, no friction

---

## 🛠️ Tech Stack

```
Frontend      →  React
Backend       →  Node.js + Express
Database      →  MongoDB
Encryption    →  AES-256 (letters encrypted before storage, decrypted only at delivery)
Auth          →  JWT + bcrypt + Google OAuth via Passport.js
Email         →  Nodemailer
Scheduler     →  node-cron  ← this is the actual switch. scans every user. pulls the trigger.
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
    │   └── switchChecker.js    # ⚡ runs on cron, finds overdue users, fires delivery
    └── utils/
        ├── encrypt.js          # AES-256 encrypt / decrypt
        └── mailer.js           # nodemailer delivery
```

---

## 🛣️ API

```
POST   /api/auth/register         register
POST   /api/auth/login            login
GET    /api/auth/google           Google OAuth entry

POST   /api/letters               create letter (encrypted on write)
GET    /api/letters               fetch all (returns ciphertext + metadata)
PUT    /api/letters/:id           update
DELETE /api/letters/:id           delete

POST   /api/nominees              add a nominee
GET    /api/nominees              list nominees

POST   /api/checkin               💓  I'm alive — resets the clock
GET    /api/checkin/status        returns time left before switch flips
```

---

## 🔒 Security Model

| Threat | How WillIt handles it |
|---|---|
| DB breach | Letters are AES-256 ciphertext — useless without the key |
| Password leak | bcrypt hashed with salt — not reversible |
| Session hijack | Short-lived JWTs — stateless, signed |
| Unauthorized access | JWT middleware on every protected route |
| Plaintext exposure | Decryption happens only at delivery — never stored or logged in plain |
