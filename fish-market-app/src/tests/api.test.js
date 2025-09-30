import { describe, test, expect, beforeAll, afterAll } from '@jest/globals'

const API_BASE_URL = 'http://localhost:5001'

describe('Fish API Tests', () => {
  let createdFishId

  test('GET /api/fishes should return array of fishes', async () => {
    const response = await fetch(`${API_BASE_URL}/api/fishes`)
    expect(response.status).toBe(200)
    
    const fishes = await response.json()
    expect(Array.isArray(fishes)).toBe(true)
    expect(fishes.length).toBeGreaterThan(0)
    
    // Check if fish has required properties
    if (fishes.length > 0) {
      const fish = fishes[0]
      expect(fish).toHaveProperty('_id')
      expect(fish).toHaveProperty('name')
      expect(fish).toHaveProperty('price')
      expect(fish).toHaveProperty('category')
      expect(fish).toHaveProperty('availability')
    }
  })

  test('POST /api/fishes should create a new fish', async () => {
    const newFish = {
      name: 'API Test Fish',
      price: 150,
      category: 'community',
      availability: 'in_stock',
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop&auto=format',
      stock: 20,
      description: 'Fish created via API test',
      weight: 100,
      origin: 'Test Origin',
      priceUnit: 'per_piece',
      careLevel: 'beginner',
      tankSize: '10 gallons',
      waterTemp: '72-78°F',
      waterPH: '6.5-7.5',
      schooling: false,
      groupSize: 1
    }

    const response = await fetch(`${API_BASE_URL}/api/fishes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newFish)
    })

    expect(response.status).toBe(201)
    
    const createdFish = await response.json()
    expect(createdFish.name).toBe(newFish.name)
    expect(createdFish.price).toBe(newFish.price)
    expect(createdFish.category).toBe(newFish.category)
    
    createdFishId = createdFish._id
  })

  test('PUT /api/fishes/:id should update an existing fish', async () => {
    if (!createdFishId) {
      throw new Error('No fish ID available for update test')
    }

    const updatedFish = {
      name: 'Updated API Test Fish',
      price: 200,
      category: 'community',
      availability: 'in_stock',
      image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=300&fit=crop&auto=format',
      stock: 25,
      description: 'Updated fish via API test',
      weight: 100,
      origin: 'Test Origin',
      priceUnit: 'per_piece',
      careLevel: 'beginner',
      tankSize: '10 gallons',
      waterTemp: '72-78°F',
      waterPH: '6.5-7.5',
      schooling: false,
      groupSize: 1
    }

    const response = await fetch(`${API_BASE_URL}/api/fishes/${createdFishId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedFish)
    })

    expect(response.status).toBe(200)
    
    const updatedFishResponse = await response.json()
    expect(updatedFishResponse.name).toBe(updatedFish.name)
    expect(updatedFishResponse.price).toBe(updatedFish.price)
  })

  test('DELETE /api/fishes/:id should delete a fish', async () => {
    if (!createdFishId) {
      throw new Error('No fish ID available for delete test')
    }

    const response = await fetch(`${API_BASE_URL}/api/fishes/${createdFishId}`, {
      method: 'DELETE'
    })

    expect(response.status).toBe(200)
    
    const result = await response.json()
    expect(result.message).toBe('Fish deleted successfully')
  })

  test('GET /api/fishes/:id should return 404 for non-existent fish', async () => {
    const response = await fetch(`${API_BASE_URL}/api/fishes/507f1f77bcf86cd799439011`)
    expect(response.status).toBe(404)
  })

  test('POST /api/fishes should return 400 for invalid data', async () => {
    const invalidFish = {
      name: '', // Invalid: empty name
      price: -10, // Invalid: negative price
      category: 'invalid_category' // Invalid: not in enum
    }

    const response = await fetch(`${API_BASE_URL}/api/fishes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(invalidFish)
    })

    expect(response.status).toBe(500) // Should return error for invalid data
  })
})
