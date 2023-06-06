const express = require("express");

const { auth } = require("../middlewares/auth");
const { addLostItem } = require("../controller/lostItem");

const router = express.Router();

router.post("/add-lostItem", auth, addLostItem);

module.exports = router;
