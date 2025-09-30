const axios = require('axios');

// Fish name mapping from database names to our downloaded image names
const fishImageMapping = {
  'Tiger Sharks Pair': '/fish-images/tiger-oscar.jpg',
  'Mixed Guppy Pair': '/fish-images/guppy-mixed-colors.jpg',
  'Molly Pair': '/fish-images/guppy.jpg', // Using guppy as fallback for molly
  'Milk White OHM Betta': '/fish-images/betta-fish-half-moon.jpg',
  'Blue Medicine 5ML': '/fish-images/java-moss.jpg', // Using java moss as fallback
  'Red Cherry Shrimp': '/fish-images/red-cherry-shrimp.jpg',
  'Java Moss': '/fish-images/java-moss.jpg',
  'Neon Tetra': '/fish-images/neon-tetra.jpg',
  'Betta Fish': '/fish-images/betta-fish.jpg',
  'Angelfish': '/fish-images/angelfish.jpg',
  'Guppy': '/fish-images/guppy.jpg',
  'Goldfish': '/fish-images/goldfish.jpg',
  'Discus': '/fish-images/discus.jpg',
  'Arowana - Silver': '/fish-images/arowana-silver.jpg',
  'Glow Tetra': '/fish-images/glow-tetra.jpg'
};

const API_BASE_URL = 'http://localhost:5001/api';

async function updateFishImages() {
  try {
    console.log('🔄 Updating fish images in database...\n');
    
    // Get all fishes from the database
    const response = await axios.get(`${API_BASE_URL}/fishes`);
    const fishes = response.data;
    
    console.log(`Found ${fishes.length} fishes in database\n`);
    
    let updatedCount = 0;
    
    for (const fish of fishes) {
      const newImagePath = fishImageMapping[fish.name];
      
      if (newImagePath) {
        console.log(`Updating ${fish.name}: ${fish.image} → ${newImagePath}`);
        
        // Update the fish with new image path
        await axios.put(`${API_BASE_URL}/fishes/${fish._id}`, {
          ...fish,
          image: newImagePath
        });
        
        updatedCount++;
      } else {
        console.log(`⚠️  No image mapping found for: ${fish.name}`);
      }
    }
    
    console.log(`\n✅ Successfully updated ${updatedCount} fish images!`);
    console.log('🎉 Database now uses local fish images!');
    
  } catch (error) {
    console.error('❌ Error updating fish images:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the update
updateFishImages();



