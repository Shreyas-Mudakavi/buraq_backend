const express = require("express");

const { auth } = require("../middlewares/auth");
const { addReview, getReview } = require("../controller/review");

const router = express.Router();

router.post("/add-review", auth, addReview);

router.get("/get-reviews", auth, getReview);

module.exports = router;
