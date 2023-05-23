const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const PORT = 4000;

// Require the user resource routes and controllers
const authController = require("./controllers/auth");

//Middleware
app.use(express.urlencoded({ extended: true}));
app.use(express.json()); // help to submit the data from page to page with form
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
// Use the auth routes
app.use('/auth', authController);



//Listener
app.listen(PORT, () => console.log(`Listening for client requests on port ${PORT}`));