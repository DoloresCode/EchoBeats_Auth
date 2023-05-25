// Modules Importation
const router = express.Router();
const { User, approve } = require("../models/User"); // User Model and validation function
const bcrypt = require("bcrypt"); //Bcrypt for password hashing
const express = require("express");
// const auth = require("../middleware/auth");


// POST /auth/Register-Signup
router.post("/", async (req, res) => {
    try {
        // Validate the request body with the approve function imported from User model
        const { error } = approve(req.body);
        // If there's an error in validation, send a 400 status code with error message
        if (error) return res.status(400).send({message:error.details[0].message});

        // if absence of error, check if the user with the same email address already exist
        const user = await User.findOne({email:req.body.email});
        
        // If user exists, send a 409 status code with an error message
        if (user)
            return res.status(409).send({message:"A user with email already exist"});
        
            // If user doesn't exist, hash the password before storing
        const salt = await bcrypt.genSalt(Number(process.env.SALT)); // Generate a salt using bcrypt
        const passwordHash = await bcrypt.hash(req.body.password, salt); // Hash the password

        // Save the new user to the database with hashed password
        await new User({...req.body, password:passwordHash}).save();

        // Send a 201 status code with success message
        res.status(201).send({message:"New user created successfully"})
    } catch (error) {
        // If there's any error in the process above, send a 500 status code with an error message
        res.status(500).send({message:"Internal Server Error"});
    }
})

// Export the router to be used in the main server file
module.exports = router;
