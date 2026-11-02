#!/usr/bin/env bash

# ==============================================================================
# CampusCircle - All-in-One Startup Script
# ==============================================================================

set -e

# Change to the script's directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "=================================================================="
echo "          🎓 Welcome to CampusCircle Startup Engine 🔄            "
echo "=================================================================="
echo ""

# 1. Check Node.js & npm
if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js is required but not installed. Please install Node.js (v18+)."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "❌ npm is required but not installed."
  exit 1
fi

echo "✅ Node $(node -v) & npm $(npm -v) detected."

# 2. Check and install dependencies if node_modules missing
if [ ! -d "node_modules" ] || [ ! -d "server/node_modules" ] || [ ! -d "client/node_modules" ]; then
  echo "📦 Installing project dependencies..."
  npm install
  npm --prefix server install
  npm --prefix client install
  echo "✅ Dependencies installed."
fi

# 3. Port cleanup if any lingering process on 5001 or 5173
echo "🔍 Checking ports 5001 and 5173..."
kill_port() {
  PORT=$1
  PID=$(lsof -ti :$PORT 2>/dev/null || true)
  if [ -n "$PID" ]; then
    echo "⚠️ Port $PORT is occupied by PID $PID. Attempting to free..."
    kill -9 $PID 2>/dev/null || true
  fi
}

kill_port 5001
kill_port 5173

# 4. Trap signals for graceful shutdown of both background jobs
cleanup() {
  echo ""
  echo "🛑 Shutting down CampusCircle (Server & Client)..."
  if [ -n "$SERVER_PID" ]; then
    kill "$SERVER_PID" 2>/dev/null || true
  fi
  if [ -n "$CLIENT_PID" ]; then
    kill "$CLIENT_PID" 2>/dev/null || true
  fi
  echo "👋 Goodbye!"
  exit 0
}

trap cleanup SIGINT SIGTERM EXIT

# 5. Start Backend Server
echo "🚀 Starting Backend Server on http://localhost:5001..."
npm --prefix server run dev &
SERVER_PID=$!

# Wait for backend to be ready
echo "⏳ Waiting for backend API to initialize..."
for i in {1..30}; do
  if curl -s http://127.0.0.1:5001/api/health >/dev/null 2>&1; then
    echo "✅ Backend API is live at http://localhost:5001"
    break
  fi
  sleep 1
done

# 6. Start Frontend Client
echo "🚀 Starting Frontend Client on http://localhost:5173..."
npm --prefix client run dev &
CLIENT_PID=$!

sleep 2

echo ""
echo "=================================================================="
echo "            ✨ CampusCircle is LIVE and Ready! ✨                "
echo "=================================================================="
echo "  🌐 Web Application:   http://localhost:5173"
echo "  🔌 API Server:        http://localhost:5001"
echo "  🍃 Database:          MongoDB Atlas (cluster0.ptxlnzz.mongodb.net)"
echo "  💰 Currency:          ₹ (Indian Rupees)"
echo "  ❤️ Health Check:      http://localhost:5001/api/health"
echo "=================================================================="
echo "                 🔑 DEMO LOGIN CREDENTIALS                        "
echo "=================================================================="
echo "  All demo accounts use password:  password123"
echo ""
echo "  1) Alex Rivera (Textbook Seller / Lost Calculator Reporter):"
echo "     • Email:     alex@campus.edu"
echo "     • Password:  password123"
echo ""
echo "  2) Maya Chen (Rental Owner - Mini Fridge / Chair / Lost Hydro Flask):"
echo "     • Email:     maya@campus.edu"
echo "     • Password:  password123"
echo ""
echo "  3) Jordan Taylor (Item Finder - Found TI-84 / Found Hydro Flask):"
echo "     • Email:     jordan@campus.edu"
echo "     • Password:  password123"
echo ""
echo "  💡 TIP: You can also click the 'Demo Student' 1-click button"
echo "     directly in the top navbar or login page!"
echo "=================================================================="
echo "Press Ctrl+C anytime to stop both servers."
echo ""

# Keep running and wait for background processes
wait
