const express = require('express');
const VehicleType = require('../models/VehicleType.js');
const { v4: uuidv4 } = require('uuid'); // Import uuid library
const router = express.Router();

// GET all vehicle types
router.get('/', async (req, res) => {
  try {
    const vehicleTypes = await VehicleType.find();
    res.json(vehicleTypes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single vehicle type
router.get('/:id', async (req, res) => {
  try {
    const vehicleType = await VehicleType.findOne({ id: req.params.id });
    if (!vehicleType) return res.status(404).json({ message: 'Vehicle type not found' });
    res.json(vehicleType);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new vehicle type
router.post('/', async (req, res) => {
  console.log('POST /api/vehicleTypes - Request Body:', req.body);

  // Generate a unique ID if not provided
  const vehicleTypeData = {
    id: req.body.id || uuidv4(),
    ...req.body,
  };

  const vehicleType = new VehicleType(vehicleTypeData);
  try {
    const newVehicleType = await vehicleType.save();
    console.log('POST /api/vehicleTypes - New Vehicle Type Saved:', newVehicleType);
    res.status(201).json(newVehicleType);
  } catch (err) {
    console.error('POST /api/vehicleTypes - Error:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update a vehicle type
router.put('/:id', async (req, res) => {
  console.log(`PUT /api/vehicleTypes/${req.params.id} - Request Body:`, req.body);
  try {
    const updatedVehicleType = await VehicleType.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    console.log(`PUT /api/vehicleTypes/${req.params.id} - Updated Vehicle Type:`, updatedVehicleType);
    if (!updatedVehicleType) return res.status(404).json({ message: 'Vehicle type not found' });
    res.json(updatedVehicleType);
  } catch (err) {
    console.error(`PUT /api/vehicleTypes/${req.params.id} - Error:`, err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE a vehicle type
router.delete('/:id', async (req, res) => {
  try {
    const vehicleType = await VehicleType.findOneAndDelete({ id: req.params.id });
    if (!vehicleType) return res.status(404).json({ message: 'Vehicle type not found' });
    res.json({ message: 'Vehicle type deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
