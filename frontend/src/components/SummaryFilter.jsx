import React from "react";

const SummaryFilter = ({ teams = [], selectedTeamId, onChange }) => {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-xs w-full">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
          Team Filter
        </label>
        <div className="relative">
          <select
            value={
              selectedTeamId && selectedTeamId !== "available"
                ? selectedTeamId
                : ""
            }
            onChange={(e) => onChange(e.target.value || null)}
            className="w-full appearance-none bg-[#4b5563] text-white text-sm font-medium rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#facc15] transition-colors pr-10 shadow-sm"
          >
            <option value="" className="bg-[#374151] text-white">Select Team</option>
            {teams.map((team) => (
              <option key={team._id} value={team._id} className="bg-[#374151] text-white">
                {team.name}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-300">
            ▼
          </span>
        </div>
      </div>
      <div className="flex gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => onChange(null)}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all ${
            selectedTeamId === null
              ? "bg-[#facc15] text-black font-extrabold shadow-md"
              : "bg-black text-white hover:bg-gray-900"
          }`}
        >
          Recently Sold
        </button>
        <button
          type="button"
          onClick={() => onChange("available")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold tracking-wide transition-all ${
            selectedTeamId === "available"
              ? "bg-[#facc15] text-black font-extrabold shadow-md"
              : "bg-black text-white hover:bg-gray-900"
          }`}
        >
          Available Players
        </button>
      </div>
    </div>
  );
};

export default SummaryFilter;
