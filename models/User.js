// find and connect to the database
const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema(
    {
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
      },
      {
        timestamps: true,
        toJSON: {
          virtuals: true,
          // ret is the returned Mongoose document
          transform: (_doc, ret) => {
            delete ret.password;
            return ret;
          },
        },
      }
    );

// creates a user collection in the database in MongoDB
module.exports = mongoose.model("User", userSchema);
