# EphemeralShare

A secure, open-source file-sharing application designed for sending sensitive files with zero persistence. Files are automatically deleted immediately after they are downloaded once, or when their 24-hour time-to-live (TTL) expires.

## Features

- **Single-Use Links:** Download links expire instantly after the first successful download.
- **Time-Based Expiry:** Files that are never downloaded are automatically swept and deleted after 24 hours.
- **Secure File Storage:** Files are stored with randomized names to prevent path traversal and discovery.
- **Large File Support:** Streaming downloads prevent memory exhaustion on the server (handles 50MB files easily).
- **Beautiful UI:** A premium, dark-mode React interface with drag-and-drop.
- **Rate Limited:** Prevents brute force token scanning.

---

## 🛠 Tech Stack

- **Frontend:** React, Vite, Axios, React Router, Lucide React
- **Backend:** Node.js, Express, Multer, Mongoose
- **Database:** MongoDB
- **Deployment:** Vercel (Frontend), Render (Backend)

---

## 🚀 Running Locally

### Prerequisites
- Node.js (v18+)
- MongoDB running locally or a MongoDB Atlas URI

### 1. Clone & Install
```bash
# Clone repo
git clone https://github.com/yourusername/ephemeralshare.git
cd ephemeralshare
```

### 2. Backend Setup
```bash
cd backend
npm install

# Setup env
cp .env.example .env
# Edit .env with your MongoDB connection string
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Start Development Servers
Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
# App starts on http://localhost:5173
```

---

## 🌍 Deployment Guide

### Backend (Render / Heroku)
1. Push the repository to GitHub.
2. Create a new Web Service on Render, point it to the `backend/` directory.
3. Set the Build Command: `npm install`
4. Set the Start Command: `npm start`
5. Add the following Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `FRONTEND_URL`: The URL where your frontend will be deployed (e.g., `https://ephemeralshare.vercel.app`).
   - `NODE_ENV`: `production`

### Frontend (Vercel / Netlify)
1. Import the repository into Vercel.
2. Set the Root Directory to `frontend/`.
3. The Build Command (`npm run build`) and Output Directory (`dist`) should auto-detect.
4. **Important for API Routing:** You must configure Vite to hit your production backend. In `frontend/src/services/api.js`, change `API_URL` to point to your Render backend URL when in production.

---

## 🔒 Security Policies

- **File Type Restrictions:** Common executable extensions (`.exe`, `.sh`, `.bat`, etc.) are blocked at the Multer level.
- **File Size Limit:** Capped at 50MB by default to prevent DoS attacks.
- **Token Entropy:** Uses UUIDv4 (122 bits of randomness) making URLs impossible to guess.
- **Headers:** Configured with `helmet` for secure HTTP headers.
