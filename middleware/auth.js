const jwt = require("jsonwebtoken")
const User = require("../models/User")

// check if user is authenticated
exports.requireToken = async (req, res, next) => {
  const token = req.headers["authorization"]
  if (!token) return res.status(401).send("Access denied")

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = verified
    next()
  } catch (err) {
    res.status(400).send("Invalid token")
  }
}
