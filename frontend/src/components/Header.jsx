// src/components/Header.jsx

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContextCore";

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const isOnAdmin = location.pathname.startsWith("/admin");
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const firstName = user?.name ? user.name.split(" ")[0] : "User";
  return (
    <header className="bg-[#1d4ed8] p-3 sm:p-4 flex items-center justify-between shadow-md sm:sticky sm:top-0 z-50">
      {/* Title */}
      <h1 className="font-brand text-white text-xl xs:text-2xl sm:text-3xl font-black tracking-wide select-none leading-tight mr-4 cursor-pointer" onClick={() => navigate("/")}>
        🏏 DGPL <span className="text-[#facc15]">AUCTION</span>
      </h1>
      {/* Right side */}
      {isAuthenticated ? (
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
          {/* Desktop welcome line */}
          <span className="hidden sm:inline text-sm font-medium text-white truncate max-w-[280px]">
            Welcome,{" "}
            <span className="text-[#facc15] font-bold text-base">
              {user?.name || "User"}
            </span>
          </span>
          {user?.role === "admin" && (
            <button
              onClick={() => navigate(isOnAdmin ? "/" : "/admin")}
              className="bg-black text-white font-bold py-2 px-4 rounded-xl shadow hover:bg-gray-900 transition text-xs sm:text-sm"
              type="button"
            >
              {isOnAdmin ? "Auction" : "Admin Panel"}
            </button>
          )}
          <div className="flex flex-col items-center sm:items-end">
            <button
              onClick={handleLogout}
              className="bg-black text-white font-bold py-2 px-4 rounded-xl shadow hover:bg-gray-900 transition text-xs sm:text-sm"
            >
              Logout
            </button>
            {/* Mobile name under logout */}
            <span className="sm:hidden mt-1 text-xs font-bold text-[#facc15] leading-tight tracking-wide text-center">
              {firstName}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex justify-end w-auto">
          <button
            onClick={() => navigate("/login")}
            className="bg-black text-white font-bold py-2 px-4 rounded-xl shadow hover:bg-gray-900 transition text-xs sm:text-sm"
          >
            Login
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;
