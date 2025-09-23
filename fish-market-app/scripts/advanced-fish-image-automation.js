const fs = require('fs');
const path = require('path');
const https = require('https');
const { createWriteStream } = require('fs');

// Fish names with their search terms for better image matching
const fishData = [
  { name: 'Betta Fish - Half Moon', searchTerms: ['betta fish', 'half moon betta', 'siamese fighting fish'] },
  { name: 'Guppy - Mixed Colors', searchTerms: ['guppy fish', 'poecilia reticulata', 'rainbow fish'] },
  { name: 'Tiger Oscar', searchTerms: ['tiger oscar fish', 'astronotus ocellatus', 'oscar cichlid'] },
  { name: 'Arowana - Silver', searchTerms: ['silver arowana', 'osteoglossum bicirrhosum', 'dragon fish'] },
  { name: 'Glow Tetra', searchTerms: ['glow tetra', 'glofish tetra', 'fluorescent tetra'] },
  { name: 'Red Cherry Shrimp', searchTerms: ['red cherry shrimp', 'neocaridina davidi', 'cherry shrimp'] },
  { name: 'Java Moss', searchTerms: ['java moss', 'taxiphyllum barbieri', 'aquarium moss'] },
  { name: 'Neon Tetra', searchTerms: ['neon tetra', 'paracheirodon innesi', 'neon fish'] },
  { name: 'Betta Fish', searchTerms: ['betta fish', 'betta splendens', 'siamese fighting fish'] },
  { name: 'Angelfish', searchTerms: ['angelfish', 'pterophyllum scalare', 'freshwater angelfish'] },
  { name: 'Guppy', searchTerms: ['guppy fish', 'poecilia reticulata', 'guppy'] },
  { name: 'Goldfish', searchTerms: ['goldfish', 'carassius auratus', 'gold fish'] },
  { name: 'Discus', searchTerms: ['discus fish', 'symphysodon', 'discus cichlid'] }
];

// High-quality fish image URLs (manually curated)
const curatedFishImages = {
  'Betta Fish - Half Moon': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop&auto=format',
  'Guppy - Mixed Colors': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&auto=format',
  'Tiger Oscar': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&auto=format',
  'Arowana - Silver': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&auto=format',
  'Glow Tetra': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop&auto=format',
  'Red Cherry Shrimp': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&auto=format',
  'Java Moss': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&auto=format',
  'Neon Tetra': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop&auto=format',
  'Betta Fish': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop&auto=format',
  'Angelfish': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&auto=format',
  'Guppy': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop&auto=format',
  'Goldfish': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&auto=format',
  'Discus': 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&auto=format'
};

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
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${path.basename(filename)}`);
          resolve();
        });
      } else {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
      }
    }).on('error', (err) => {
      fs.unlink(filename, () => {}); // Delete the file on error
      reject(err);
    });
  });
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

// Function to get image URL for a fish
function getFishImageUrl(fishName) {
  // First try curated images
  if (curatedFishImages[fishName]) {
    return curatedFishImages[fishName];
  }
  
  // Fallback to generic fish image
  return 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop&auto=format';
}

// Main function to process all fish images
async function processFishImages() {
  console.log('🐠 Starting advanced fish image automation...');
  console.log(`📁 Images will be saved to: ${imagesDir}`);
  
  const results = [];
  
  for (const fish of fishData) {
    const fishName = fish.name;
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
        url: `/fish-images/${filename}`,
        searchTerms: fish.searchTerms
      });
      continue;
    }
    
    try {
      const imageUrl = getFishImageUrl(fishName);
      
      if (imageUrl) {
        await downloadImage(imageUrl, filepath);
        results.push({
          fishName,
          filename,
          status: 'downloaded',
          url: `/fish-images/${filename}`,
          searchTerms: fish.searchTerms
        });
      } else {
        console.log(`❌ No image found for: ${fishName}`);
        results.push({
          fishName,
          filename,
          status: 'not_found',
          url: null,
          searchTerms: fish.searchTerms
        });
      }
    } catch (error) {
      console.error(`❌ Error processing ${fishName}:`, error.message);
      results.push({
        fishName,
        filename,
        status: 'error',
        url: null,
        error: error.message,
        searchTerms: fish.searchTerms
      });
    }
  }
  
  // Generate summary
  console.log('\n📊 Summary:');
  const successful = results.filter(r => r.status === 'downloaded' || r.status === 'exists');
  const failed = results.filter(r => r.status === 'error' || r.status === 'not_found');
  
  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);
  
  if (failed.length > 0) {
    console.log('\n❌ Failed fish:');
    failed.forEach(f => console.log(`  - ${f.fishName}: ${f.status}`));
  }
  
  // Save results to JSON file
  const resultsFile = path.join(__dirname, '../public/fish-images/image-mapping.json');
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  console.log(`📄 Results saved to: ${resultsFile}`);
  
  // Generate TypeScript interface for the results
  const tsInterface = `
// Auto-generated fish image mapping
export interface FishImageMapping {
  fishName: string;
  filename: string;
  status: 'downloaded' | 'exists' | 'not_found' | 'error';
  url: string | null;
  searchTerms?: string[];
  error?: string;
}

export const fishImageMappings: FishImageMapping[] = ${JSON.stringify(results, null, 2)};
`;
  
  const tsFile = path.join(__dirname, '../src/lib/fishImageMappings.ts');
  fs.writeFileSync(tsFile, tsInterface);
  console.log(`📄 TypeScript mappings saved to: ${tsFile}`);
  
  return results;
}

// Run the automation
if (require.main === module) {
  processFishImages()
    .then(() => {
      console.log('\n🎉 Advanced fish image automation completed!');
    })
    .catch((error) => {
      console.error('💥 Automation failed:', error);
      process.exit(1);
    });
}

module.exports = { processFishImages, fishData };
