const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Set time zone to Bangladesh (UTC+6)
process.env.TZ = 'Asia/Dhaka';

const Admin = require('./models/Admin');
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
mongoose.connect('mongodb+srv://sowad:sowad@cluster0.m7vh241.mongodb.net/rechargeHub?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
    console.log('MongoDB connected');
    // Initialize preset admin
    const existingAdmin = await Admin.findOne({ username: 'tarek' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('tarek123', 10);
      const admin = new Admin({ username: 'tarek', password: hashedPassword });
      await admin.save();
      console.log('Preset admin created');
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/vehicleTypes', require('./routes/vehicleTypes'));

// Public routes for viewing data JSON without auth
app.get('/api/public/vehicleTypes', async (req, res) => {
  console.log('Public vehicleTypes route hit');
  try {
    const VehicleType = require('./models/VehicleType');
    const vehicleTypes = await VehicleType.find();
    res.json(vehicleTypes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/public/clients', async (req, res) => {
  console.log('Public clients route hit');
  try {
    const Client = require('./models/Client');
    const clients = await Client.find();
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
