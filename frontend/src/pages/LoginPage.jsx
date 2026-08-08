import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContextCore";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      // If user is admin navigate to admin panel directly
      if (data?.data?.user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      alert(err.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a] px-4 py-10">
      <div className="w-full max-w-md bg-[#1f2937] rounded-2xl shadow-xl border border-gray-700/60 p-8 relative overflow-hidden">
        {/* Back icon button */}
        <button
          type="button"
          onClick={() => navigate("/")}
          aria-label="Back"
          className="absolute top-4 left-4 px-3.5 py-1.5 inline-flex items-center justify-center rounded-xl text-xs font-bold bg-black text-white border border-gray-700 shadow hover:bg-gray-900 transition"
        >
          ← Back
        </button>

        <h1 className="mt-8 text-2xl sm:text-3xl font-extrabold text-white tracking-wide mb-4 text-center font-brand">
          Welcome Back
        </h1>
        <div className="mb-4">
          <div className="w-full text-center text-xs font-semibold text-gray-300 bg-gray-900 rounded-xl px-3 py-2 border border-gray-700">
            Note: Only <span className="text-[#facc15] font-bold">captains</span> and{" "}
            <span className="text-[#facc15] font-bold">admin</span> can login.
          </div>
        </div>
        <p className="text-sm text-gray-300 text-center mb-8 font-medium">
          Sign in to continue to{" "}
          <span className="text-white font-bold">DGPL Auction</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs font-bold text-gray-300 uppercase tracking-wider"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-gray-900 border border-gray-700 focus:border-[#facc15] focus:ring-2 focus:ring-[#facc15]/50 text-white px-4 py-2.5 text-sm placeholder-gray-500 outline-none transition shadow-sm"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-bold text-gray-300 uppercase tracking-wider"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-gray-900 border border-gray-700 focus:border-[#facc15] focus:ring-2 focus:ring-[#facc15]/50 text-white px-4 py-2.5 text-sm placeholder-gray-500 outline-none transition shadow-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#facc15] text-black font-extrabold tracking-wide py-2.5 rounded-xl shadow hover:bg-[#eab308] transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
