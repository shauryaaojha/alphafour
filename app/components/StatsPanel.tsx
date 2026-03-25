"use client";
import { PerformanceStats } from '../lib/types';

/**
 * Performance statistics panel showing AI computation metrics.
 * Displayed in the monochrome brutalist style.
 */
export default function StatsPanel({ stats }: { stats: PerformanceStats | null }) {
  if (!stats) return null;

  return (
    <div className="bg-[#050505] border border-[#1C1B1B] p-4">
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#1C1B1B]">
        <span className="material-symbols-outlined text-[10px] text-white">monitoring</span>
        <span className="font-headline text-[9px] font-bold uppercase tracking-[0.2em] text-[#919191]">
          Performance_Metrics
        </span>
      </div>
      <div className="font-mono text-[9px] space-y-3 uppercase">
        <StatRow label="Nodes Evaluated" value={stats.nodesEvaluated.toLocaleString()} />
        <StatRow label="Nodes Pruned" value={stats.nodesPruned.toLocaleString()} />
        <StatRow label="Search Depth" value={`${stats.searchDepth} ply`} />
        <StatRow label="Time" value={`${Math.round(stats.timeTakenMs)} ms`} />
        <div className="flex justify-between items-center pt-2 border-t border-[#1C1B1B]">
          <span className="text-[#474747]">Pruning Efficiency</span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-[2px] bg-[#1C1B1B]">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${stats.pruningEfficiency}%` }}
              />
            </div>
            <span className="text-white font-bold">{stats.pruningEfficiency}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-[#1C1B1B]/50 pb-1.5">
      <span className="text-[#474747]">{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}
