const express = require('express');
const Client = require('../models/Client.js');
const Transaction = require('../models/Transaction.js');
const VehicleType = require('../models/VehicleType.js'); // Import VehicleType model
const { v4: uuidv4 } = require('uuid'); // Import uuid library
const router = express.Router();

// GET all clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find();
    const transactions = await Transaction.find();
    const transactionsByClient = transactions.reduce((acc, tx) => {
      if (!acc[tx.clientId]) acc[tx.clientId] = [];
      acc[tx.clientId].push(tx);
      return acc;
    }, {});
    const clientsWithTransactions = clients.map(client => ({
      ...client.toObject(),
      transactions: transactionsByClient[client.id] || []
    }));
    res.json(clientsWithTransactions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET the latest transaction
router.get('/transactions/latest', async (req, res) => {
  try {
    const latestTransaction = await Transaction.findOne().sort({ timestamp: -1 });
    if (!latestTransaction) return res.status(404).json({ message: 'No transactions found' });

    const client = await Client.findOne({ id: latestTransaction.clientId });
    const transactionWithClient = {
      ...latestTransaction.toObject(),
      clientName: client ? client.name : 'Unknown'
    };
    res.json(transactionWithClient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all transactions with pagination and sort
router.get('/transactions', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'timestamp';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const totalTransactions = await Transaction.countDocuments();
    const transactions = await Transaction.find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    // Manually add clientName and type
    const transactionsWithClientName = await Promise.all(transactions.map(async tx => {
      const client = await Client.findOne({ id: tx.clientId });
      let type = 'Previous Due';
      if (tx.vehicleTypeId) {
        const vehicleType = await VehicleType.findOne({ id: tx.vehicleTypeId });
        type = vehicleType ? vehicleType.name : 'Unknown';
      }
      return {
        ...tx.toObject(),
        clientName: client ? client.name : 'Unknown',
        type
      };
    }));

    const totalPages = Math.ceil(totalTransactions / limit);

    res.json({
      transactions: transactionsWithClientName,
      currentPage: page,
      totalPages,
      totalTransactions
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single client
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findOne({ id: req.params.id });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    const transactions = await Transaction.find({ clientId: req.params.id });
    const clientWithTransactions = { ...client.toObject(), transactions };
    res.json(clientWithTransactions);
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
    createdAt: req.body.createdAt || new Date().toISOString(),
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
    // Delete all transactions associated with the client
    await Transaction.deleteMany({ clientId: req.params.id });
    res.json({ message: 'Client and associated transactions deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Automatically set vehicleTypeId in transactions to match the client's profile
router.post('/:id/transactions', async (req, res) => {
  try {
    const client = await Client.findOne({ id: req.params.id });
    if (!client) return res.status(404).json({ message: 'Client not found' });

    let payableAmount;
    let vehicleTypeId = req.body.vehicleTypeId !== undefined ? req.body.vehicleTypeId : client.vehicleTypeId;

    if (req.body.payableAmount !== undefined) {
      payableAmount = req.body.payableAmount;
    } else {
      const vehicleType = await VehicleType.findOne({ id: vehicleTypeId });
      if (!vehicleType) return res.status(404).json({ message: 'Vehicle type not found' });
      payableAmount = vehicleType.chargingFee;
    }

    // Special handling for previous due (vehicleTypeId is null)
    let cashReceived = req.body.cashReceived || 0;
    let due;
    if (vehicleTypeId === null && req.body.payableAmount !== undefined) {
      // For previous due, set payableAmount to 0, cashReceived to 0, due to the input amount
      payableAmount = 0;
      cashReceived = 0;
      due = req.body.payableAmount;
    } else {
      due = payableAmount - cashReceived;
    }

    const transactionData = {
      id: req.body.id || uuidv4(),
      clientId: req.params.id,
      timestamp: req.body.timestamp || new Date().toISOString(),
      vehicleTypeId: vehicleTypeId || null,
      payableAmount,
      cashReceived,
      due,
    };

    const transaction = new Transaction(transactionData);
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    console.error('POST /api/clients/:id/transactions - Error:', err);
    res.status(500).json({ message: err.message });
  }
});

// PUT update a transaction
router.put('/:id/transactions/:txId', async (req, res) => {
  try {
    console.log(`PUT /api/clients/${req.params.id}/transactions/${req.params.txId} - Request Body:`, req.body);
    const client = await Client.findOne({ id: req.params.id });
    if (!client) {
      console.log(`Client not found for id: ${req.params.id}`);
      return res.status(404).json({ message: 'Client not found' });
    }

    const transaction = await Transaction.findOne({ id: req.params.txId, clientId: req.params.id });
    if (!transaction) {
      console.log(`Transaction not found for txId: ${req.params.txId}`);
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update the transaction
    Object.assign(transaction, req.body);

    // Special handling for previous due transactions
    if (transaction.vehicleTypeId === null) {
      // For previous due, due is not auto-recalculated; use provided due or keep existing
      if (req.body.due !== undefined) {
        transaction.due = req.body.due;
      }
    } else {
      // For regular transactions, recalculate due if cashReceived changed
      if (req.body.cashReceived !== undefined) {
        transaction.due = transaction.payableAmount - req.body.cashReceived;
      }
    }

    transaction.modifiedAt = new Date();

    await transaction.save();
    console.log(`Transaction updated successfully for client ${req.params.id}`);
    res.json(transaction);
  } catch (err) {
    console.error(`Error updating transaction for client ${req.params.id}:`, err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE a transaction
router.delete('/:id/transactions/:txId', async (req, res) => {
  try {
    const client = await Client.findOne({ id: req.params.id });
    if (!client) return res.status(404).json({ message: 'Client not found' });

    const transaction = await Transaction.findOneAndDelete({ id: req.params.txId, clientId: req.params.id });
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
