import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { formatAcademicYear } from "../utils/formatters";

const TeamDetailView = ({ team, teamPlayers = [] }) => {
  const formatPts = (val) => (val || val === 0 ? `${val} Pts` : "-");

  const categoryBreakdown = useMemo(() => {
    return teamPlayers.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});
  }, [teamPlayers]);

  const highestBid = useMemo(() => {
    return teamPlayers.reduce(
      (max, p) =>
        !p.isCaptain && p.finalBidPrice > max ? p.finalBidPrice : max,
      0
    );
  }, [teamPlayers]);

  if (!team) return null;

  return (
    <div>
      <h2 className="text-2xl sm:text-3xl font-black text-white mb-6 tracking-wide">
        {team.name}
      </h2>
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="bg-[#374151] border border-gray-700/60 rounded-2xl p-5 shadow-md">
          <h5 className="text-xs tracking-wider uppercase text-gray-400 font-bold mb-1">
            Players Bought
          </h5>
          <p className="text-3xl font-black text-white">{teamPlayers.length}</p>
        </div>
        <div className="bg-[#374151] border border-gray-700/60 rounded-2xl p-5 shadow-md">
          <h5 className="text-xs tracking-wider uppercase text-gray-400 font-bold mb-1">
            Remaining Budget
          </h5>
          <p className="text-3xl font-black text-[#34d399]">
            {formatPts(team.budget)}
          </p>
        </div>
        <div className="bg-[#374151] border border-gray-700/60 rounded-2xl p-5 shadow-md">
          <h5 className="text-xs tracking-wider uppercase text-gray-400 font-bold mb-1">
            Highest Bid
          </h5>
          <p className="text-3xl font-black text-white">
            {formatPts(highestBid)}
          </p>
        </div>
      </div>
      <div className="bg-[#374151]/70 border border-gray-700/60 rounded-2xl p-5 mb-10">
        <h5 className="text-xs tracking-wider uppercase text-gray-400 font-bold mb-3">
          Category Breakdown
        </h5>
        {Object.keys(categoryBreakdown).length === 0 && (
          <p className="text-sm text-gray-400">No players found.</p>
        )}
        <ul className="flex flex-wrap gap-3 text-sm">
          {Object.entries(categoryBreakdown).map(([cat, count]) => (
            <li
              key={cat}
              className="px-3.5 py-1.5 rounded-full bg-gray-900 border border-gray-700 text-white flex items-center gap-2"
            >
              <span className="text-[#34d399] font-black text-sm">{count}</span>
              <span className="uppercase tracking-wide text-xs text-gray-300 font-bold">
                {cat}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <h3 className="text-xl font-bold text-white mb-4 tracking-wide">
        Players ({teamPlayers.length})
      </h3>
      {/* Single column on mobile for full-width rows */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teamPlayers.map((player) => {
          const isCaptain = player.isCaptain;
          return (
            <div
              key={player._id}
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
                className="w-16 h-24 rounded-xl overflow-hidden bg-gray-900 flex-shrink-0 ring-1 ring-gray-700 focus:outline-none focus:ring-2 focus:ring-[#60a5fa]"
              >
                <img
                  src={player.image}
                  alt={player.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <h4 className="text-base sm:text-lg font-bold truncate tracking-wide">
                  <Link
                    to={`/player/${player._id}`}
                    className="text-[#60a5fa] hover:text-[#93c5fd] focus:outline-none rounded-sm"
                  >
                    {player.name}
                  </Link>
                </h4>
                <div className="text-xs sm:text-sm text-gray-300 mt-1 flex flex-wrap gap-2 leading-relaxed">
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
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
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
                    <span className="text-lg sm:text-xl font-black text-[#34d399] tracking-wide">
                      {formatPts(player.finalBidPrice)}
                    </span>
                    <span className="mt-0.5 text-[10px] sm:text-[11px] uppercase text-[#10b981] font-extrabold tracking-wider">
                      BID
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

export default TeamDetailView;
