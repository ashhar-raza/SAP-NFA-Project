import React, { useState } from "react";
import { fetchToken } from "../api/auth";
import Loading from "../components/Loading";
import { useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Get gradient & role from state passed by Dashboard
  const { gradient = "from-blue-400 to-blue-700", role = "buyer" } = location.state || {};

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await fetchToken();
      setLoading(false);

      // Navigate to respective home based on role
      navigate(`/${role}`);
    } catch (err) {
      console.error(err);
      setError("Failed to sign in. Try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br rounded-2xl ${gradient} px-4`}
      style={{ minHeight: "calc(100vh - 180px)" }}
    >
      {loading && <Loading />}
      <div className="bg-white dark:bg-card rounded-2xl shadow-2xl p-8 sm:p-10 w-full max-w-md transform transition-all duration-500 hover:scale-105">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">Sign In</h1>

        {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}

        <form onSubmit={handleSignIn} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="input focus:ring-2 focus:ring-blue-400 focus:outline-none rounded-lg px-3 py-2 border border-gray-300"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="input focus:ring-2 focus:ring-blue-400 focus:outline-none rounded-lg px-3 py-2 border border-gray-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
