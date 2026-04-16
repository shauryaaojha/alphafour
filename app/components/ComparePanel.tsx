"use client";
// ─── Algorithm Comparison Panel ───
// Feature 9: Shows Pure Minimax vs Alpha-Beta side by side with node count diff.

import { SearchNode, PerformanceStats } from '../lib/types';
import TreeVisualizer from './TreeVisualizer';

interface ComparePanelProps {
  pureTree: SearchNode | null;
  pureStats: PerformanceStats | null;
  alphaBetaTree: SearchNode | null;
  alphaBetaStats: PerformanceStats | null;
  prunedHidden: boolean;
  onNodeClick: (n: SearchNode) => void;
}

export default function ComparePanel({
  pureTree,
  pureStats,
  alphaBetaTree,
  alphaBetaStats,
  prunedHidden,
  onNodeClick
}: ComparePanelProps) {
  const savedNodes = pureStats && alphaBetaStats
    ? pureStats.nodesEvaluated - alphaBetaStats.nodesEvaluated
    : null;

  const savedPct = pureStats && alphaBetaStats && pureStats.nodesEvaluated > 0
    ? ((savedNodes! / pureStats.nodesEvaluated) * 100).toFixed(1)
    : null;

  return (
    <div className="flex flex-col h-full">
      {/* Banner */}
      {savedNodes !== null && (
        <div className="flex items-center justify-between px-4 py-2 bg-white text-black border-b border-[#1C1B1B]">
          <span className="font-mono text-[8px] uppercase tracking-widest font-bold">
            Alpha-Beta saved {savedNodes.toLocaleString()} nodes ({savedPct}%)
          </span>
          <span className="text-[8px] font-bold uppercase tracking-widest">
            ★ Alpha-Beta WINS
          </span>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel: Pure Minimax */}
        <div className="flex-1 flex flex-col border-r border-[#1C1B1B] overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#1C1B1B] bg-[#050505]">
            <div>
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-[#919191] block">
                Pure Minimax
              </span>
              <span className="text-[7px] text-[#474747] font-mono">
                {pureStats ? `${pureStats.nodesEvaluated.toLocaleString()} nodes` : 'No data'}
              </span>
            </div>
            <div className="w-2 h-2 bg-[#474747]" />
          </div>
          <div className="flex-1 overflow-auto p-2 no-scrollbar">
            <TreeVisualizer
              tree={pureTree}
              prunedHidden={false}
              onNodeClick={onNodeClick}
              maxDepthToShow={3}
            />
          </div>
        </div>

        {/* Right panel: Alpha-Beta */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 border-b border-[#1C1B1B] bg-[#050505]">
            <div>
              <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-white block">
                Alpha-Beta ✓
              </span>
              <span className="text-[7px] text-[#919191] font-mono">
                {alphaBetaStats ? `${alphaBetaStats.nodesEvaluated.toLocaleString()} nodes` : 'No data'}
              </span>
            </div>
            <div className="w-2 h-2 bg-white shadow-[0_0_6px_white]" />
          </div>
          <div className="flex-1 overflow-auto p-2 no-scrollbar">
            <TreeVisualizer
              tree={alphaBetaTree}
              prunedHidden={prunedHidden}
              onNodeClick={onNodeClick}
              maxDepthToShow={3}
            />
          </div>
        </div>
      </div>

      {/* Bottom stats comparison */}
      {pureStats && alphaBetaStats && (
        <div className="grid grid-cols-3 border-t border-[#1C1B1B] text-[7px] font-mono uppercase tracking-widest">
          <div className="p-2 border-r border-[#1C1B1B] text-center">
            <div className="text-[#474747]">{pureStats.nodesEvaluated.toLocaleString()}</div>
            <div className="text-[#262626] mt-0.5">Pure nodes</div>
          </div>
          <div className="p-2 border-r border-[#1C1B1B] text-center">
            <div className="text-white font-bold">{savedPct}%</div>
            <div className="text-[#262626] mt-0.5">Saved</div>
          </div>
          <div className="p-2 text-center">
            <div className="text-white">{alphaBetaStats.nodesEvaluated.toLocaleString()}</div>
            <div className="text-[#262626] mt-0.5">AB nodes</div>
          </div>
        </div>
      )}
    </div>
  );
}
