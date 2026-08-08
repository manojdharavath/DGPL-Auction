import React from "react";

const baseBtn =
  "relative px-5 py-2.5 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 focus:outline-none disabled:opacity-50";

const NavTabs = ({ activeTab = "live", onChange }) => {
  const isActive = (tab) => activeTab === tab;
  return (
    <div className="w-full flex justify-center pt-6 pb-4 px-4">
      <div
        className="inline-flex bg-black shadow-lg rounded-xl p-1 gap-1"
        role="tablist"
        aria-label="Auction navigation"
      >
        <button
          role="tab"
          aria-selected={isActive("live")}
          aria-pressed={isActive("live")}
          tabIndex={isActive("live") ? 0 : -1}
          onClick={() => onChange && onChange("live")}
          className={`${baseBtn} ${
            isActive("live")
              ? "bg-[#facc15] text-black font-extrabold shadow-md"
              : "bg-black text-white hover:bg-gray-900"
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-base">🏏</span>
            <span className="tracking-wide">Live Auction</span>
          </span>
        </button>
        <button
          role="tab"
          aria-selected={isActive("summary")}
          aria-pressed={isActive("summary")}
          tabIndex={isActive("summary") ? 0 : -1}
          onClick={() => onChange && onChange("summary")}
          className={`${baseBtn} ${
            isActive("summary")
              ? "bg-[#facc15] text-black font-extrabold shadow-md"
              : "bg-black text-white hover:bg-gray-900"
          }`}
        >
          <span className="flex items-center gap-2">
            <span className="text-base">📊</span>
            <span className="tracking-wide">Auction Summary</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default NavTabs;
