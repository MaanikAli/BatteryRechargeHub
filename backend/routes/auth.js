const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin.js');
const auth = require('../middleware/auth.js');
const router = express.Router();

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

// Admin login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: admin._id }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update admin credentials
router.put('/update', auth, async (req, res) => {
  const { currentPassword, newUsername, newPassword } = req.body;
  try {
    const admin = await Admin.findById(req.adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid current password' });

    let updated = false;

    if (newUsername && newUsername.trim() !== '' && newUsername !== admin.username) {
      const existingAdmin = await Admin.findOne({ username: newUsername });
      if (existingAdmin) return res.status(400).json({ message: 'Username already taken' });
      admin.username = newUsername;
      updated = true;
    }

    if (newPassword && newPassword.trim() !== '') {
      admin.password = await bcrypt.hash(newPassword, 10);
      updated = true;
    }

    if (!updated) {
      return res.status(400).json({ message: 'No changes provided' });
    }

    await admin.save();

    res.json({ message: 'Credentials updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
