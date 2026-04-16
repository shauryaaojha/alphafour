"use client";
import { BoardState, ThreatWindow } from '../lib/types';
import Disc from './Disc';

interface GameBoardProps {
  board: BoardState;
  onColumnClick: (col: number) => void;
  disabled: boolean;
  winningCells: { r: number; c: number }[] | null;
  hoveredCol: number | null;
  onColumnHover: (col: number | null) => void;
  // Feature 1: Replay — highlight the disc placed at this step
  replayMoveCell?: { r: number; c: number } | null;
  // Feature 5: Heatmap — normalized scores 0–1 per column (7 values)
  heatmap?: number[] | null;
  showHeatmap?: boolean;
  // Feature 7: Threat highlights
  threats?: ThreatWindow[];
  showThreats?: boolean;
}

/**
 * The Connect 4 6×7 game grid.
 * Feature 1: Replay move highlighted with pulsing ring.
 * Feature 5: Heatmap overlay on columns.
 * Feature 7: Threat window highlights with color-coded overlays.
 */
export default function GameBoard({
  board,
  onColumnClick,
  disabled,
  winningCells,
  hoveredCol,
  onColumnHover,
  replayMoveCell,
  heatmap,
  showHeatmap = false,
  threats = [],
  showThreats = false,
}: GameBoardProps) {

  // Build a threat lookup: which cells are highlighted for threats
  const threatCellMap = new Map<string, string>(); // "r,c" → color class
  if (showThreats && threats.length > 0) {
    for (const threat of threats) {
      const color = threat.type === 'ai-win'
        ? 'rgba(255,255,255,0.25)'
        : threat.type === 'ai-threat'
          ? 'rgba(251,191,36,0.2)'  // amber
          : 'rgba(239,68,68,0.2)';  // red
      for (const cell of threat.cells) {
        const key = `${cell.r},${cell.c}`;
        if (!threatCellMap.has(key)) {
          threatCellMap.set(key, color);
        }
      }
    }
  }

  // Build heatmap column colors
  function getHeatmapColor(col: number): string {
    if (!showHeatmap || !heatmap) return 'transparent';
    const score = heatmap[col];
    // 0 (bad) = red/dark, 1 (good) = green
    const r = Math.round(255 * (1 - score));
    const g = Math.round(180 * score);
    return `rgba(${r},${g},0,0.18)`;
  }

  return (
    <div className="bg-[#0E0E0E] p-4 sm:p-6 border border-[#1C1B1B] relative">
      {/* Column labels */}
      <div className="flex justify-around mb-3 text-[#474747] font-mono text-[9px] tracking-widest uppercase px-1">
        {[0, 1, 2, 3, 4, 5, 6].map(c => (
          <span key={c} className={`transition-colors ${hoveredCol === c ? 'text-white' : ''}`}>
            C.{c}
          </span>
        ))}
      </div>

      {/* Column hover indicators */}
      <div className="flex justify-around mb-2 px-1">
        {[0, 1, 2, 3, 4, 5, 6].map(c => (
          <div key={c} className="flex-1 flex justify-center">
            <div className={`h-1 transition-all duration-200 ${
              hoveredCol === c && !disabled
                ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.4)]'
                : 'w-0 bg-transparent'
            }`} />
          </div>
        ))}
      </div>

      {/* Heatmap column overlays (Feature 5) */}
      {showHeatmap && heatmap && (
        <div className="absolute inset-x-0 flex px-4 sm:px-6" style={{ top: 56, bottom: 20, pointerEvents: 'none', zIndex: 5 }}>
          {[0, 1, 2, 3, 4, 5, 6].map(c => (
            <div
              key={c}
              className="flex-1 mx-0.5 transition-all duration-200"
              style={{
                background: getHeatmapColor(c),
                borderRadius: 0,
              }}
            />
          ))}
        </div>
      )}

      {/* The Grid */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3 relative" style={{ zIndex: 10 }}>
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isWinning = winningCells?.some(w => w.r === r && w.c === c);
            const isReplayMove = replayMoveCell?.r === r && replayMoveCell?.c === c;
            const threatColor = threatCellMap.get(`${r},${c}`);

            return (
              <div
                key={`${r}-${c}`}
                className={`
                  aspect-square flex items-center justify-center p-1.5 cursor-pointer
                  transition-all duration-300 relative
                  ${disabled ? 'cursor-not-allowed' : 'hover:bg-[#1C1B1B]'}
                  ${isWinning
                    ? 'bg-white/10 ring-2 ring-white ring-offset-1 ring-offset-[#0E0E0E] z-10'
                    : 'bg-[#050505] border border-[#1C1B1B]/50'
                  }
                `}
                style={{
                  // Feature 7: threat overlay tint
                  ...(threatColor && showThreats
                    ? { boxShadow: `inset 0 0 0 2px ${threatColor}` }
                    : {}),
                }}
                onClick={() => !disabled && onColumnClick(c)}
                onMouseEnter={() => onColumnHover(c)}
                onMouseLeave={() => onColumnHover(null)}
              >
                {cell ? (
                  <div className={`w-full h-full ${isWinning ? 'animate-pulse' : ''}`}>
                    <Disc player={cell} />
                  </div>
                ) : null}

                {/* Feature 1: Replay move highlight ring */}
                {isReplayMove && (
                  <div
                    className="absolute inset-0 border-2 border-white animate-pulse pointer-events-none"
                    style={{ zIndex: 20 }}
                  />
                )}

                {/* Feature 7: Threat tooltip on hover for highlighted cells */}
                {threatColor && showThreats && (
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ zIndex: 15 }}
                  >
                    <div
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-[#0E0E0E] border border-[#1C1B1B] px-2 py-1 whitespace-nowrap text-[7px] font-mono uppercase text-white z-50"
                    >
                      {threats.find(t => t.cells.some(p => p.r === r && p.c === c))?.label}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Row labels */}
      <div className="flex justify-around mt-3 text-[#262626] font-mono text-[8px] tracking-widest uppercase px-1">
        {[0, 1, 2, 3, 4, 5, 6].map(c => (
          <span key={c}>·</span>
        ))}
      </div>
    </div>
  );
}
