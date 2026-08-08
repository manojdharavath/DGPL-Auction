import React, { useState } from "react";

// PlayerTable dumb component
export default function PlayerTable({
  players = [],
  onStartAuction,
  onSellPlayer,
  onMarkUnsold,
  actionLoadingId,
}) {
  const [confirmId, setConfirmId] = useState(null);
  const [confirmUnsoldId, setConfirmUnsoldId] = useState(null);
  if (!players.length) return null;
  const display = players
    .filter((p) => p.status !== "sold")
    .sort((a, b) => a.name.localeCompare(b.name));
  if (!display.length) return null;
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-700/60 bg-[#374151] shadow-xl">
      <table className="min-w-full divide-y divide-gray-700/60">
        <thead className="bg-gray-900 border-b border-gray-700">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
              Category
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
              Base Price
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
              Current Bid
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
              Leading Team
            </th>
            <th className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/40">
          {display.map((p) => {
            const isLive = p.status === "in_auction";
            const hasBids = p.bidHistory && p.bidHistory.length > 0;
            const disabled = actionLoadingId === p._id;
            const isConfirming = confirmId === p._id;
            const isConfirmingUnsold = confirmUnsoldId === p._id;
            const currentBid =
              isLive && hasBids
                ? `${p.bidHistory[p.bidHistory.length - 1].bidAmount} Pts`
                : isLive
                ? `${p.basePrice} Pts`
                : "—";
            const latestBid = hasBids
              ? p.bidHistory[p.bidHistory.length - 1]
              : null;
            const leadingTeamName = isLive
              ? latestBid?.teamName ||
                (latestBid?.team && latestBid.team.name) ||
                p.teamName ||
                (p.team && p.team.name) ||
                "—"
              : "—";
            return (
              <tr
                key={p._id}
                className={
                  "transition-colors hover:bg-gray-800/50 " +
                  (isLive ? "bg-[#facc15]/10 border-l-4 border-l-[#facc15]" : "")
                }
              >
                <td className="px-4 py-3 text-sm font-bold text-[#60a5fa]">
                  {p.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">
                  <span className="uppercase text-xs font-bold px-2 py-0.5 rounded bg-gray-900 border border-gray-700 text-white">
                    {p.category || "-"}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-300 font-medium">
                  {p.basePrice != null ? `${p.basePrice} Pts` : "—"}
                </td>
                <td className="px-4 py-3 text-sm text-[#34d399] font-black">
                  {currentBid}
                </td>
                <td className="px-4 py-3 text-sm text-white font-semibold">
                  {leadingTeamName}
                </td>
                <td className="px-4 py-3 text-sm">
                  {isLive ? (
                    <span className="inline-flex items-center gap-1 text-black bg-[#facc15] border border-[#facc15] px-2.5 py-0.5 rounded-full text-xs font-black shadow-sm animate-pulse">
                      Live
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs font-semibold">Unsold</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  {!isLive && (
                    <button
                      onClick={() => onStartAuction && onStartAuction(p._id)}
                      disabled={disabled || isLive}
                      className={`inline-flex items-center gap-1 rounded-xl px-3.5 py-1.5 text-xs font-extrabold transition-all focus:outline-none ${
                        disabled
                          ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                          : "bg-[#facc15] text-black hover:bg-[#eab308] shadow"
                      }`}
                      type="button"
                    >
                      {disabled ? "Starting..." : "Start Auction"}
                    </button>
                  )}
                  {isLive && hasBids && (
                    <button
                      onClick={() => {
                        if (isConfirming) {
                          onSellPlayer && onSellPlayer(p._id);
                          setConfirmId(null);
                        } else {
                          setConfirmId(p._id);
                        }
                      }}
                      disabled={disabled}
                      className={`inline-flex items-center gap-1 rounded-xl px-3.5 py-1.5 text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all ${
                        disabled
                          ? "bg-emerald-950 text-gray-500 cursor-not-allowed"
                          : isConfirming
                          ? "bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-700 shadow"
                          : "bg-emerald-700 text-white border-emerald-600 hover:bg-emerald-600 shadow"
                      }`}
                      type="button"
                    >
                      {disabled
                        ? "Saving..."
                        : isConfirming
                        ? "Confirm"
                        : "Sell"}
                    </button>
                  )}
                  {isLive && !hasBids && (
                    <button
                      onClick={() => {
                        if (isConfirmingUnsold) {
                          onMarkUnsold && onMarkUnsold(p._id);
                          setConfirmUnsoldId(null);
                        } else {
                          setConfirmUnsoldId(p._id);
                        }
                      }}
                      disabled={disabled}
                      className={`inline-flex items-center gap-1 rounded-xl px-3.5 py-1.5 text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-red-400 transition-all ${
                        disabled
                          ? "bg-red-950 text-gray-500 cursor-not-allowed"
                          : isConfirmingUnsold
                          ? "bg-red-600 text-white border-red-500 hover:bg-red-700 shadow"
                          : "bg-red-700 text-white border-red-600 hover:bg-red-600 shadow"
                      }`}
                      type="button"
                    >
                      {disabled
                        ? "Updating..."
                        : isConfirmingUnsold
                        ? "Confirm"
                        : "Unsold"}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
