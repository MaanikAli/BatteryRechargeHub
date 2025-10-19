const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  timestamp: { type: String, required: true },
  vehicleTypeId: { type: String, required: true },
  payableAmount: { type: Number, required: true },
  cashReceived: { type: Number, required: true },
  due: { type: Number, required: true },
});

const clientSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  fatherName: { type: String },
  phone: { type: String, required: true },
  nid: { type: String },
  address: { type: String },
  vehicleTypeId: { type: String, required: true },
  imageUrl: { type: String },
  transactions: [transactionSchema],
  createdAt: { type: String, required: true },
  deleted: { type: Boolean, default: false },
});

module.exports = mongoose.model('Client', clientSchema);
