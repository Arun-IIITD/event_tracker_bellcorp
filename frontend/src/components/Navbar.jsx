import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 text-white p-4 flex justify-between">
      <h1 className="font-bold">Expense Tracker</h1>

      {user && (
        <div className="flex gap-4 cursor-pointer">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/transactions">Transactions</Link>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="bg-red-500 px-3 py-1 rounded cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
