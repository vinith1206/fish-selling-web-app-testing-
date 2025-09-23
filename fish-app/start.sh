#!/bin/bash

# Fish Market Web App Startup Script

echo "🐟 Starting Fish Market Web App..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   brew services start mongodb-community"
    echo "   or"
    echo "   sudo systemctl start mongod"
    echo ""
    read -p "Press Enter to continue anyway..."
fi

# Start Backend
echo "🚀 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start Frontend
echo "🎨 Starting frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Fish Market Web App is running!"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   Admin:    http://localhost:3000/admin"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for processes
wait
