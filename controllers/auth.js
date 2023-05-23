// Require the necessary modules
const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Create a new router
const router = express.Router();

// SIGN UP
// POST /auth/signup
router.post("/signup", async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    
    try {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create a new user with the hashed password and the rest of the info
      const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
      
      // Send a response
      res.status(201).json({
        currentUser: newUser,
        isLoggedIn: true,
      });
    } catch (err) {
      res.status(400).json({ err: err.message });
    }
  });
  

// SIGN IN
// POST /auth/login
router.post("/login", async (req, res, next) => {});







// Export the router
module.exports = router;
