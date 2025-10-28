import React, { useState, useEffect } from "react";
import { fetchToken } from "../api/auth";
import Loading from "../components/Loading";
import Error from "../components/Error";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle } from "lucide-react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  // const [password, setPassword] = useState(""); // commented for now

  const navigate = useNavigate();
  const location = useLocation();

  const { gradient = "from-blue-400 to-blue-700", role = "buyer" } =
    location.state || {};

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(false);

    // ✅ Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      // 🧠 Keep your API call
      await fetchToken(email);
      localStorage.setItem("email", email); // ✅ Save email to localStorage
      setLoading(false);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Failed to sign in. Please try again.");
      setLoading(false);
    }
  };

  const handleRetry = () => setError("");

  // ⏳ Navigate after success
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate(`/${role}`), 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate, role]);

  // 🔄 Loading state
  if (loading) return <Loading />;

  // ❌ Error state
  if (error) return <Error message={error} onRetry={handleRetry} />;

  // ✅ Success screen
  if (success) {
    return (
      <div
        className="flex flex-col items-center justify-center bg-gradient-to-br from-green-400 to-green-700 text-white px-4"
        style={{ minHeight: "calc(100vh - 180px)" }}
      >
        <CheckCircle className="w-20 h-20 mb-4 animate-bounce" />
        <h2 className="text-3xl font-bold mb-2">Signed in successfully!</h2>
        <p className="text-lg opacity-90">Redirecting to your dashboard...</p>
      </div>
    );
  }

  // 🧩 Login Form
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br rounded-2xl ${gradient} px-4`}
      style={{ minHeight: "calc(100vh - 180px)" }}
    >
      <div className="bg-white dark:bg-card rounded-2xl shadow-2xl p-8 sm:p-10 w-full max-w-md transform transition-all duration-500 hover:scale-105">
        <h1 className="text-3xl font-bold text-center text-primary mb-6">
          Sign In
        </h1>

        <form onSubmit={handleSignIn} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="focus:ring-2 focus:ring-blue-400 focus:outline-none rounded-lg px-3 py-2 border border-gray-300"
              required
            />
          </div>

          {/* 
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
          */}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
