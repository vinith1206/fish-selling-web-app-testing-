const mongoose = require('mongoose');
const Fish = require('./models/Fish');
require('dotenv').config();

const sampleFishes = [
  {
    name: 'Salmon',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop',
    price: 800,
    priceUnit: 'per_kg',
    description: 'Fresh Atlantic Salmon, perfect for grilling or baking',
    category: 'premium'
  },
  {
    name: 'Tuna',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    price: 1200,
    priceUnit: 'per_kg',
    description: 'Premium Yellowfin Tuna, great for sushi and sashimi',
    category: 'premium'
  },
  {
    name: 'Pomfret',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    price: 400,
    priceUnit: 'per_kg',
    description: 'Fresh White Pomfret, ideal for Indian cooking',
    category: 'fresh'
  },
  {
    name: 'Kingfish',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop',
    price: 350,
    priceUnit: 'per_kg',
    description: 'Fresh Kingfish, perfect for curry and fry',
    category: 'fresh'
  },
  {
    name: 'Prawns',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    price: 600,
    priceUnit: 'per_kg',
    description: 'Large Fresh Prawns, cleaned and ready to cook',
    category: 'seafood'
  },
  {
    name: 'Crab',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop',
    price: 500,
    priceUnit: 'per_kg',
    description: 'Live Fresh Crab, perfect for traditional recipes',
    category: 'seafood'
  },
  {
    name: 'Red Snapper',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    price: 450,
    priceUnit: 'per_kg',
    description: 'Fresh Red Snapper, great for grilling and baking',
    category: 'fresh'
  },
  {
    name: 'Mackerel',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop',
    price: 200,
    priceUnit: 'per_kg',
    description: 'Fresh Mackerel, rich in omega-3 fatty acids',
    category: 'fresh'
  }
];

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/fish-app';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Fish.deleteMany({});
    console.log('Cleared existing fish data');

    // Insert sample data
    await Fish.insertMany(sampleFishes);
    console.log('Sample fish data inserted successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
