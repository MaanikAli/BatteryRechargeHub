const express = require('express');
const Client = require('../models/Client.js');
const VehicleType = require('../models/VehicleType.js'); // Import VehicleType model
const { v4: uuidv4 } = require('uuid'); // Import uuid library
const router = express.Router();

// GET all clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single client
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findOne({ id: req.params.id });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new client
router.post('/', async (req, res) => {
  console.log('POST /api/clients - Request Body:', req.body);

  // Ensure id is provided or generate a unique one
  const clientData = {
    id: req.body.id || uuidv4(),
    ...req.body,
    vehicleTypeId: req.body.vehicleTypeId || 'defaultVehicleTypeId', // Replace with a valid default ID
  };

  const client = new Client(clientData);
  try {
    const newClient = await client.save();
    console.log('POST /api/clients - New Client Saved:', newClient);
    res.status(201).json(newClient);
  } catch (err) {
    console.error('POST /api/clients - Error:', err);
    res.status(400).json({ message: err.message });
  }
});

// PUT update a client
router.put('/:id', async (req, res) => {
  console.log(`PUT /api/clients/${req.params.id} - Request Body:`, req.body);
  try {
    const updatedClient = await Client.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    console.log(`PUT /api/clients/${req.params.id} - Updated Client:`, updatedClient);
    if (!updatedClient) return res.status(404).json({ message: 'Client not found' });
    res.json(updatedClient);
  } catch (err) {
    console.error(`PUT /api/clients/${req.params.id} - Error:`, err);
    res.status(400).json({ message: err.message });
  }
});

// DELETE a client
router.delete('/:id', async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({ id: req.params.id });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    res.json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Automatically set vehicleTypeId in transactions to match the client's profile
router.post('/:id/transactions', async (req, res) => {
  try {
    const client = await Client.findOne({ id: req.params.id });
    if (!client) return res.status(404).json({ message: 'Client not found' });

    const vehicleType = await VehicleType.findOne({ id: client.vehicleTypeId });
    if (!vehicleType) return res.status(404).json({ message: 'Vehicle type not found' });

    const transaction = {
      id: req.body.id || uuidv4(),
      timestamp: req.body.timestamp || new Date().toISOString(),
      vehicleTypeId: client.vehicleTypeId, // Automatically set from profile
      payableAmount: vehicleType.chargingFee, // Calculate payable amount
      cashReceived: req.body.cashReceived || 0,
      due: vehicleType.chargingFee - (req.body.cashReceived || 0), // Calculate due properly
    };

    client.transactions.push(transaction);
    await client.save();
    res.status(201).json(client);
  } catch (err) {
    console.error('POST /api/clients/:id/transactions - Error:', err);
    res.status(500).json({ message: err.message });
  }
});

// PUT update a transaction
router.put('/:id/transactions/:txId', async (req, res) => {
  try {
    const client = await Client.findOne({ id: req.params.id });
    if (!client) return res.status(404).json({ message: 'Client not found' });

    const txIndex = client.transactions.findIndex(tx => tx.id === req.params.txId);
    if (txIndex === -1) return res.status(404).json({ message: 'Transaction not found' });

    // Update the transaction
    client.transactions[txIndex] = { ...client.transactions[txIndex], ...req.body };

    // Recalculate due if cashReceived changed
    if (req.body.cashReceived !== undefined) {
      client.transactions[txIndex].due = client.transactions[txIndex].payableAmount - req.body.cashReceived;
    }

    await client.save();
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE a transaction
router.delete('/:id/transactions/:txId', async (req, res) => {
  try {
    const client = await Client.findOne({ id: req.params.id });
    if (!client) return res.status(404).json({ message: 'Client not found' });

    client.transactions = client.transactions.filter(tx => tx.id !== req.params.txId);
    await client.save();
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
