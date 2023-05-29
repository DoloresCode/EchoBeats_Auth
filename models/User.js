// find and connect to the database
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const Joi = require("joi") //imporet joi
const passwordComplexity = require("joi-password-complexity") //make sure to give the name of the package call

// User Schema
const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "Please enter your first name"],
    unique: [false, "Make sure it is correct!"],
  },
  lastname: {
    type: String,
    required: [true, "Please enter your last name"],
    unique: [false, "Make sure it is correct!"],
  },
  email: {
    type: String,
    required: [true, "Please make sure to enter an email"],
    unique: [true, "You already have an account with this email address"],
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minLength: [12, "A minimum 12 characters password is required"],
  },
})

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, firstname: this.firstname, lastname: this.lastname },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  )
  return token
}

const User = mongoose.model("user", userSchema)

const approve = (userData) => {
  const schema = Joi.object({
    firstname: Joi.string().required().label("firstname"),
    lastname: Joi.string().required().label("lastname"),
    email: Joi.string().email().required().label("email"),
    password: passwordComplexity().required().label("password"),
  })
  return schema.validate(userData)
}

module.exports = { User, approve }

// https://joi.dev/api/?v=17.9.1
