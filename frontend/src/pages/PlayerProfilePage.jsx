import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { formatAcademicYear } from "../utils/formatters";
import { API_URL } from "../config";

const PlayerProfilePage = () => {
  const { playerId } = useParams();
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;
    const fetchPlayer = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${API_URL}/api/v1/players/${playerId}`
        );
        if (!res.ok) throw new Error("Failed to load player");
        const data = await res.json();
        const raw =
          data?.data?.doc || data?.data?.player || data?.player || data;
        if (!ignore) setPlayer(raw);
      } catch (e) {
        if (!ignore) setError(e.message || "Error loading player");
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    if (playerId) fetchPlayer();
    return () => {
      ignore = true;
    };
  }, [playerId]);

  const sortedBids = useMemo(() => {
    if (!player?.bidHistory) return [];
    return [...player.bidHistory]
      .map((b) => ({
        ...b,
        teamId: b.team?._id || b.team?.id || b.team,
        teamName: b.team?.name || b.teamName || "Unknown Team",
        timestamp: b.timestamp || b.createdAt,
      }))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [player]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#061838] flex items-center justify-center px-4">
        <div className="text-[#90CAF9] text-sm font-semibold animate-pulse">
          Loading player...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#061838] flex flex-col items-center justify-center px-4 gap-4">
        <p className="text-red-400 text-sm font-semibold">{error}</p>
        <Link
          to="/"
          className="text-xs font-bold text-[#90CAF9] hover:text-[#E3F2FD] underline"
        >
          Back to Auction
        </Link>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-[#061838] flex flex-col items-center justify-center px-4 gap-4">
        <p className="text-[#90CAF9] text-sm font-semibold">Player not found.</p>
        <Link
          to="/"
          className="text-xs font-bold text-[#90CAF9] hover:text-[#E3F2FD] underline"
        >
          Back to Auction
        </Link>
      </div>
    );
  }

  const { name, image, category, year, status, finalBidPrice, isCaptain } =
    player;
  // Resolve leading / winner team name with fallbacks to last bid entry
  let leadingTeamName = player.team?.name || player.teamName || "";
  if (!leadingTeamName && sortedBids.length > 0) {
    leadingTeamName = sortedBids[0].teamName || leadingTeamName;
  }
  // If populated team objects exist in bidHistory (after backend populate) but we still lack teamName strings, patch them
  if (player.bidHistory && player.bidHistory.length) {
    let patched = false;
    player.bidHistory.forEach((b) => {
      if (!b.teamName && b.team && typeof b.team === "object" && b.team.name) {
        b.teamName = b.team.name; // mutate local state object (safe for render)
        patched = true;
      }
    });
    if (patched && import.meta.env?.DEV) {
      console.log(
        "[PlayerProfile] Patched bidHistory with missing teamName values"
      );
    }
  }
  const wasSold = status === "sold" && typeof finalBidPrice === "number";
  const isRetained = !!isCaptain; // treat every captain as retained regardless of status field

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-white bg-black px-3.5 py-1.5 rounded-xl shadow-sm border border-gray-700 hover:bg-gray-900 transition-all"
          >
            <span className="text-base leading-none">←</span>
            <span>Back</span>
          </Link>
          {wasSold && !isRetained && (
            <div className="text-xs font-bold text-gray-300 bg-[#1f2937] rounded-full px-4 py-1 border border-gray-700 flex items-baseline gap-1.5 shadow-sm">
              <span>Sold for</span>
              <span className="font-black text-[#34d399] text-sm">
                {finalBidPrice}
              </span>
              <span className="text-[10px] font-bold tracking-wide text-[#10b981]">
                Pts
              </span>
            </div>
          )}
          {isRetained && (
            <div className="text-xs font-bold text-[#facc15] bg-[#1f2937] rounded-full px-4 py-1 border border-gray-700 flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#facc15] animate-pulse" />
              <span>Retained Captain</span>
            </div>
          )}
        </div>

        <div className="bg-[#1f2937] rounded-2xl shadow-xl overflow-hidden border border-gray-700/60 flex flex-col md:flex-row">
          {image && (
            <div className="md:w-1/3 w-full bg-gray-900 aspect-[3/4] md:aspect-auto overflow-hidden max-h-80 md:max-h-none md:self-start border-b md:border-b-0 md:border-r border-gray-700/60">
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </div>
          )}
          <div className="flex-1 p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-black leading-tight text-[#60a5fa] mb-2">
                  {name}
                </h1>
                <div className="flex items-center gap-3 text-sm font-semibold tracking-wide text-gray-300">
                  <span className="uppercase px-2.5 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-white text-xs font-bold">
                    {category}
                  </span>
                  {year && <span className="text-gray-500">•</span>}
                  {year && (
                    <span className="text-gray-300 text-xs">
                      {formatAcademicYear(year)}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {!isRetained && (
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
                      status === "in_auction"
                        ? "border-[#facc15] text-[#facc15] bg-[#facc15]/10"
                        : status === "sold"
                        ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
                        : "border-gray-700 text-gray-400 bg-gray-900"
                    }`}
                  >
                    {status?.replace(/_/g, " ")}
                  </span>
                )}
                {wasSold && (
                  <div className="text-sm font-bold text-gray-300">
                    Winner: <span className="text-white font-bold">{leadingTeamName || "Unknown Team"}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-[#111827] rounded-xl p-5 border border-gray-700/60">
              <h3 className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-3">
                Bid History
              </h3>
              {sortedBids.length === 0 ? (
                <p className="text-gray-400 text-sm italic">No bids placed.</p>
              ) : (
                <ul className="space-y-2 max-h-80 overflow-y-auto pr-1 custom-scroll">
                  {sortedBids.map((bid, index) => {
                    const isLatest = index === 0;
                    return (
                      <li
                        key={bid._id || bid.timestamp}
                        className={`flex items-center justify-between rounded-xl px-3.5 py-2 text-sm font-medium transition-colors border ${
                          isLatest
                            ? "bg-gray-800 border-gray-600 text-white"
                            : "bg-[#111827] border-gray-800 text-gray-300 hover:bg-gray-800"
                        }`}
                      >
                        <span className="text-white flex items-center gap-2 font-semibold">
                          {isLatest && (
                            <span className="inline-block w-2 h-2 bg-[#34d399] rounded-full animate-pulse shadow-sm" />
                          )}
                          {bid.teamName}
                        </span>
                        <span className="text-[#34d399] font-bold flex items-baseline gap-1">
                          <span>{bid.bidAmount}</span>
                          <span className="text-[10px] font-bold tracking-wide opacity-80">
                            Pts
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfilePage;
