const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      // default: "car-owner",
      enum: ["car-owner", "partner-driver", "buraq moto", "admin", "passenger"],
      required: true,
    },
    proofResidence: {
      type: String,
    },
    license: {
      imageUrl: {
        type: String,
        // required: true,
      },
      expiration: {
        type: Date,
        default: "",
      },
    },
    panCard: {
      type: String,
      // required: true,
    },
    registration: {
      type: String,
      // required: true,
    },
    profilePic: {
      type: String,
      required: true,
    },
    // rating: {
    //   type: Number,
    //   default: 0,
    // },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", userSchema);
