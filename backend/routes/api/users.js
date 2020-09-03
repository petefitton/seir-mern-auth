require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const passport = require('passport');
const JWT_SECRET = process.env.JWT_SECRET;

// Load User model
const User = require('../../models/User');
// const db = require('../../models')

// GET api/users/test (Public)
router.get('/test', (req, res) => {
  res.json({ msg: 'User endpoint OK' });
});

// POST api/users/register (Public)
router.post('/register', (req, res) => {
  console.log("here first");
  // Find user by email
  let formEmail = req.body.email
  console.log(formEmail);
  User.findOne({ email: formEmail })
  .then(user => {
    console.log("hit here")
    // if email already exists, send a 400 response
    if (user) {
      return res.status(400).json({ msg: "Email already exists" });
    }
    // else create a new user
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    // Salt and hash the password, then save the User
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(newUser.password, salt, (error, hash) => {
        if (error) throw error;
        // Change the password to the hash
        newUser.password = hash;
        newUser.save()
        .then(createdUser => res.json(createdUser))
        .catch(error => console.log(error));
      });
    });
  })
  .catch(err=>console.log(err));
});

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(req.body);
  // Find a user via email
  User.findOne({ email })
  .then(userFound => {
    if (!userFound) {
      res.status(400).json({ msg: "User Not Found" });
    }
    // Check password with bcrypt
    bcrypt.compare(password, userFound.password)
    .then(isMatch => {
      console.log(isMatch);
      if (isMatch) {
        // User match, send JSON web token
        // Create a token payload (you can include anything you want)
        const payload = {
          id: userFound.id,
          name: userFound.name,
          email: userFound.email
        };
        console.log(payload);
        // Sign token
        jwt.sign(payload, JWT_SECRET, { expiresIn: 3600 }, (error, token) => {
          console.log("hitting HUR");
          return res.json({ success: true, token: `Bearer ${token}` });
        });
      } else {
        return res.status(400).json({ msg: "Password or Email is incorrect" });
      }
    })
    .catch(err=>console.log(err));
  })
  .catch(err=>console.log(err));
});

// GET api/users/current (Private)
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

module.exports = router;