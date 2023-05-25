require("dotenv").config();
const express = require('express');
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const PORT = 4000;

// Require the user resource routes and controllers
const userController = require("./controllers/users");
const authController = require("./controllers/auth");


//Middlewares
app.use(express.json()); // help to submit the data from page to page with form
app.use(cors());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

// Use the auth routes
app.use('/api/users', authController);
app.use('/api/auth', authController);

app.get('/', (req, res) => {
    res.send('default route - functional');
});

//Listener
app.listen(PORT, () => console.log(`Listening for client requests on port ${PORT}`));