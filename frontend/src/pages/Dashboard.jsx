import { useEffect, useState } from "react";
import axios from "../api/axios";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await axios.get("/transactions/summary");
        setSummary(data);
      } catch (error) {
        console.error("Error fetching summary:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!summary) {
    return <p className="text-center mt-10">No data available</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Total Expenses */}
      <div className="bg-white p-6 shadow rounded mb-6">
        <h2 className="text-xl font-semibold mb-2">Total Expenses</h2>
        <p className="text-4xl font-bold text-red-500">
          ₹{summary.totalExpense}
        </p>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white p-6 shadow rounded mb-6">
        <h3 className="text-xl font-semibold mb-4">Category Breakdown</h3>

        {summary.categoryBreakdown.length === 0 ? (
          <p className="text-gray-500">No category data</p>
        ) : (
          summary.categoryBreakdown.map((cat) => (
            <div
              key={cat._id}
              className="flex justify-between border-b py-2"
            >
              <span className="font-medium">{cat._id}</span>
              <span className="font-semibold">₹{cat.total}</span>
            </div>
          ))
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 shadow rounded">
        <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>

        {summary.recentTransactions.length === 0 ? (
          <p className="text-gray-500">No recent transactions</p>
        ) : (
          summary.recentTransactions.map((txn) => (
            <div
              key={txn._id}
              className="flex justify-between border-b py-2"
            >
              <div>
                <p className="font-medium">{txn.title}</p>
                <p className="text-sm text-gray-500">
                  {new Date(txn.date).toLocaleDateString()}
                </p>
              </div>
              <span className="font-semibold text-red-500">
                ₹{txn.amount}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
