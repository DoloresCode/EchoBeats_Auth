// Require the necessary modules
const express = require("express")
const { User, approve } = require("../models/User")
const bcrypt = require("bcrypt")
const Joi = require("joi")
const { requireToken } = require("../middleware/auth")
const router = express.Router() // Create a new router

const approvePayload = (userData) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  })
  return schema.validate(userData)
}

// POST /auth/login
router.post("/login", async (req, res) => {
  console.log(approvePayload(req.body))
  try {
    // Validate the request body with the approve function imported from User model
    const { error } = approvePayload(req.body)
    // If there's an error in validation, send a 400 status code with error message
    if (error)
      return res.status(400).send({ message: error.details[0].message })

    // if absence of error, check if the user with the same email address already exist
    const user = await User.findOne({ email: req.body.email })
    // If user does not exist, send a 401 status code with an error message
    if (!user)
      return res.status(401).send({ message: "Invalid password or email" })

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(401).send("Invalid email or password")

    // If email and password are valide generate a token
    const userToken = user.generateAuthToken()
    res.status(200).send({ data: userToken, message: "Logged in successfully" })
  } catch (error) {
    res
      .status(500)
      .send({ message: "An error occured with the internal server" })
  }
})

router.post("/signup", async (req, res) => {
  try {
    // Validate the request body with the approve function imported from User model
    const { error } = approve(req.body)
    // If there's an error in validation, send a 400 status code with error message
    if (error)
      return res.status(400).send({ message: error.details[0].message })

    // if absence of error, check if the user with the same email address already exist
    const user = await User.findOne({ email: req.body.email })

    // If user exists, send a 409 status code with an error message
    if (user)
      return res
        .status(409)
        .send({ message: "A user with email already exist" })

    // If user doesn't exist, hash the password before storing
    const salt = await bcrypt.genSalt(Number(process.env.SALT)) // Generate a salt using bcrypt
    const passwordHash = await bcrypt.hash(req.body.password, salt) // Hash the password

    // Save the new user to the database with hashed password
    await new User({ ...req.body, password: passwordHash }).save()

    // Send a 201 status code with success message
    res.status(201).send({ message: "New user created successfully" })
  } catch (error) {
    console.log(error)
    // If there's any error in the process above, send a 500 status code with an error message
    res.status(500).send({ message: "Internal Server Error" })
  }
})

router.get("/logout", requireToken, async (req, res, next) => {
  try {
    const currentUser = req.user
    res.status(200).json({
      message: `${currentUser.firstname} ${currentUser.lastname} logged out successfully`,
      isoggedIn: false,
      token: "",
    })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// Export the router to be used in the main server file
module.exports = router
