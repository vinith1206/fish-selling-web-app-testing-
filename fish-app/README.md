# Fish Market Web App

A complete e-commerce web application for selling fresh fish with PDF invoice generation and WhatsApp integration.

## Features

### Frontend (Next.js + TailwindCSS)
- 🐟 Fish catalog with images, prices, and descriptions
- 🛒 Shopping cart with quantity management
- 📱 Mobile-first responsive design
- 💳 Checkout form with customer details
- ✅ Order confirmation with PDF generation

### Backend (Node.js + Express + MongoDB)
- 🗄️ MongoDB database with Mongoose ODM
- 📄 PDF invoice generation using pdf-lib
- 📱 WhatsApp Cloud API integration
- 🔒 RESTful API endpoints
- 📊 Order management system

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **PDF Generation**: pdf-lib
- **WhatsApp Integration**: WhatsApp Cloud API
- **Icons**: Lucide React

## Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- WhatsApp Business API credentials

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.example .env
```

4. Update `.env` with your credentials:
```env
MONGODB_URI=mongodb://localhost:27017/fish-app
PORT=5000
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_VERIFY_TOKEN=your_verify_token
SELLER_PHONE_NUMBER=+1234567890
```

5. Seed the database with sample fish data:
```bash
node seedData.js
```

6. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp env.local.example .env.local
```

4. Update `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Fishes
- `GET /api/fishes` - Get all available fishes
- `GET /api/fishes/:id` - Get specific fish
- `POST /api/fishes` - Create new fish (Admin)
- `PUT /api/fishes/:id` - Update fish (Admin)
- `DELETE /api/fishes/:id` - Delete fish (Admin)

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get specific order
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

## WhatsApp Integration Setup

1. Create a Facebook Developer account
2. Create a WhatsApp Business API app
3. Get your access token and phone number ID
4. Update the environment variables in backend `.env`

## Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variable: `NEXT_PUBLIC_API_URL=your-backend-url`
3. Deploy

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Get connection string
3. Update `MONGODB_URI` in backend environment

## Project Structure

```
fish-app/
├── frontend/                 # Next.js frontend
│   ├── src/
│   │   ├── app/             # App router pages
│   │   ├── components/      # React components
│   │   ├── contexts/        # React contexts
│   │   └── lib/            # API utilities
│   └── package.json
├── backend/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── utils/              # Utilities (PDF, WhatsApp)
│   ├── invoices/           # Generated PDF invoices
│   └── server.js
└── README.md
```

## Features in Detail

### Fish Catalog
- Displays all available fish with images
- Shows price per kg/piece
- Add to cart functionality
- Responsive grid layout

### Shopping Cart
- Add/remove items
- Update quantities
- Real-time total calculation
- Persistent storage (localStorage)

### Checkout Process
- Customer information form
- Order summary
- PDF invoice generation
- WhatsApp notification to seller

### PDF Invoice
- Professional invoice layout
- Customer details
- Order items with quantities and prices
- Subtotal, delivery charge, and total
- Auto-saved to server

### WhatsApp Integration
- Sends order details to seller
- Attaches PDF invoice
- Order confirmation to customer

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
