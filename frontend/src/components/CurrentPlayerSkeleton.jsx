import React from "react";

const CurrentPlayerSkeleton = () => {
  return (
    <div className="bg-[#1e293b] rounded-2xl shadow-xl overflow-hidden max-w-md w-full border border-[#334155] animate-pulse">
      <div className="aspect-[3/4] w-full bg-[#0f172a]" />
      <div className="p-6 space-y-5">
        <div className="h-4 w-40 bg-[#334155] rounded-md" />
        <div className="h-8 w-56 bg-[#334155] rounded-md" />
        <div className="bg-[#0f172a]/60 rounded-xl p-5 border border-[#334155] space-y-4">
          <div className="h-3 w-24 bg-[#334155] rounded" />
          <div className="flex items-end gap-4">
            <div className="h-10 w-32 bg-[#334155] rounded-md" />
            <div className="space-y-2">
              <div className="h-3 w-20 bg-[#334155] rounded" />
              <div className="h-4 w-28 bg-[#334155] rounded" />
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-3 w-28 bg-[#334155] rounded" />
          <ul className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="h-8 w-full bg-[#334155]/60 rounded-lg" />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CurrentPlayerSkeleton;
