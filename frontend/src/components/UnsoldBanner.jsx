import React from "react";

export default function UnsoldBanner({ name }) {
  return (
    <div className="bg-red-950/90 text-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-red-500/60 animate-fade-in text-center">
      <h2 className="text-2xl font-black mb-3 tracking-wide text-red-400">Player Unsold</h2>
      <p className="text-xl font-bold mb-2">
        <span className="text-white">{name}</span>
      </p>
      <p className="mt-2 text-xs uppercase tracking-wider text-red-200/80 font-semibold">
        Next player will appear shortly...
      </p>
    </div>
  );
}
