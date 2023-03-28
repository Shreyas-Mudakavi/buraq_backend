const express = require("express");

const { auth } = require("../middlewares/auth");
const { addWallet, getWallet, updateWallet } = require("../controller/wallet");

const router = express.Router();

router.post("/add-wallet", auth, addWallet);
router.get("/get-wallet", auth, getWallet);
router.put("/update-wallet/:id", auth, updateWallet);

module.exports = router;
