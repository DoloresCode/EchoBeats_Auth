// Require the necessary modules
const express = require("express")
const { User } = require("../models/User")
const bcrypt = require("bcrypt")
const Joi = require("joi")
const { createUserToken } = require("../middleware/auth")
const router = express.Router() // Create a new router

// POST /auth/login
router.post("/", async (req, res) => {
  console.log(approve(req.body))
  try {
    // Validate the request body with the approve function imported from User model
    const { error } = approve(req.body)
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

const approve = (userData) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  })
  return schema.validate(userData)
}

// Export the router to be used in the main server file
module.exports = router
