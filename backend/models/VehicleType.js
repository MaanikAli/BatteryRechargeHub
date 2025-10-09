const mongoose = require('mongoose');

const vehicleTypeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  chargingFee: { type: Number, required: true },
});

module.exports = mongoose.model('VehicleType', vehicleTypeSchema);
