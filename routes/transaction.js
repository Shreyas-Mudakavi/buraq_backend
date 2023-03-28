const express = require("express");

const { auth } = require("../middlewares/auth");
const {
  addTransaction,
  withdrawal,
  updateTransaction,
} = require("../controller/transaction");

const router = express.Router();

router.post("/add-transaction", auth, addTransaction);
router.get("/transaction-withdrawal", auth, withdrawal);
router.put("/update-transaction/:id", auth, updateTransaction);
// router.delete("/delete-transaction/:id", auth, deleteTransaction);

module.exports = router;
