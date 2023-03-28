const express = require("express");

const { auth } = require("../middlewares/auth");
const { addBank, getBank } = require("../controller/bank");

const router = express.Router();

router.post("/add-bank", auth, addBank);
router.get("/get-bank", auth, getBank);

module.exports = router;
