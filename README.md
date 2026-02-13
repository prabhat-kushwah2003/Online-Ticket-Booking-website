# Smart Event Booking System

A full-stack event booking application with real-time seat availability updates, built with React, Node.js, Express, MySQL, and Socket.IO.

## Features
- **Frontend**: React + Vite + Tailwind CSS + Framer Motion
- **Backend**: Node.js + Express + MySQL
- **Real-time**: Socket.IO for live seat updates
- **Admin Dashboard**: Manage events (CRUD)
- **Booking Flow**: Smooth booking process with QR code generation

## Prerequisites
- Node.js (v16+)
- MySQL Server

## Setup Instructions

### 1. Database Setup
1. Create a MySQL database named `event_booking`.
2. Update `server/.env` with your database credentials.
3. Run the initialization script to create tables:
   ```bash
   cd server
   node init_db.js
   ```

### 2. Backend Setup
1. Navigate to `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5000`.

### 3. Frontend Setup
1. Navigate to `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   Client runs on `http://localhost:5173`.

## Environment Variables (.env)

**Server (.env):**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=event_booking
PORT=5000
```

## Admin Access
Visit `/admin` route to manage events.

## Deployment
- **Frontend**: Build using `npm run build` and deploy the `dist` folder to Vercel/Netlify.
- **Backend**: Deploy the `server` folder to Heroku/Render/Railway. Ensure environment variables are set.

## License
MIT
