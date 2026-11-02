# CampusCircle 🎓🔄
> **The All-In-One College Campus Portal**: Peer-to-Peer Marketplace & Smart Lost-and-Found Auto-Matcher.

CampusCircle combines two essential pillars of college life into a modern, unified web application:
1. **Peer-to-Peer Student Marketplace**: Rent or purchase textbooks, graphing calculators, lab coats, dorm fridges, and study gear directly from campus peers without bookstore markups.
2. **Smart Lost-and-Found Auto-Matcher**: Automated matching engine that analyzes category trees, building proximity, date recency, and NLP keyword stems to automatically link lost items with found items and provide explainable confidence scores.

---

## 🌟 Key Features

### 🛒 1. Peer-to-Peer Campus Marketplace
- **Flexible Listing Models**: Support for both **One-Time Buy** (flat purchase) and **Campus Rental** (per semester, month, week, or day) with optional refundable security deposits.
- **Categorization**: Textbooks & Course Material, Calculators & Tech, Lab & Stationery, Dorm & Room Gear, Electronics, and Sports.
- **Campus-Specific Meetups**: Filter and tag listings by specific campus halls, libraries, and student union centers.
- **Direct Student Inquiries**: 1-click modal for contact exchange (Campus Meetup, WhatsApp, Email, Phone) with safety guidance.

### 🔍 2. Smart Lost & Found Auto-Matcher
- **Dual Flow**: Intuitive reporting for both *"I Lost Something"* and *"I Found Something"*.
- **Auto-Matcher Scoring Engine (0 - 100%)**:
  - **Category Weight (35%)**: Exact category alignment or related hierarchy (e.g. Calculators ↔ Electronics).
  - **Textual & NLP Overlap (35%)**: Normalized tokenization, keyword stem overlap, and brand/color recognition (e.g., TI-84, Hydro Flask, NASA stickers, AirPods).
  - **Location Proximity (20%)**: Matches common campus zones (e.g., Main Library 2nd floor, Science Lab 204).
  - **Temporal Closeness (10%)**: Dynamic weighting based on proximity of dates occurred (within 3, 7, or 14 days).
- **Explainable Match Reasons**: Displays human-readable matching justification (e.g. `✓ Identical Category (Calculators)`, `✓ Location proximity: library`, `✓ Shared brand/model: ti-84`).
- **1-Click Confirm & Resolve**: Direct match confirmation and status archiving.

### 🔐 3. Authentication & Clean Architecture
- **JWT Authentication**: Secure token-based auth with bcrypt password hashing.
- **Verified Student Profiles**: Profiles with name, university campus, student ID, and avatars.
- **1-Click Demo Accounts**: Instant test login buttons for Alex Rivera, Maya Chen, and Jordan Taylor.
- **Clean Architecture**: Separation of concerns between Controllers, Services, Models, and Middlewares.
- **Zero-Config MongoDB**: Connects to external MongoDB Atlas or local daemon, with automatic in-memory MongoDB fallback.

---

## 🏗️ Architecture & Tech Stack

```
my_campus/
├── package.json              # Root orchestration (concurrently dev runner)
├── server/                   # Node.js + Express Backend
│   ├── src/
│   │   ├── config/db.js      # MongoDB connection + fallback
│   │   ├── models/           # Mongoose schemas (User, MarketplaceItem, LostFoundItem)
│   │   ├── services/         # Business logic (matcherService.js)
│   │   ├── controllers/      # Route controllers (auth, marketplace, lostFound, stats)
│   │   ├── middleware/       # JWT auth & centralized error handler
│   │   ├── routes/           # REST endpoints
│   │   └── seed/             # Campus demo seed data with pre-matched pairs
│   └── package.json
└── client/                   # React + Vite Frontend
    ├── src/
    │   ├── context/          # AuthContext (JWT session state & demo login)
    │   ├── services/api.js   # API client
    │   ├── components/       # UI components (Navbar, ItemCard, LostFoundCard, Modals)
    │   └── pages/            # Views (Home, Marketplace, Lost & Found, Dashboard, Login)
    ├── vite.config.js        # Vite + API reverse proxy
    └── package.json
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+) & npm

### 1. Install Dependencies
Run the command below in the project root:
```bash
npm run install:all
```

### 2. Start Both Backend & Frontend
```bash
npm run dev
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:5001](http://localhost:5001)

---

## 🧪 Pre-Seeded Demo Data & Instant Match Pairs

The system seeds sample campus data with pre-configured matching pairs:
1. **Lost**: *Texas Instruments TI-84 Plus CE Calculator* (Library 2nd Floor)
   **Found**: *Found Black TI-84 Graphing Calculator with Blue Sticker* (Library 2nd Floor Printer)
   👉 **Auto-Match Score**: **100% High Match**!
2. **Lost**: *Navy Blue 32oz Hydro Flask with Outdoor Stickers* (Science Building Room 204)
   **Found**: *Found Navy Blue Hydro Flask Water Bottle* (Science Building Hallway)
   👉 **Auto-Match Score**: **85% High Match**!
3. **Lost**: *Apple AirPods Pro (2nd Gen)* (Student Union Cafeteria)
   **Found**: *Found Apple Earbuds Case in Student Union* (Student Union Dining)
   👉 **Auto-Match Score**: **80% High Match**!

### Demo Login Accounts (Password: `password123`):
- `alex@campus.edu` (Alex Rivera)
- `maya@campus.edu` (Maya Chen)
- `jordan@campus.edu` (Jordan Taylor)
*(Or simply click the "1-Click Demo Student" button on the navbar/login page!)*
