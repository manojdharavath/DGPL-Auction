import React from "react";

export default function SoldBanner({ name, teamName, amount }) {
  return (
    <div className="bg-emerald-950/90 text-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-emerald-500/60 animate-fade-in text-center">
      <h2 className="text-2xl font-black mb-3 tracking-wide text-emerald-400">Player Sold</h2>
      <p className="text-xl font-bold mb-1">
        <span className="text-white">{name}</span>
      </p>
      <p className="text-sm text-emerald-100/90 mb-4 font-medium">
        Sold to{" "}
        <span className="font-bold text-white">{teamName || "—"}</span>
      </p>
      <div className="text-4xl font-black text-emerald-400">
        {amount != null ? `${amount} Pts` : "--"}
      </div>
      <p className="mt-4 text-xs uppercase tracking-wider text-emerald-200/80 font-semibold">
        Next player will appear shortly...
      </p>
    </div>
  );
}
