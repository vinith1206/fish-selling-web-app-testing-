const fs = require('fs');
const path = require('path');

// Test script to verify fish image automation
function testFishImageAutomation() {
  console.log('🧪 Testing Fish Image Automation...\n');
  
  const imagesDir = path.join(__dirname, '../public/fish-images');
  const resultsFile = path.join(__dirname, '../public/fish-images/image-mapping.json');
  
  // Test 1: Check if images directory exists
  console.log('Test 1: Checking images directory...');
  if (fs.existsSync(imagesDir)) {
    console.log('✅ Images directory exists');
  } else {
    console.log('❌ Images directory does not exist');
    return false;
  }
  
  // Test 2: Check if image mapping file exists
  console.log('\nTest 2: Checking image mapping file...');
  if (fs.existsSync(resultsFile)) {
    console.log('✅ Image mapping file exists');
    try {
      const mapping = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
      console.log(`📊 Found ${mapping.length} fish image mappings`);
    } catch (error) {
      console.log('❌ Error reading image mapping file:', error.message);
      return false;
    }
  } else {
    console.log('❌ Image mapping file does not exist');
    return false;
  }
  
  // Test 3: Check if all expected images exist
  console.log('\nTest 3: Checking individual fish images...');
  const expectedImages = [
    'betta-fish-half-moon.jpg',
    'guppy-mixed-colors.jpg',
    'tiger-oscar.jpg',
    'arowana-silver.jpg',
    'glow-tetra.jpg',
    'red-cherry-shrimp.jpg',
    'java-moss.jpg',
    'neon-tetra.jpg',
    'betta-fish.jpg',
    'angelfish.jpg',
    'guppy.jpg',
    'goldfish.jpg',
    'discus.jpg'
  ];
  
  let allImagesExist = true;
  expectedImages.forEach(imageName => {
    const imagePath = path.join(imagesDir, imageName);
    if (fs.existsSync(imagePath)) {
      const stats = fs.statSync(imagePath);
      console.log(`✅ ${imageName} (${Math.round(stats.size / 1024)}KB)`);
    } else {
      console.log(`❌ ${imageName} - missing`);
      allImagesExist = false;
    }
  });
  
  if (!allImagesExist) {
    console.log('❌ Some images are missing');
    return false;
  }
  
  // Test 4: Check image file sizes (should be reasonable)
  console.log('\nTest 4: Checking image file sizes...');
  const files = fs.readdirSync(imagesDir).filter(file => file.endsWith('.jpg'));
  let allSizesValid = true;
  
  files.forEach(file => {
    const filePath = path.join(imagesDir, file);
    const stats = fs.statSync(filePath);
    const sizeKB = Math.round(stats.size / 1024);
    
    if (sizeKB < 5) {
      console.log(`❌ ${file} - too small (${sizeKB}KB)`);
      allSizesValid = false;
    } else if (sizeKB > 500) {
      console.log(`⚠️  ${file} - large file (${sizeKB}KB)`);
    } else {
      console.log(`✅ ${file} - good size (${sizeKB}KB)`);
    }
  });
  
  if (!allSizesValid) {
    console.log('❌ Some images have invalid sizes');
    return false;
  }
  
  // Test 5: Check TypeScript mappings file
  console.log('\nTest 5: Checking TypeScript mappings file...');
  const tsFile = path.join(__dirname, '../src/lib/fishImageMappings.ts');
  if (fs.existsSync(tsFile)) {
    console.log('✅ TypeScript mappings file exists');
    const content = fs.readFileSync(tsFile, 'utf8');
    if (content.includes('FishImageMapping') && content.includes('fishImageMappings')) {
      console.log('✅ TypeScript mappings file has correct structure');
    } else {
      console.log('❌ TypeScript mappings file has incorrect structure');
      return false;
    }
  } else {
    console.log('❌ TypeScript mappings file does not exist');
    return false;
  }
  
  // Test 6: Check fish image utils file
  console.log('\nTest 6: Checking fish image utils file...');
  const utilsFile = path.join(__dirname, '../src/lib/fishImageUtils.ts');
  if (fs.existsSync(utilsFile)) {
    console.log('✅ Fish image utils file exists');
    const content = fs.readFileSync(utilsFile, 'utf8');
    if (content.includes('getFishImagePath') && content.includes('fishImageMap')) {
      console.log('✅ Fish image utils file has correct functions');
    } else {
      console.log('❌ Fish image utils file has incorrect structure');
      return false;
    }
  } else {
    console.log('❌ Fish image utils file does not exist');
    return false;
  }
  
  console.log('\n🎉 All tests passed! Fish image automation is working correctly.');
  return true;
}

// Run the test
if (require.main === module) {
  const success = testFishImageAutomation();
  process.exit(success ? 0 : 1);
}

module.exports = { testFishImageAutomation };
