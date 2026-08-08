import React, { useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/authContextCore";
import { useSocket } from "../context/useSocket";
import { formatAcademicYear } from "../utils/formatters";
import CurrentPlayerSkeleton from "./CurrentPlayerSkeleton";

// Local helper component to log server bid errors
const BidErrorListener = ({ socket }) => {
  React.useEffect(() => {
    const handler = (payload) => {
      console.warn("[Bid][Client] server:bid_error", payload);
    };
    socket.on("server:bid_error", handler);
    return () => socket.off("server:bid_error", handler);
  }, [socket]);
  return null;
};

/**
 * CurrentPlayer component
 * Displays details of the player currently in auction.
 * Fetches next unsold player dynamically from backend.
 */
const CurrentPlayer = ({ player: livePlayer, teams = [] }) => {
  useEffect(() => {
    if (livePlayer) {
      console.log(
        "[CurrentPlayer] Received livePlayer prop id:",
        livePlayer._id,
        "name:",
        livePlayer.name
      );
    } else {
      console.log("[CurrentPlayer] No livePlayer prop provided");
    }
  }, [livePlayer]);
  const { isAuthenticated, user } = useAuth();
  const { socket } = useSocket() || {};
  // Fallback fetching disabled for debugging real-time path
  const [fetchedPlayer] = useState(null);
  const [loading, setLoading] = useState(!livePlayer);
  const [error] = useState(null);

  // If a live player (in_auction) is supplied via props, prefer it.
  const player = livePlayer || fetchedPlayer;

  // Fallback fetch ONLY when no live player is supplied (legacy behavior)
  // TEMP: Disable fallback loading to isolate real-time update issue
  useEffect(() => {
    if (livePlayer) setLoading(false);
    else setLoading(false);
  }, [livePlayer]);

  const sortedBids = useMemo(() => {
    if (!player?.bidHistory) return [];
    return [...player.bidHistory].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  }, [player]);

  if (loading) return <CurrentPlayerSkeleton />; // still show skeleton during initial mount
  if (error)
    return (
      <div className="bg-[#1e293b] text-white rounded-2xl shadow-xl p-8 border border-red-500/40">
        <p className="text-center text-red-400 font-semibold">{error}</p>
      </div>
    );
  if (!player)
    return (
      <div className="bg-[#1e293b] text-white rounded-2xl shadow-xl p-8 border border-[#334155]">
        <p className="text-center font-semibold text-[#94a3b8] animate-pulse">Waiting for the next player...</p>
      </div>
    );

  const { name, image, category, year } = player;
  const currentBidRaw = player.finalBidPrice ?? player.basePrice ?? null;
  const currentBid = currentBidRaw != null ? Number(currentBidRaw) : null;
  const leadingTeamName = player.teamName || "";
  // Helper: compute next bid using backend tiered rules
  const computeNextBidAmount = (amount) => {
    if (amount == null) return null;
    const n = Number(amount);
    if (Number.isNaN(n)) return null;
    let inc;
    if (n < 5) inc = 0.25;
    else if (n < 10) inc = 0.5;
    else inc = 1;
    return Number((n + inc).toFixed(2));
  };
  const hasBids = sortedBids.length > 0;
  let nextBidNumeric = null;
  if (!hasBids) {
    // First bid equals the base price
    nextBidNumeric =
      typeof player.basePrice === "number"
        ? Number(player.basePrice)
        : player.basePrice != null
        ? Number(player.basePrice)
        : null;
  } else {
    const basisAmount = Number(sortedBids[0]?.bidAmount ?? currentBid);
    nextBidNumeric =
      basisAmount != null && !Number.isNaN(basisAmount)
        ? computeNextBidAmount(basisAmount)
        : null;
  }
  const nextBidAmount =
    nextBidNumeric != null
      ? nextBidNumeric.toFixed(2).replace(/\.00$/, "")
      : null;

  // Accept legacy or alternate role naming: 'team-owner' or 'captain'
  const isTeamOwner =
    isAuthenticated &&
    (user?.role === "team-owner" || user?.role === "captain");

  const handleBid = () => {
    if (!socket || !player?._id) {
      console.log("[Bid][Client] Cannot emit: socket or player missing", {
        hasSocket: !!socket,
        playerId: player?._id,
      });
      return;
    }
    console.log(
      "[Bid][Client] Emitting captain:place_bid for player",
      player._id
    );
    try {
      socket.emit("captain:place_bid", { playerId: player._id });
    } catch (e) {
      // swallow emit errors (could add toast later)
      console.error("Bid emit failed", e);
    }
  };

  // Determine if this user is the current leading bidder (so they cannot bid again immediately)
  const latestBid = sortedBids[0];
  const userTeamId = user?.team?._id || user?.team; // support either populated object or raw id
  const leadingBidTeamId =
    latestBid?.team?._id ||
    latestBid?.team ||
    player?.team?._id ||
    player?.team;
  const isLeadingTeam = Boolean(
    userTeamId && leadingBidTeamId && userTeamId === leadingBidTeamId
  );

  // Resolve full team object from passed teams prop for accurate live budget
  const fullUserTeam = teams.find(
    (t) => (t._id || t.id) === (userTeamId || "")
  );
  const userTeamBudget = fullUserTeam?.budget ?? user?.team?.budget ?? null;
  const isOutOfBudget =
    isTeamOwner &&
    nextBidNumeric != null &&
    typeof userTeamBudget === "number" &&
    userTeamBudget < nextBidNumeric;
  if (isOutOfBudget && import.meta.env?.DEV) {
    console.log(
      "[CurrentPlayer] Out of budget: teamBudget=%s nextBid=%s",
      userTeamBudget,
      nextBidNumeric
    );
  }

  return (
    <div className="bg-[#1f2937] rounded-2xl shadow-xl overflow-hidden max-w-md w-full border border-gray-700/60">
      {/* Bid error listener registration */}
      {socket && <BidErrorListener socket={socket} />}
      {/* Player Image */}
      {image && (
        <div className="aspect-[3/4] w-full overflow-hidden bg-gray-900 border-b border-gray-700/60">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-6 space-y-5">
        {/* Meta */}
        <div className="text-sm font-semibold tracking-wider text-gray-300 flex items-center gap-2">
          <span className="uppercase px-2.5 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-white text-xs font-bold">
            {category}
          </span>
          {year && <span className="text-gray-500">•</span>}
          {year && (
            <span className="text-gray-300 text-xs font-medium">
              {formatAcademicYear(year)}
            </span>
          )}
        </div>

        {/* Name */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
          {name}
        </h2>

        {/* Current Bid Section */}
        <div className="bg-[#111827] rounded-xl p-4 sm:p-5 border border-gray-700/60">
          <h3 className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">
            Current Bid
          </h3>
          <div className="flex items-end gap-4 flex-wrap">
            <span className="flex items-baseline gap-1 text-white">
              <span className="text-3xl sm:text-4xl font-black leading-none text-[#34d399]">
                {currentBid != null ? currentBid : "--"}
              </span>
              {currentBid != null && (
                <span className="text-lg font-bold tracking-wide text-[#10b981]">
                  Pts
                </span>
              )}
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-gray-400 uppercase">
                Leading Team
              </span>
              <span className="text-base font-bold text-white">
                {leadingTeamName || "—"}
              </span>
            </div>
            {isTeamOwner && (
              <div className="flex flex-col ml-auto text-right">
                <span className="text-xs font-semibold text-gray-400 uppercase">
                  Your Budget
                </span>
                <span
                  className={`text-sm font-bold ${
                    isOutOfBudget ? "text-red-400" : "text-[#34d399]"
                  }`}
                >
                  {typeof userTeamBudget === "number"
                    ? `${userTeamBudget.toFixed(2).replace(/\.00$/, "")} Pts`
                    : "—"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bid History */}
        <div>
          <h3 className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-2.5">
            Bid History
          </h3>
          {sortedBids.length === 0 && (
            <p className="text-gray-400 text-sm italic">No bids yet.</p>
          )}
          <ul className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scroll">
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
                    {bid.teamName || "Unknown Team"}
                  </span>
                  <span className="text-[#34d399] font-bold flex items-baseline gap-1">
                    <span>{bid.bidAmount}</span>
                    <span className="text-xs font-bold tracking-wide opacity-80">
                      Pts
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {isTeamOwner && (
          <div className="pt-2">
            <div className="relative">
              {isOutOfBudget && (
                <div className="absolute -top-5 left-0 w-full text-center text-xs font-semibold text-red-400">
                  Out of budget
                </div>
              )}
              <button
                onClick={
                  !isLeadingTeam && !isOutOfBudget ? handleBid : undefined
                }
                disabled={isLeadingTeam || isOutOfBudget}
                className={`relative w-full py-3 px-5 rounded-xl font-extrabold text-base sm:text-lg flex items-center justify-center gap-3 transition-all duration-200 focus:outline-none shadow active:scale-[0.98]
                ${
                  isLeadingTeam
                    ? "bg-gray-800 text-gray-400 cursor-not-allowed border border-gray-700"
                    : isOutOfBudget
                    ? "bg-gray-900 text-gray-500 cursor-not-allowed border border-gray-800"
                    : "bg-[#facc15] text-black hover:bg-[#eab308] shadow-md"
                }`}
                type="button"
              >
                <span className="tracking-wide">
                  {isLeadingTeam
                    ? "Leading"
                    : isOutOfBudget
                    ? "Insufficient Funds"
                    : "Bid"}
                </span>
                {!isLeadingTeam && nextBidAmount && (
                  <span
                    className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm font-extrabold shadow-sm ${
                      isOutOfBudget
                        ? "bg-gray-800 text-gray-500"
                        : "bg-black text-white"
                    }`}
                  >
                    <span>{nextBidAmount}</span>
                    <span className="text-xs font-bold text-gray-300">Pts</span>
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentPlayer;
