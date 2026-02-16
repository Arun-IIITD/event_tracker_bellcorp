const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getSummary,
} = require("../controllers/transactionController");

const router = express.Router();

//ADD TRANSACTION
router.route("/").post(protect, createTransaction).get(protect, getTransactions);

//GETTING ALL TRANSACTION
router.get("/summary", protect, getSummary);


//
router
  .route("/:id")
  .get(protect, getTransactionById)//GETTING SINGLE TRANSACTION
  .put(protect, updateTransaction) //UPDATING
  .delete(protect, deleteTransaction);// DELTE

module.exports = router;
