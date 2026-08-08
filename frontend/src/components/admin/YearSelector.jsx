import React from "react";

// YearSelector dumb component
export default function YearSelector({
  yearOptions = [],
  selectedYear,
  onSelectYear,
}) {
  return (
    <div className="w-full flex flex-wrap gap-2 mb-8">
      <div className="inline-flex bg-black shadow-lg rounded-xl p-1 gap-1">
        {yearOptions.map((opt) => {
          const active = selectedYear === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onSelectYear && onSelectYear(opt.value)}
              className={`px-5 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all duration-200 focus:outline-none ${
                active
                  ? "bg-[#facc15] text-black font-extrabold shadow-md"
                  : "bg-black text-white hover:bg-gray-900"
              }`}
              type="button"
            >
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
