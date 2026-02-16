import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "../api/axios";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();

  const LIMIT = 5;

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  const [searchInput, setSearchInput] = useState(search);
  const [selectedCategory, setSelectedCategory] = useState(category);

  /* ---------------- Debounce Search ---------------- */
  useEffect(() => {
    const delay = setTimeout(() => {
      const params = Object.fromEntries([...searchParams]);
      params.search = searchInput;
      params.page = 1;
      setSearchParams(params);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchInput]);

  /* ---------------- Category Filter ---------------- */
  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    params.category = selectedCategory;
    params.page = 1;
    setSearchParams(params);
  }, [selectedCategory]);

  /* ---------------- Auto Hide Messages ---------------- */
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, error]);

  /* ---------------- Fetch Transactions ---------------- */
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/transactions", {
        params: {
          page,
          limit: LIMIT,
          search,
          category,
        },
      });

      setTransactions(data.transactions || []);
      setTotalPages(data.pages || 1);
    } catch (err) {
      setError("Failed to fetch transactions ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [searchParams]);

  /* ---------------- Pagination ---------------- */
  const changePage = (newPage) => {
    const params = Object.fromEntries([...searchParams]);
    params.page = newPage;
    setSearchParams(params);
  };

  /* ---------------- Delete ---------------- */
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
      setMessage("Transaction deleted successfully 🗑️");
    } catch (err) {
      setError("Failed to delete transaction ❌");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transaction Explorer</h1>

        <Link
          to="/add-transaction"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Add
        </Link>
      </div>

      {/* Messages */}
      {message && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {/* Search + Filter */}
      <div className="bg-white shadow p-4 rounded mb-6 flex gap-4">

        {/* Search */}
        <input
          type="text"
          placeholder="Search by Title..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Entertainment">Entertainment</option>
        </select>
      </div>

      {/* Transactions */}
      <div className="bg-white shadow rounded p-4">
        {loading ? (
          <p>Loading...</p>
        ) : transactions.length === 0 ? (
          <p className="text-gray-500 text-center py-6">
            No transactions found
          </p>
        ) : (
          transactions.map((t) => (
            <div
              key={t._id}
              className="flex justify-between items-center border-b py-3"
            >
              <div>
                <p className="font-semibold">{t.title}</p>
                <p className="text-sm text-gray-500">
                  ₹{t.amount} | {t.category}
                </p>
              </div>

              <div className="flex gap-3">
                <Link
                  to={`/edit-transaction/${t._id}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(t._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => changePage(page - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => changePage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => changePage(page + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
