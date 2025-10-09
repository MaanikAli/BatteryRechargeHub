const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  clientId: { type: String, required: true },
  timestamp: { type: String, required: true },
  vehicleTypeId: { type: String, required: true },
  payableAmount: { type: Number, required: true },
  cashReceived: { type: Number, required: true },
  due: { type: Number, required: true },
  modifiedAt: { type: Date, default: Date.now },
});

// Add index on clientId for faster queries
transactionSchema.index({ clientId: 1 });

// Add index on modifiedAt for efficient queries on recently modified transactions
transactionSchema.index({ modifiedAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);
