import React from "react";

export default function Toast({ message, type = "info" }) {
  const base =
    "px-5 py-3 rounded-xl shadow-xl border text-sm font-bold flex items-center gap-3";
  let style = "bg-[#1e293b] text-white border-[#334155]";
  if (type === "error") style = "bg-red-950 text-white border-red-500/60";
  if (type === "success") style = "bg-emerald-950 text-white border-emerald-500/60";
  if (type === "warn") style = "bg-[#1e293b] text-white border-[#2563eb]";
  return (
    <div className={`${base} ${style} animate-fade-in-down`}>{message}</div>
  );
}
