import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";

export default function EditTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    notes: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  // ✅ Fetch existing transaction
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const res = await axios.get(`/transactions/${id}`);
        const data = res.data;

        setForm({
          title: data.title,
          amount: data.amount,
          category: data.category,
          date: data.date.split("T")[0],
          notes: data.notes || "",
        });
      } catch (err) {
        setError("Failed to load transaction.");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchTransaction();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.put(`/transactions/${id}`, form);

      setSuccess("Transaction updated successfully!");

      setTimeout(() => {
        navigate("/transactions");
      }, 1500);

    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update transaction."
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Show loading while fetching
  if (fetchLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading transaction...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg p-6 rounded-xl w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Edit Transaction
        </h2>

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 text-green-600 p-2 mb-4 rounded text-sm">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 text-red-600 p-2 mb-4 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <input
            name="amount"
            type="number"
            value={form.amount}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <input
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          >
            <option value="">Select Category</option>
            <option value="Food">Food</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills</option>
            <option value="Entertainment">Entertainment</option>
          </select>

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <button
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white transition ${
              loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 cursor-pointer"
            }`}
          >
            {loading ? "Updating..." : "Update Transaction"}
          </button>

        </form>
      </div>
    </div>
  );
}
