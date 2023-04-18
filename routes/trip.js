const express = require("express");

const { auth } = require("../middlewares/auth");
const { addTrips, getTrips } = require("../controller/trip");

const router = express.Router();

router.post("/add-trip", auth, addTrips);
router.post("/get-trips", auth, getTrips);

module.exports = router;
