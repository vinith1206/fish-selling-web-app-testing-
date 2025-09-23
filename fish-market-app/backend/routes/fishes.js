const express = require('express');
const Fish = require('../models/Fish');
const router = express.Router();

// GET /api/fishes - Get all fishes
router.get('/', async (req, res) => {
  try {
    const fishes = await Fish.find().sort({ createdAt: -1 });
    res.json(fishes);
  } catch (error) {
    console.error('Error fetching fishes:', error);
    res.status(500).json({ message: 'Error fetching fishes' });
  }
});

// GET /api/fishes/:id - Get fish by ID
router.get('/:id', async (req, res) => {
  try {
    const fish = await Fish.findById(req.params.id);
    if (!fish) {
      return res.status(404).json({ message: 'Fish not found' });
    }
    res.json(fish);
  } catch (error) {
    console.error('Error fetching fish:', error);
    res.status(500).json({ message: 'Error fetching fish' });
  }
});

// POST /api/fishes - Create new fish (Admin only)
router.post('/', async (req, res) => {
  try {
    const fish = new Fish(req.body);
    await fish.save();
    res.status(201).json(fish);
  } catch (error) {
    console.error('Error creating fish:', error);
    res.status(500).json({ message: 'Error creating fish' });
  }
});

// PUT /api/fishes/:id - Update fish (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const fish = await Fish.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!fish) {
      return res.status(404).json({ message: 'Fish not found' });
    }
    res.json(fish);
  } catch (error) {
    console.error('Error updating fish:', error);
    res.status(500).json({ message: 'Error updating fish' });
  }
});

// DELETE /api/fishes/:id - Delete fish (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const fish = await Fish.findByIdAndDelete(req.params.id);
    if (!fish) {
      return res.status(404).json({ message: 'Fish not found' });
    }
    res.json({ message: 'Fish deleted successfully' });
  } catch (error) {
    console.error('Error deleting fish:', error);
    res.status(500).json({ message: 'Error deleting fish' });
  }
});

module.exports = router;





















