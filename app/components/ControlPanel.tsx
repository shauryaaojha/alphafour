"use client";

interface ControlPanelProps {
  depth: number;
  setDepth: (d: number) => void;
  prunedHidden: boolean;
  setPrunedHidden: (h: boolean) => void;
  treeDepth: number;
  setTreeDepth: (d: number) => void;
}

/**
 * Algorithm control panel with depth slider, toggles, and legend.
 * Integrated into the sidebar for the monochrome brutalist layout.
 */
export default function ControlPanel({
  depth, setDepth,
  prunedHidden, setPrunedHidden,
  treeDepth, setTreeDepth
}: ControlPanelProps) {
  const getDifficultyLabel = (d: number) => {
    if (d <= 2) return 'EASY';
    if (d <= 5) return 'MEDIUM';
    return 'HARD';
  };

  return (
    <div className="space-y-6">
      {/* Search Depth */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="font-headline text-[10px] font-bold text-[#919191] uppercase tracking-[0.1em]">
            Search Depth
          </label>
          <div className="flex items-center gap-2">
            <span className="font-mono text-white text-xs">{depth}</span>
            <span className="text-[7px] font-mono text-[#474747] uppercase">{getDifficultyLabel(depth)}</span>
          </div>
        </div>
        <input
          className="w-full"
          max="8" min="1" type="range" step="1"
          value={depth}
          onChange={(e) => setDepth(Number(e.target.value))}
        />
        <div className="flex justify-between text-[7px] text-[#262626] font-mono uppercase">
          <span>1</span><span>4</span><span>8</span>
        </div>
      </div>

      {/* Tree View Depth */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <label className="font-headline text-[10px] font-bold text-[#919191] uppercase tracking-[0.1em]">
            Tree View Depth
          </label>
          <span className="font-mono text-white text-xs">{treeDepth}</span>
        </div>
        <input
          className="w-full"
          max="5" min="2" type="range" step="1"
          value={treeDepth}
          onChange={(e) => setTreeDepth(Number(e.target.value))}
        />
      </div>

      {/* Toggle: Hide Pruned */}
      <div className="flex items-center justify-between pt-4 border-t border-[#1C1B1B]">
        <div>
          <span className="text-[10px] font-bold text-[#C6C6C6] uppercase tracking-wide block">
            Hide Pruned
          </span>
          <span className="text-[8px] text-[#474747] uppercase tracking-wider">
            Show only explored nodes
          </span>
        </div>
        <button
          onClick={() => setPrunedHidden(!prunedHidden)}
          className={`w-10 h-5 border transition-all relative ${
            prunedHidden
              ? 'bg-white border-white'
              : 'bg-[#050505] border-[#474747]'
          }`}
        >
          <span className={`absolute top-[3px] w-3 h-3 transition-all ${
            prunedHidden
              ? 'left-[22px] bg-black'
              : 'left-[3px] bg-white'
          }`} />
        </button>
      </div>

      {/* Legend */}
      <div className="pt-4 border-t border-[#1C1B1B] space-y-2">
        <span className="text-[8px] font-bold text-[#262626] uppercase tracking-[0.2em] block mb-3">
          Legend
        </span>
        <LegendItem color="bg-white" label="MAX Node (AI)" />
        <LegendItem color="bg-[#474747]" label="MIN Node (Player)" />
        <LegendItem color="bg-white shadow-[0_0_6px_white]" label="Best Path" />
        <LegendItem color="bg-[#262626] opacity-40" label="Pruned Branch" />
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-2 h-2 ${color}`} />
      <span className="text-[8px] font-mono uppercase tracking-widest text-[#919191]">{label}</span>
    </div>
  );
}
