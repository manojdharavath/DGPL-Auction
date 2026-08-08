import React from "react";
import { Link } from "react-router-dom";
import { formatAcademicYear } from "../utils/formatters";

const AvailablePlayersView = ({ availablePlayers = [] }) => {
  const formatPts = (val) => (val || val === 0 ? `${val} Pts` : "-");
  const sorted = availablePlayers
    .slice()
    .sort(
      (a, b) => (b.year || 0) - (a.year || 0) || a.name.localeCompare(b.name)
    );
  return (
    <div>
      {sorted.length === 0 && (
        <p className="text-sm text-gray-400 mb-2">No available players.</p>
      )}
      {/* Use explicit single column on mobile so cards stretch full width instead of shrinking to content */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((player) => {
          const isCaptain = !!player.isCaptain;
          return (
            <div
              key={player._id || player.name}
              className={`relative w-full flex items-center gap-4 sm:gap-5 bg-[#374151] border rounded-2xl p-4 transition-all duration-200 shadow-md ${
                isCaptain
                  ? "border-[#facc15] ring-1 ring-[#facc15]"
                  : "border-gray-700/60 hover:border-gray-500"
              }`}
            >
              {isCaptain && (
                <span className="absolute -top-3 -left-3 bg-[#facc15] text-black border border-black text-xs font-black px-2.5 py-0.5 rounded-full shadow-md">
                  C
                </span>
              )}
              <Link
                to={`/player/${player._id}`}
                className="w-14 h-20 sm:w-16 sm:h-24 rounded-xl overflow-hidden bg-gray-900 flex-shrink-0 ring-1 ring-gray-700 focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
              >
                <img
                  src={player.image}
                  alt={player.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm sm:text-base md:text-lg font-bold truncate tracking-wide">
                  <Link
                    to={`/player/${player._id}`}
                    className="text-[#60a5fa] hover:text-[#93c5fd] focus:outline-none rounded-sm"
                    title={player.name}
                  >
                    {player.name}
                  </Link>
                </h4>
                <div className="text-[11px] sm:text-xs md:text-sm text-gray-300 mt-1 flex flex-wrap gap-2 leading-relaxed">
                  <span className="text-white font-bold uppercase tracking-wider text-[11px] px-2 py-0.5 rounded bg-gray-800 border border-gray-700">
                    {player.category}
                  </span>
                  {player.year && (
                    <>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-300 font-medium">
                        {formatAcademicYear(player.year)}
                      </span>
                    </>
                  )}
                  {isCaptain && (
                    <>
                      <span className="text-gray-500">•</span>
                      <span className="text-[#facc15] font-bold">
                        Captain
                      </span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right flex flex-col items-end flex-shrink-0">
                {isCaptain ? (
                  <>
                    <span className="text-xs sm:text-sm font-bold text-[#facc15] tracking-wide">
                      Captain
                    </span>
                    <span className="mt-0.5 text-[10px] sm:text-[11px] uppercase text-gray-400 font-semibold tracking-wider">
                      Retained
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-base sm:text-lg md:text-xl font-black text-[#34d399] tracking-wide whitespace-nowrap">
                      {formatPts(player.basePrice)}
                    </span>
                    <span className="mt-0.5 text-[9px] sm:text-[10px] md:text-[11px] uppercase text-[#10b981] font-extrabold tracking-wider">
                      BASE
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AvailablePlayersView;
