const Transaction = require("../models/Transaction.model");


// Create
exports.createTransaction = async (req, res) => {
  const { title, amount, category, date, notes } = req.body;

  const transaction = await Transaction.create({
    user: req.user._id,
    title,
    amount,
    category,
    date,
    notes,
  });

  res.status(201).json(transaction);
};


// Get All (Pagination + Search + Filter)
exports.getTransactions = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const { search, category } = req.query;

  let filter = { user: req.user._id };

  // 🔍 Search (title OR category partial)
  if (search && search.trim() !== "") {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  // 📂 Category filter (exact but case insensitive)
  if (category && category.trim() !== "") {
    filter.category = { $regex: `^${category}$`, $options: "i" };
  }

  const transactions = await Transaction.find(filter)
    .sort({ date: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Transaction.countDocuments(filter);

  res.json({
    transactions,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
};




// Get Single
exports.getTransactionById = async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction)
    return res.status(404).json({ message: "Transaction not found" });

  res.json(transaction);
};


// Update
exports.updateTransaction = async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction)
    return res.status(404).json({ message: "Transaction not found" });

  Object.assign(transaction, req.body);
  await transaction.save();

  res.json(transaction);
};


// Delete
exports.deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findById(req.params.id);

  if (!transaction)
    return res.status(404).json({ message: "Transaction not found" });

  await transaction.deleteOne();
  res.json({ message: "Transaction deleted" });
};


// Dashboard Summary
exports.getSummary = async (req, res) => {
  const userId = req.user._id;

  const totalExpense = await Transaction.aggregate([
    { $match: { user: userId } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const categoryBreakdown = await Transaction.aggregate([
    { $match: { user: userId } },
    { $group: { _id: "$category", total: { $sum: "$amount" } } },
  ]);

  const recentTransactions = await Transaction.find({ user: userId })
    .sort({ date: -1 })
    .limit(5);

  res.json({
    totalExpense: totalExpense[0]?.total || 0,
    categoryBreakdown,
    recentTransactions,
  });
};
