const express = require("express");

const { auth } = require("../middlewares/auth");
const {
  addTransaction,
  withdrawal,
  updateTransaction,
  getAllTransactions,
  getAll,
} = require("../controller/transaction");

const router = express.Router();

// router.post("/add-transaction", auth, addTransaction);
router.put("/update-transaction/:id", auth, updateTransaction);
router.post("/transaction-withdrawal", auth, withdrawal);
router.get("/all", auth, getAll);
// router.delete("/delete-transaction/:id", auth, deleteTransaction);

module.exports = router;
