const express = require("express");

const { auth } = require("../middlewares/auth");
const { addTrips } = require("../controller/trip");

const router = express.Router();

router.post("/add-trip", auth, addTrips);

module.exports = router;
