require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const passport = require('passport');
const JWT_SECRET = process.env.JWT_SECRET;

// Load User model
const User = require('../../models/User');

// GET api/users/test (Public)
router.get('/test', (req, res) => {
  res.json({ msg: 'User endpoint OK' });
});

module.exports = router;