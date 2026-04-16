"use client";
// ─── AI Narrator Speech Bubble ───
// Feature 10: Shows the AI's move explanation as a speech bubble.

import { useState } from 'react';
import { PerformanceStats } from '../lib/types';

interface SpeechBubbleProps {
  explanation: string | null;
  loading: boolean;
  chosenColumn: number | null;
  stats: PerformanceStats | null;
}

export default function SpeechBubble({
  explanation,
  loading,
  chosenColumn,
  stats
}: SpeechBubbleProps) {
  const [expanded, setExpanded] = useState(false);

  if (!loading && !explanation) return null;

  return (
    <div className="relative bg-[#0E0E0E] border border-[#1C1B1B] p-4">
      {/* Speech bubble pointer */}
      <div
        className="absolute -top-2 left-6 w-3 h-3 bg-[#0E0E0E] border-l border-t border-[#1C1B1B] rotate-45"
        style={{ zIndex: 1 }}
      />

      <div className="flex items-start gap-3 relative" style={{ zIndex: 2 }}>
        {/* AI icon */}
        <div className="shrink-0 w-6 h-6 bg-[#474747] flex items-center justify-center mt-0.5">
          <span className="material-symbols-outlined text-[12px] text-white">
            smart_toy
          </span>
        </div>

        <div className="flex-1 min-w-0">
          {/* Label */}
          <div className="text-[7px] font-mono uppercase tracking-[0.2em] text-[#474747] mb-1.5">
            AI Narrator
            {chosenColumn !== null && (
              <span className="ml-2 text-white">→ Col {chosenColumn}</span>
            )}
          </div>

          {/* Explanation text */}
          {loading ? (
            <div className="space-y-1.5">
              <div className="h-2 bg-[#1C1B1B] animate-pulse w-full" />
              <div className="h-2 bg-[#1C1B1B] animate-pulse w-3/4" />
            </div>
          ) : (
            <p className="text-[10px] text-[#C6C6C6] leading-relaxed">
              {explanation}
            </p>
          )}

          {/* Deep explanation (expanded) */}
          {stats && !loading && (
            <div className="mt-2">
              <button
                onClick={() => setExpanded(e => !e)}
                className="text-[7px] font-mono uppercase tracking-widest text-[#474747] hover:text-white transition-colors flex items-center gap-1"
              >
                <span>{expanded ? '▲' : '▼'}</span>
                {expanded ? 'Hide' : 'Deeper explanation'}
              </button>

              {expanded && (
                <div className="mt-2 pt-2 border-t border-[#1C1B1B] space-y-1 font-mono text-[7px] uppercase text-[#474747]">
                  <div className="flex justify-between">
                    <span>Nodes evaluated</span>
                    <span className="text-[#919191]">{stats.nodesEvaluated.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nodes pruned</span>
                    <span className="text-[#919191]">{stats.nodesPruned.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pruning efficiency</span>
                    <span className="text-white font-bold">{stats.pruningEfficiency}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Search depth</span>
                    <span className="text-[#919191]">{stats.searchDepth} ply</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Compute time</span>
                    <span className="text-[#919191]">{Math.round(stats.timeTakenMs)}ms</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
