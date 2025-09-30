const axios = require('axios');

// Comprehensive fish name mapping from database names to our downloaded image names
const fishImageMapping = {
  // Fish with specific images
  'Tiger Sharks Pair': '/fish-images/tiger-oscar.jpg',
  'Mixed Guppy Pair': '/fish-images/guppy-mixed-colors.jpg',
  'Molly Pair': '/fish-images/guppy.jpg',
  'Milk White OHM Betta': '/fish-images/betta-fish-half-moon.jpg',
  'Royal Blood Red Betta': '/fish-images/betta-fish.jpg',
  'Royal Blue Betta Full Moon': '/fish-images/betta-fish-half-moon.jpg',
  'Champion Guppys 20G': '/fish-images/guppy.jpg',
  
  // Plants and accessories - using appropriate images
  'Java Moss': '/fish-images/java-moss.jpg',
  'Live Plants': '/fish-images/java-moss.jpg',
  'Foxtail': '/fish-images/java-moss.jpg',
  
  // Medicine and food - using neutral images
  'Blue Medicine 5ML': '/fish-images/java-moss.jpg',
  'Aritima Capsule': '/fish-images/java-moss.jpg',
  'Royal Food': '/fish-images/java-moss.jpg',
  
  // Equipment - using neutral images
  '4" Net': '/fish-images/java-moss.jpg',
  'Siphon Pipe': '/fish-images/java-moss.jpg',
  'Air Pump One Way': '/fish-images/java-moss.jpg',
  
  // Generic entries
  'white': '/fish-images/java-moss.jpg'
};

const API_BASE_URL = 'http://localhost:5001/api';

async function updateAllFishImages() {
  try {
    console.log('🔄 Updating ALL fish images in database...\n');
    
    // Get all fishes from the database
    const response = await axios.get(`${API_BASE_URL}/fishes`);
    const fishes = response.data;
    
    console.log(`Found ${fishes.length} fishes in database\n`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const fish of fishes) {
      const newImagePath = fishImageMapping[fish.name];
      
      if (newImagePath) {
        // Only update if the image is different
        if (fish.image !== newImagePath) {
          console.log(`Updating ${fish.name}: ${fish.image} → ${newImagePath}`);
          
          // Update the fish with new image path
          await axios.put(`${API_BASE_URL}/fishes/${fish._id}`, {
            ...fish,
            image: newImagePath
          });
          
          updatedCount++;
        } else {
          console.log(`✅ ${fish.name} already has correct image`);
          skippedCount++;
        }
      } else {
        console.log(`⚠️  No image mapping found for: ${fish.name}`);
      }
    }
    
    console.log(`\n✅ Successfully updated ${updatedCount} fish images!`);
    console.log(`⏭️  Skipped ${skippedCount} fish (already correct)`);
    console.log('🎉 All fish now have local images!');
    
  } catch (error) {
    console.error('❌ Error updating fish images:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the update
updateAllFishImages();



