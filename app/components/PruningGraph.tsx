"use client";
// ─── Pruning Efficiency Live Graph ───
// Feature 8: Real-time bar chart showing nodes evaluated vs pruned per move.
// Uses SVG bars (no external chart library dependency needed).

import { MoveStats } from '../lib/types';

interface PruningGraphProps {
  history: MoveStats[];
  onReset: () => void;
  onExport: () => void;
}

const BAR_WIDTH = 18;
const BAR_GAP = 6;
const GRAPH_HEIGHT = 100;

export default function PruningGraph({ history, onReset, onExport }: PruningGraphProps) {
  if (history.length === 0) {
    return (
      <div className="p-4 text-center">
        <div className="text-[8px] font-mono text-[#262626] uppercase tracking-widest">
          No data yet — play moves to see pruning graph
        </div>
      </div>
    );
  }

  const maxNodes = Math.max(...history.map(h => h.evaluated + h.pruned), 1);
  const barGroupWidth = (BAR_WIDTH * 2 + BAR_GAP);
  const totalWidth = Math.max(280, history.length * (barGroupWidth + 4) + 20);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[9px] font-bold text-[#919191] uppercase tracking-[0.2em] block">
            Pruning Efficiency
          </span>
          <span className="text-[7px] text-[#474747] font-mono uppercase tracking-wider">
            Evaluated vs Pruned per Move
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onExport}
            className="text-[7px] font-mono uppercase tracking-widest text-[#474747] hover:text-white transition-colors border border-[#1C1B1B] px-2 py-1"
            title="Export CSV"
          >
            CSV
          </button>
          <button
            onClick={onReset}
            className="text-[7px] font-mono uppercase tracking-widest text-[#474747] hover:text-white transition-colors border border-[#1C1B1B] px-2 py-1"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: '#262626 #050505' }}>
        <svg
          width={totalWidth}
          height={GRAPH_HEIGHT + 30}
          className="block"
          style={{ minWidth: '100%' }}
        >
          {/* Y-axis grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(frac => {
            const y = GRAPH_HEIGHT - frac * GRAPH_HEIGHT;
            return (
              <g key={frac}>
                <line x1={0} y1={y} x2={totalWidth} y2={y} stroke="#1C1B1B" strokeWidth={0.5} />
                <text x={2} y={y - 2} fontSize={6} fill="#474747" fontFamily="monospace">
                  {Math.round(frac * maxNodes)}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {history.map((stat, i) => {
            const x = 16 + i * (barGroupWidth + 4);
            const evalH = (stat.evaluated / maxNodes) * GRAPH_HEIGHT;
            const prunedH = (stat.pruned / maxNodes) * GRAPH_HEIGHT;
            const effPct = stat.efficiency;

            return (
              <g key={i}>
                {/* Evaluated bar (white) */}
                <rect
                  x={x}
                  y={GRAPH_HEIGHT - evalH}
                  width={BAR_WIDTH}
                  height={evalH}
                  fill="white"
                  opacity={0.9}
                >
                  <title>Move {stat.move + 1}: {stat.evaluated} evaluated</title>
                </rect>

                {/* Pruned bar (dark gray) */}
                <rect
                  x={x + BAR_WIDTH + 2}
                  y={GRAPH_HEIGHT - prunedH}
                  width={BAR_WIDTH}
                  height={prunedH}
                  fill="#474747"
                  opacity={0.8}
                >
                  <title>Move {stat.move + 1}: {stat.pruned} pruned</title>
                </rect>

                {/* Efficiency % line dot */}
                <circle
                  cx={x + BAR_WIDTH + 1}
                  cy={GRAPH_HEIGHT - (effPct / 100) * GRAPH_HEIGHT}
                  r={2}
                  fill="#919191"
                />

                {/* Move label */}
                <text
                  x={x + BAR_WIDTH}
                  y={GRAPH_HEIGHT + 12}
                  fontSize={6}
                  fill="#474747"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  M{stat.move + 1}
                </text>
              </g>
            );
          })}

          {/* Efficiency line */}
          {history.length > 1 && (
            <polyline
              points={history.map((stat, i) => {
                const x = 16 + i * (barGroupWidth + 4) + BAR_WIDTH + 1;
                const y = GRAPH_HEIGHT - (stat.efficiency / 100) * GRAPH_HEIGHT;
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#474747"
              strokeWidth={1}
              strokeDasharray="2 2"
              opacity={0.6}
            />
          )}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-[7px] font-mono uppercase tracking-widest">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 bg-white" />
          <span className="text-[#919191]">Evaluated</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 bg-[#474747]" />
          <span className="text-[#919191]">Pruned</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-[2px] border-t border-dashed border-[#474747]" />
          <span className="text-[#919191]">Efficiency%</span>
        </div>
      </div>

      {/* Summary */}
      {history.length > 0 && (() => {
        const totalEval = history.reduce((a, h) => a + h.evaluated, 0);
        const totalPruned = history.reduce((a, h) => a + h.pruned, 0);
        const avgEff = history.reduce((a, h) => a + h.efficiency, 0) / history.length;
        return (
          <div className="flex justify-between text-[7px] font-mono uppercase text-[#474747] pt-2 border-t border-[#1C1B1B]">
            <span>Total eval: {totalEval.toLocaleString()}</span>
            <span>Total pruned: {totalPruned.toLocaleString()}</span>
            <span>Avg eff: {avgEff.toFixed(1)}%</span>
          </div>
        );
      })()}
    </div>
  );
}
