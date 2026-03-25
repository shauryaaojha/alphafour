"use client";
import { Player, GameStatus } from '../lib/types';

interface StatusBarProps {
  status: GameStatus;
  winner: Player;
  moveNumber: number;
  onReset: () => void;
}

/**
 * Game status display with turn indicator, move counter, and reset button.
 */
export default function StatusBar({ status, winner, moveNumber, onReset }: StatusBarProps) {
  let message = "YOUR TURN";
  let statusColor = "text-white";

  if (status === 'AI_THINKING') {
    message = "AI COMPUTING...";
    statusColor = "text-[#919191]";
  } else if (status === 'WIN') {
    message = winner === 'RED' ? "YOU WIN ■" : "AI WINS ■";
    statusColor = "text-white";
  } else if (status === 'DRAW') {
    message = "STALEMATE";
    statusColor = "text-[#474747]";
  }

  return (
    <div className="flex items-center justify-between bg-[#0E0E0E] p-4 border border-[#1C1B1B]">
      <div className="flex items-center gap-4">
        {/* Status indicator dot */}
        <div className={`w-2 h-2 ${
          status === 'AI_THINKING'
            ? 'bg-[#474747] animate-pulse'
            : status === 'WIN'
              ? 'bg-white shadow-[0_0_8px_white]'
              : 'bg-white'
        }`} />

        <span className={`font-headline text-xs font-bold uppercase tracking-[0.15em] ${statusColor}`}>
          {message}
        </span>

        {status === 'AI_THINKING' && (
          <span className="material-symbols-outlined text-[#474747] text-sm animate-spin">
            progress_activity
          </span>
        )}
      </div>

      <div className="flex items-center gap-6">
        <span className="font-mono text-[9px] text-[#474747] tracking-widest uppercase">
          MOVE: {moveNumber.toString().padStart(2, '0')}
        </span>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-[#1C1B1B] text-white border border-[#474747]/30 text-[9px] font-bold uppercase tracking-[0.15em] hover:bg-[#262626] transition-colors active:scale-[0.98]"
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xs">restart_alt</span>
            NEW GAME
          </span>
        </button>
      </div>
    </div>
  );
}
