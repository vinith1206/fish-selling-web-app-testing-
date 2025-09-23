// Utility functions for fish image management

export interface FishImageMapping {
  fishName: string;
  filename: string;
  status: 'downloaded' | 'exists' | 'not_found' | 'error';
  url: string | null;
  searchTerms?: string[];
  error?: string;
}

// Fish name to image filename mapping
const fishImageMap: Record<string, string> = {
  'Betta Fish - Half Moon': 'betta-fish-half-moon.jpg',
  'Guppy - Mixed Colors': 'guppy-mixed-colors.jpg',
  'Tiger Oscar': 'tiger-oscar.jpg',
  'Arowana - Silver': 'arowana-silver.jpg',
  'Glow Tetra': 'glow-tetra.jpg',
  'Red Cherry Shrimp': 'red-cherry-shrimp.jpg',
  'Java Moss': 'java-moss.jpg',
  'Neon Tetra': 'neon-tetra.jpg',
  'Betta Fish': 'betta-fish.jpg',
  'Angelfish': 'angelfish.jpg',
  'Guppy': 'guppy.jpg',
  'Goldfish': 'goldfish.jpg',
  'Discus': 'discus.jpg'
};

// Fallback image for fish that don't have specific images
const FALLBACK_IMAGE = '/fish-images/betta-fish.jpg';

/**
 * Get the local image path for a fish
 * @param fishName - The name of the fish
 * @returns The local image path or fallback image
 */
export function getFishImagePath(fishName: string): string {
  const filename = fishImageMap[fishName];
  if (filename) {
    return `/fish-images/${filename}`;
  }
  
  // Try to find a similar fish name
  const lowerName = fishName.toLowerCase();
  for (const [name, file] of Object.entries(fishImageMap)) {
    if (name.toLowerCase().includes(lowerName) || lowerName.includes(name.toLowerCase())) {
      return `/fish-images/${file}`;
    }
  }
  
  // Return fallback image
  return FALLBACK_IMAGE;
}

/**
 * Get all available fish images
 * @returns Array of all fish image mappings
 */
export function getAllFishImages(): FishImageMapping[] {
  return Object.entries(fishImageMap).map(([fishName, filename]) => ({
    fishName,
    filename,
    status: 'exists' as const,
    url: `/fish-images/${filename}`,
    searchTerms: []
  }));
}

/**
 * Check if a fish has a local image
 * @param fishName - The name of the fish
 * @returns True if the fish has a local image
 */
export function hasFishImage(fishName: string): boolean {
  return fishName in fishImageMap;
}

/**
 * Get image alt text for a fish
 * @param fishName - The name of the fish
 * @returns Alt text for the image
 */
export function getFishImageAlt(fishName: string): string {
  return `${fishName} - Premium aquarium fish`;
}

/**
 * Preload fish images for better performance
 * @param fishNames - Array of fish names to preload
 */
export function preloadFishImages(fishNames: string[]): void {
  fishNames.forEach(fishName => {
    const imagePath = getFishImagePath(fishName);
    const img = new Image();
    img.src = imagePath;
  });
}
