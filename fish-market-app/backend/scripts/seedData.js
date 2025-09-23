const mongoose = require('mongoose');
const Fish = require('./models/Fish');

// Sample fish data
const sampleFishes = [
  {
    name: 'Betta Fish - Half Moon',
    price: 299,
    originalPrice: 399,
    category: 'betta',
    availability: 'in_stock',
    image: '/fish-images/betta-fish-half-moon.jpg',
    stock: 15,
    description: 'Beautiful half moon betta fish with vibrant colors',
    weight: 0.1,
    origin: 'Thailand',
    discount: 25,
    discountPrice: 299,
    priceUnit: 'per_piece',
    careLevel: 'beginner',
    tankSize: '5-10 gallons',
    waterTemp: '76-82°F',
    waterPH: '6.5-7.5',
    schooling: false,
    groupSize: 1
  },
  {
    name: 'Guppy - Mixed Colors',
    price: 49,
    category: 'community',
    availability: 'in_stock',
    image: '/fish-images/guppy-mixed-colors.jpg',
    stock: 50,
    description: 'Colorful guppy fish, perfect for community tanks',
    weight: 0.05,
    origin: 'South America',
    priceUnit: 'per_piece',
    careLevel: 'beginner',
    tankSize: '10+ gallons',
    waterTemp: '72-82°F',
    waterPH: '7.0-8.5',
    schooling: true,
    groupSize: 6
  },
  {
    name: 'Tiger Oscar',
    price: 300,
    originalPrice: 400,
    category: 'monster',
    availability: 'in_stock',
    image: '/fish-images/tiger-oscar.jpg',
    stock: 5,
    description: 'Distinctive orange-black patterns. Great centerpiece fish',
    weight: 0.1,
    origin: 'South America',
    priceUnit: 'per_piece',
    careLevel: 'intermediate',
    tankSize: '75 gallons',
    waterTemp: '74-81°F',
    waterPH: '6.0-8.0',
    schooling: false,
    groupSize: 1
  }
];

async function seedData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fish-market');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Fish.deleteMany({});
    console.log('Cleared existing fish data');

    // Insert sample data
    const insertedFishes = await Fish.insertMany(sampleFishes);
    console.log(`Inserted ${insertedFishes.length} fish records`);

    console.log('Seed data inserted successfully!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedData();
