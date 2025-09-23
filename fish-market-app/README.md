# 🐠 FreshCatch Fish Market App

A comprehensive fish market application with admin panel, inventory management, and delivery tracking.

## 🚀 Features

- **Frontend**: Next.js 15 with TypeScript
- **Backend**: Express.js with MongoDB
- **Admin Panel**: Complete inventory and order management
- **API Integration**: Pincode validation and delivery tracking
- **Testing**: Jest with React Testing Library

## 📁 Project Structure

```
fish-market-app/
├── src/                    # Frontend source code
│   ├── app/               # Next.js app router pages
│   ├── components/        # Reusable React components
│   ├── contexts/          # React context providers
│   ├── services/          # API services and utilities
│   ├── types/             # TypeScript type definitions
│   └── __tests__/         # Test files
├── backend/               # Backend API server
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   └── utils/             # Backend utilities
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🛠️ Setup

1. **Install dependencies**:
   ```bash
   npm install
   cd backend && npm install
   ```

2. **Environment setup**:
   ```bash
   cp backend/env.example backend/.env
   cp env.local.example .env.local
   ```

3. **Start development servers**:
   ```bash
   # Backend (Port 5001)
   cd backend && npm start
   
   # Frontend (Port 3002)
   npm run dev
   ```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm test -- --testPathPatterns="api"
npm test -- --testPathPatterns="login"
```

## 📚 API Documentation

### Fish Management
- `GET /api/fishes` - Get all fish
- `POST /api/fishes` - Create new fish
- `PUT /api/fishes/:id` - Update fish
- `DELETE /api/fishes/:id` - Delete fish

### Admin Access
- Username: `admin`
- Password: `admin123`

## 🔧 Configuration

The app supports multiple pincode data sources:
- Data.gov.in (Official government data)
- PostalPincode.in (Free API service)
- Local database (Fallback)

Configure APIs at: `http://localhost:3002/admin/api-config`

## 📝 License

MIT License - See LICENSE file for details