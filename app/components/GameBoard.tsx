"use client";
import { BoardState } from '../lib/types';
import Disc from './Disc';

interface GameBoardProps {
  board: BoardState;
  onColumnClick: (col: number) => void;
  disabled: boolean;
  winningCells: { r: number; c: number }[] | null;
  hoveredCol: number | null;
  onColumnHover: (col: number | null) => void;
}

/**
 * The Connect 4 6×7 game grid.
 * Cells have inset shadows to look like physical holes.
 * Winning cells glow. Hovered columns show a subtle indicator.
 */
export default function GameBoard({ board, onColumnClick, disabled, winningCells, hoveredCol, onColumnHover }: GameBoardProps) {
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

      {/* The Grid */}
      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isWinning = winningCells?.some(w => w.r === r && w.c === c);
            return (
              <div
                key={`${r}-${c}`}
                className={`
                  aspect-square flex items-center justify-center p-1.5 cursor-pointer
                  transition-all duration-300
                  ${disabled ? 'cursor-not-allowed' : 'hover:bg-[#1C1B1B]'}
                  ${isWinning
                    ? 'bg-white/10 ring-2 ring-white ring-offset-1 ring-offset-[#0E0E0E] z-10'
                    : 'bg-[#050505] border border-[#1C1B1B]/50'
                  }
                `}
                onClick={() => !disabled && onColumnClick(c)}
                onMouseEnter={() => onColumnHover(c)}
                onMouseLeave={() => onColumnHover(null)}
              >
                {cell ? (
                  <div className={`w-full h-full ${isWinning ? 'animate-pulse' : ''}`}>
                    <Disc player={cell} />
                  </div>
                ) : null}
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
