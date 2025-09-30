const mongoose = require('mongoose');
const Fish = require('./models/Fish');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/fish-market', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Image mapping for fish names to local image paths
const imageMapping = {
  "Tiger Sharks Pair": "/fish-images/tiger-oscar.jpg",
  "Mixed Guppy Pair": "/fish-images/guppy-mixed-colors.jpg", 
  "Molly Pair": "/fish-images/guppy.jpg",
  "Milk White OHM Betta": "/fish-images/betta-fish-half-moon.jpg",
  "Blue Medicine 5ML": "/fish-images/java-moss.jpg",
  "4\" Net": "/fish-images/java-moss.jpg",
  "Siphon Pipe": "/fish-images/java-moss.jpg",
  "Air Pump One Way": "/fish-images/java-moss.jpg",
  "Champion Guppys 20G": "/fish-images/guppy.jpg",
  "Live Plants": "/fish-images/java-moss.jpg",
  "Foxtail": "/fish-images/java-moss.jpg",
  "Aritima Capsule": "/fish-images/java-moss.jpg",
  "Royal Blood Red Betta": "/fish-images/betta-fish.jpg",
  "Royal Blue Betta Full Moon": "/fish-images/betta-fish-half-moon.jpg",
  "Royal Food": "/fish-images/java-moss.jpg",
  "white": "/fish-images/java-moss.jpg"
};

async function updateFishImages() {
  try {
    console.log('🔄 Updating fish images in database...');
    
    const fishes = await Fish.find({});
    console.log(`Found ${fishes.length} fishes in database`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const fish of fishes) {
      if (imageMapping[fish.name]) {
        if (fish.image !== imageMapping[fish.name]) {
          console.log(`Updating ${fish.name}: ${fish.image} → ${imageMapping[fish.name]}`);
          fish.image = imageMapping[fish.name];
          await fish.save();
          updatedCount++;
        } else {
          console.log(`⏭️  Skipped ${fish.name} (already correct)`);
          skippedCount++;
        }
      } else {
        console.warn(`⚠️  No image mapping found for: ${fish.name}`);
      }
    }
    
    console.log(`✅ Successfully updated ${updatedCount} fish images!`);
    console.log(`⏭️  Skipped ${skippedCount} fish (already correct)`);
    console.log('🎉 All fish now have local images!');
    
  } catch (error) {
    console.error('❌ Error updating fish images:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateFishImages();



