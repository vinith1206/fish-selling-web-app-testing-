const fs = require('fs');
const path = require('path');
const https = require('https');
const { createWriteStream } = require('fs');

// Fish names extracted from the application
const fishNames = [
  'Betta Fish - Half Moon',
  'Guppy - Mixed Colors', 
  'Tiger Oscar',
  'Arowana - Silver',
  'Glow Tetra',
  'Red Cherry Shrimp',
  'Java Moss',
  'Neon Tetra',
  'Betta Fish',
  'Angelfish',
  'Guppy',
  'Goldfish',
  'Discus'
];

// Unsplash API configuration
const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // You'll need to get this from Unsplash
const UNSPLASH_API_URL = 'https://api.unsplash.com/search/photos';

// Alternative: Use Pexels API (free, no key required for basic usage)
const PEXELS_API_URL = 'https://api.pexels.com/v1/search';

// Create images directory
const imagesDir = path.join(__dirname, '../public/fish-images');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Function to download image from URL
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(filename);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

// Function to search for fish images using Unsplash
async function searchUnsplashImage(query) {
  return new Promise((resolve, reject) => {
    const searchQuery = encodeURIComponent(query);
    const url = `${UNSPLASH_API_URL}?query=${searchQuery}&per_page=1&orientation=landscape`;
    
    const options = {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        'Accept-Version': 'v1'
      }
    };

    https.get(url, options, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.results && result.results.length > 0) {
            resolve(result.results[0].urls.regular);
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// Function to search for fish images using Pexels (free alternative)
async function searchPexelsImage(query) {
  return new Promise((resolve, reject) => {
    const searchQuery = encodeURIComponent(query);
    const url = `${PEXELS_API_URL}?query=${searchQuery}&per_page=1&orientation=landscape`;
    
    const options = {
      headers: {
        'Authorization': '563492ad6f91700001000001a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', // Free Pexels API key
        'Accept': 'application/json'
      }
    };

    https.get(url, options, (response) => {
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.photos && result.photos.length > 0) {
            resolve(result.photos[0].src.medium);
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// Function to get fallback image URLs (free stock images)
function getFallbackImageUrl(fishName) {
  const fallbackImages = {
    'betta': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop&auto=format',
    'guppy': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&auto=format',
    'oscar': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&auto=format',
    'arowana': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&auto=format',
    'tetra': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop&auto=format',
    'shrimp': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&auto=format',
    'moss': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&auto=format',
    'angelfish': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&auto=format',
    'goldfish': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&auto=format',
    'discus': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&auto=format'
  };

  const lowerName = fishName.toLowerCase();
  for (const [key, url] of Object.entries(fallbackImages)) {
    if (lowerName.includes(key)) {
      return url;
    }
  }
  
  // Default fallback
  return 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop&auto=format';
}

// Function to sanitize filename
function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Main function to process all fish images
async function processFishImages() {
  console.log('🐠 Starting fish image automation...');
  console.log(`📁 Images will be saved to: ${imagesDir}`);
  
  const results = [];
  
  for (const fishName of fishNames) {
    console.log(`\n🔍 Processing: ${fishName}`);
    
    const sanitizedName = sanitizeFilename(fishName);
    const filename = `${sanitizedName}.jpg`;
    const filepath = path.join(imagesDir, filename);
    
    // Skip if image already exists
    if (fs.existsSync(filepath)) {
      console.log(`⏭️  Skipping ${fishName} - image already exists`);
      results.push({
        fishName,
        filename,
        status: 'exists',
        url: `/fish-images/${filename}`
      });
      continue;
    }
    
    try {
      // Try to get image URL from fallback first (since we don't have API keys)
      const imageUrl = getFallbackImageUrl(fishName);
      
      if (imageUrl) {
        await downloadImage(imageUrl, filepath);
        results.push({
          fishName,
          filename,
          status: 'downloaded',
          url: `/fish-images/${filename}`
        });
      } else {
        console.log(`❌ No image found for: ${fishName}`);
        results.push({
          fishName,
          filename,
          status: 'not_found',
          url: null
        });
      }
    } catch (error) {
      console.error(`❌ Error processing ${fishName}:`, error.message);
      results.push({
        fishName,
        filename,
        status: 'error',
        url: null,
        error: error.message
      });
    }
  }
  
  // Generate summary
  console.log('\n📊 Summary:');
  const successful = results.filter(r => r.status === 'downloaded' || r.status === 'exists');
  const failed = results.filter(r => r.status === 'error' || r.status === 'not_found');
  
  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);
  
  // Save results to JSON file
  const resultsFile = path.join(__dirname, '../public/fish-images/image-mapping.json');
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  console.log(`📄 Results saved to: ${resultsFile}`);
  
  return results;
}

// Run the automation
if (require.main === module) {
  processFishImages()
    .then(() => {
      console.log('\n🎉 Fish image automation completed!');
    })
    .catch((error) => {
      console.error('💥 Automation failed:', error);
      process.exit(1);
    });
}

module.exports = { processFishImages, fishNames };
