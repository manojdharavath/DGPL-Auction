# 🏆 DGPL Auction Platform

An end-to-end, high-performance **Real-Time Cricket Auction Web Application** designed for cricket leagues and college tournaments. Featuring real-time Socket.IO bidding, atomic MongoDB transactions, dynamic budget tracking, and a full admin control panel.

🌐 **Live Web Application**: [https://www.dgplauction.online](https://www.dgplauction.online)  
⚙️ **Backend API Service**: [https://dgpl-auction.onrender.com](https://dgpl-auction.onrender.com)

---

## 🌟 Key Features

* ⚡ **Real-Time Bidding Engine**: Powered by Socket.IO for instant bid synchronization across all connected team captains and spectators with zero page refreshes.
* 🛡️ **Race-Condition Prevention**: Atomic MongoDB queries (`$expr` conditional updates) guarantee data integrity during concurrent bid submissions.
* 💰 **Dynamic Budget & Roster Management**: Automatic budget deduction, tiered bid increments (< 5 Pts: +0.25; 5–10 Pts: +0.5; >= 10 Pts: +1.0), and real-time insufficient funds detection.
* 👑 **Admin Control Center**: Filter players by academic year, start live auctions, finalize sales, or mark players unsold with automated real-time broadcasts.
* 📊 **Live Auction Summary & Roster Views**: Explore available unsold players pool, recently sold players, and complete team roster breakdowns.
* 👤 **Detailed Player Profiles**: Comprehensive player profile views with full timestamped bid logs and retained captain tags.
* 🔒 **Role-Based Authentication**: Secure JWT-based authentication separating **Admin** and **Team Captain** access levels.

---

## 🛠️ Tech Stack

### **Frontend**
* **Framework**: React 19 + Vite 7
* **Styling**: TailwindCSS v4
* **Routing**: React Router (`HashRouter` for GitHub Pages compatibility)
* **Real-time**: `socket.io-client`
* **Hosting**: GitHub Pages (Custom Domain `www.dgplauction.online` + GitHub Actions CI/CD)

### **Backend**
* **Runtime**: Node.js + Express 5
* **Database**: MongoDB Atlas with Mongoose ODM
* **Real-time**: Socket.IO Server
* **Security & Auth**: JWT (JSON Web Tokens), `bcryptjs`, Helmet, custom MongoDB injection sanitizer, and rate-limiting.
* **Hosting**: Render (Web Service)

---

## 🔑 Demo Credentials

### **Admin Account**
| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@dgplauction.com` | `AdminPass123!` | Full Admin Control Panel (`/#/admin`) |

### **Team Captain Accounts**
*(Use these to place live real-time bids during active player auctions)*

| Team | Email | Password |
| :--- | :--- | :--- |
| **Unrivalled Knights** | `captain.unrivalledknights@dgplauction.com` | `CaptainPassUK` |
| **X1 Musketeers** | `captain.x1musketeers@dgplauction.com` | `CaptainPassXM` |
| **Power House** | `captain.powerhouse@dgplauction.com` | `CaptainPassPH` |
| **Intimidators** | `captain.intimidators@dgplauction.com` | `CaptainPassI4` |

---

## 💻 Local Development Setup

### **Prerequisites**
* Node.js (v18 or higher)
* MongoDB database (local or MongoDB Atlas cluster)

### **1. Backend Setup**
```bash
cd backend
npm install
```

Create a `config.env` file in the `backend/` directory:
```env
PORT=7777
NODE_ENV=development
DATABASE=mongodb+srv://<username>:<password>@cluster.mongodb.net/dgplauction
DATABASE_PASSWORD=<your_db_password>
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

Seed initial database (players, teams, and users):
```bash
node seed.js --delete && node seed.js --import
```

Start backend development server:
```bash
npm run dev
```

### **2. Frontend Setup**
```bash
cd frontend
npm install
```

Create a `.env.development` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:7777
```

Start frontend development server:
```bash
npm run dev
```

---

## 🚀 Deployment Architecture

* **Frontend Deployment**: Automated via GitHub Actions workflow ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)). Automatically builds Vite static artifacts and deploys them to GitHub Pages connected to custom domain `www.dgplauction.online`.
* **Backend Deployment**: Hosted on Render as a Web Service running Node.js connected to MongoDB Atlas.

---

## 📄 License

This project is licensed under the ISC License.
