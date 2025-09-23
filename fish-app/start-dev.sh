#!/bin/bash

# Fish Market Web App - Development Startup Script

echo "🐟 Starting Fish Market Web App in Development Mode..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB is not running. Please start MongoDB first:${NC}"
    echo "   brew services start mongodb-community"
    echo "   or"
    echo "   sudo systemctl start mongod"
    echo ""
    read -p "Press Enter to continue anyway..."
fi

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping servers...${NC}"
    pkill -f "node.*server.js" 2>/dev/null
    pkill -f "next dev" 2>/dev/null
    echo -e "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start Backend
echo -e "${BLUE}🚀 Starting backend server on port 3001...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Check if backend started successfully
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo -e "${GREEN}✅ Backend server started successfully${NC}"
else
    echo -e "${RED}❌ Backend server failed to start${NC}"
    cleanup
fi

# Start Frontend
echo -e "${BLUE}🎨 Starting frontend server on port 3000...${NC}"
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 5

# Check if frontend started successfully
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Frontend server started successfully${NC}"
else
    echo -e "${RED}❌ Frontend server failed to start${NC}"
    cleanup
fi

echo ""
echo -e "${GREEN}🎉 Fish Market Web App is running!${NC}"
echo ""
echo -e "${BLUE}📱 Frontend:${NC} http://localhost:3000"
echo -e "${BLUE}🔧 Backend:${NC}  http://localhost:3001/api"
echo -e "${BLUE}👨‍💼 Admin:${NC}    http://localhost:3000/admin"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"

# Wait for processes
wait


# Fish Market Web App - Development Startup Script

echo "🐟 Starting Fish Market Web App in Development Mode..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB is not running. Please start MongoDB first:${NC}"
    echo "   brew services start mongodb-community"
    echo "   or"
    echo "   sudo systemctl start mongod"
    echo ""
    read -p "Press Enter to continue anyway..."
fi

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping servers...${NC}"
    pkill -f "node.*server.js" 2>/dev/null
    pkill -f "next dev" 2>/dev/null
    echo -e "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start Backend
echo -e "${BLUE}🚀 Starting backend server on port 3001...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Check if backend started successfully
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo -e "${GREEN}✅ Backend server started successfully${NC}"
else
    echo -e "${RED}❌ Backend server failed to start${NC}"
    cleanup
fi

# Start Frontend
echo -e "${BLUE}🎨 Starting frontend server on port 3000...${NC}"
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 5

# Check if frontend started successfully
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Frontend server started successfully${NC}"
else
    echo -e "${RED}❌ Frontend server failed to start${NC}"
    cleanup
fi

echo ""
echo -e "${GREEN}🎉 Fish Market Web App is running!${NC}"
echo ""
echo -e "${BLUE}📱 Frontend:${NC} http://localhost:3000"
echo -e "${BLUE}🔧 Backend:${NC}  http://localhost:3001/api"
echo -e "${BLUE}👨‍💼 Admin:${NC}    http://localhost:3000/admin"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"

# Wait for processes
wait


# Fish Market Web App - Development Startup Script

echo "🐟 Starting Fish Market Web App in Development Mode..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB is not running. Please start MongoDB first:${NC}"
    echo "   brew services start mongodb-community"
    echo "   or"
    echo "   sudo systemctl start mongod"
    echo ""
    read -p "Press Enter to continue anyway..."
fi

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping servers...${NC}"
    pkill -f "node.*server.js" 2>/dev/null
    pkill -f "next dev" 2>/dev/null
    echo -e "${GREEN}✅ Servers stopped${NC}"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start Backend
echo -e "${BLUE}🚀 Starting backend server on port 3001...${NC}"
cd backend
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Check if backend started successfully
if curl -s http://localhost:3001/api/health > /dev/null; then
    echo -e "${GREEN}✅ Backend server started successfully${NC}"
else
    echo -e "${RED}❌ Backend server failed to start${NC}"
    cleanup
fi

# Start Frontend
echo -e "${BLUE}🎨 Starting frontend server on port 3000...${NC}"
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 5

# Check if frontend started successfully
if curl -s http://localhost:3000 > /dev/null; then
    echo -e "${GREEN}✅ Frontend server started successfully${NC}"
else
    echo -e "${RED}❌ Frontend server failed to start${NC}"
    cleanup
fi

echo ""
echo -e "${GREEN}🎉 Fish Market Web App is running!${NC}"
echo ""
echo -e "${BLUE}📱 Frontend:${NC} http://localhost:3000"
echo -e "${BLUE}🔧 Backend:${NC}  http://localhost:3001/api"
echo -e "${BLUE}👨‍💼 Admin:${NC}    http://localhost:3000/admin"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"

# Wait for processes
wait






















