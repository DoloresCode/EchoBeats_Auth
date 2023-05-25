// Require the necessary modules
const express = require("express")
const bcrypt = require("bcrypt")
const User = require("../models/User")
const { createUserToken } = require("../middleware/auth");

// Create a new router
const router = express.Router()

// SIGN UP
// POST /auth/signup
router.post("/signup", async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(req.body.password, salt)

    const pwStore = req.body.password
    // we store this temporarily so the origin plain text password can be parsed by the createUserToken();

    req.body.password = passwordHash
    // modify req.body (for storing hash in db)

    // Create a new user with the hashed password and the rest of the info in the db
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: passwordHash, // store hashed password in the database
    })

    if (newUser) {
      req.body.password = pwStore
      const authenticatedUserToken = createUserToken(req, newUser)
      // Send a response
      res.status(201).json({
        user: newUser,
        isLoggedIn: true,
        token: authenticatedUserToken,
      })
    } else {
      res.status(400).json({ error: "Something went wrong" })
    }
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// SIGN IN
// POST /auth/login
router.post("/login", async (req, res, next) => {
  try {
    const loggingEmail = req.body.email
    const foundUser = await User.findOne({ email: loggingEmail })

    // check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      foundUser.password
    )
    if (!isPasswordCorrect) {
      throw new Error("Invalid credentials")
    }

    const token = await createUserToken(req, foundUser)
    res.status(200).json({
      user: foundUser,
      isLoggedIn: true,
      token,
    })
  } catch (err) {
    res.status(401).json({ error: err.message })
  }
})

// Export the router
module.exports = router
