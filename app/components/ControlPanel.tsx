"use client";

import { GameMode, PlayerRating } from '../lib/types';

interface ControlPanelProps {
  depth: number;
  setDepth: (d: number) => void;
  prunedHidden: boolean;
  setPrunedHidden: (h: boolean) => void;
  treeDepth: number;
  setTreeDepth: (d: number) => void;
  // Feature 2: Mode selection
  gameMode: GameMode;
  setGameMode: (m: GameMode) => void;
  aiVsAiDelay: number;
  setAiVsAiDelay: (d: number) => void;
  aiVsAiRunning: boolean;
  aiVsAiWins: { yellow: number; red: number; draws: number };
  // Feature 3: Animation speed
  animationSpeed: 'slow' | 'medium' | 'fast' | 'instant';
  setAnimationSpeed: (s: 'slow' | 'medium' | 'fast' | 'instant') => void;
  // Feature 5: Heatmap
  showHeatmap: boolean;
  setShowHeatmap: (v: boolean) => void;
  // Feature 6: Iterative deepening
  iterativeMode: boolean;
  setIterativeMode: (v: boolean) => void;
  currentIterativeDepth?: number;
  currentIterativeBestCol?: number;
  // Feature 7: Threat highlights
  showThreats: boolean;
  setShowThreats: (v: boolean) => void;
  // Feature 8: Pruning graph tab
  showPruningGraph: boolean;
  setShowPruningGraph: (v: boolean) => void;
  // Feature 9: Compare mode
  compareMode: boolean;
  setCompareMode: (v: boolean) => void;
  // Feature 10: AI narrator
  narratorEnabled: boolean;
  setNarratorEnabled: (v: boolean) => void;
  // Feature 11: Auto-calibration
  autoCalibrate: boolean;
  setAutoCalibrate: (v: boolean) => void;
  playerRating: PlayerRating;
  // Feature 12: Player names for PvP
  player1Name: string;
  setPlayer1Name: (n: string) => void;
  player2Name: string;
  setPlayer2Name: (n: string) => void;
}

/**
 * Algorithm control panel — now includes all 12 expo feature controls.
 */
export default function ControlPanel({
  depth, setDepth,
  prunedHidden, setPrunedHidden,
  treeDepth, setTreeDepth,
  gameMode, setGameMode,
  aiVsAiDelay, setAiVsAiDelay,
  aiVsAiRunning,
  aiVsAiWins,
  animationSpeed, setAnimationSpeed,
  showHeatmap, setShowHeatmap,
  iterativeMode, setIterativeMode,
  currentIterativeDepth, currentIterativeBestCol,
  showThreats, setShowThreats,
  showPruningGraph, setShowPruningGraph,
  compareMode, setCompareMode,
  narratorEnabled, setNarratorEnabled,
  autoCalibrate, setAutoCalibrate,
  playerRating,
  player1Name, setPlayer1Name,
  player2Name, setPlayer2Name,
}: ControlPanelProps) {

  const getDifficultyLabel = (d: number) => {
    if (d <= 2) return 'EASY';
    if (d <= 5) return 'MEDIUM';
    return 'HARD';
  };

  const getRatingLabel = (r: number) => {
    if (r < 800) return { label: 'BEGINNER', color: '#474747' };
    if (r < 1000) return { label: 'CASUAL', color: '#919191' };
    if (r < 1200) return { label: 'SKILLED', color: '#C6C6C6' };
    return { label: 'EXPERT', color: '#FFFFFF' };
  };

  const ratingInfo = getRatingLabel(playerRating.score);

  return (
    <div className="space-y-5">

      {/* ── Feature 2: Game Mode ── */}
      <div className="space-y-2">
        <span className="font-headline text-[10px] font-bold text-[#919191] uppercase tracking-[0.1em] block">
          Game Mode
        </span>
        <div className="grid grid-cols-4 gap-1">
          {[
            { value: 'pvai', label: 'vs AI' },
            { value: 'aivai', label: 'AI×AI' },
            { value: 'pvp', label: 'P×P' },
            { value: 'online', label: 'Web' },
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setGameMode(value as GameMode)}
              className={`py-2 text-[8px] font-mono uppercase tracking-widest font-bold transition-colors border ${
                gameMode === value
                  ? 'bg-white text-black border-white'
                  : 'bg-[#050505] text-[#474747] border-[#1C1B1B] hover:border-[#474747] hover:text-[#919191]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Feature 2/12: PvP or Online player names */}
      {(gameMode === 'pvp' || gameMode === 'online') && (
        <div className="space-y-2">
          <span className="font-headline text-[10px] font-bold text-[#919191] uppercase tracking-[0.1em] block">
            Player Names
          </span>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white shrink-0" />
              <input
                type="text"
                value={player1Name}
                onChange={e => setPlayer1Name(e.target.value)}
                placeholder="Player 1"
                className="flex-1 bg-[#050505] border border-[#1C1B1B] text-white text-[9px] font-mono px-2 py-1 focus:outline-none focus:border-[#474747]"
                maxLength={16}
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[#474747] shrink-0" />
              <input
                type="text"
                value={player2Name}
                onChange={e => setPlayer2Name(e.target.value)}
                placeholder="Player 2"
                className="flex-1 bg-[#050505] border border-[#1C1B1B] text-white text-[9px] font-mono px-2 py-1 focus:outline-none focus:border-[#474747]"
                maxLength={16}
              />
            </div>
          </div>
        </div>
      )}

      {/* Feature 2: AI vs AI counters */}
      {gameMode === 'aivai' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-headline text-[10px] font-bold text-[#919191] uppercase tracking-[0.1em]">
              AI Delay
            </span>
            <span className="font-mono text-white text-xs">{aiVsAiDelay}ms</span>
          </div>
          <input
            className="w-full"
            max="2000" min="100" type="range" step="100"
            value={aiVsAiDelay}
            onChange={e => setAiVsAiDelay(Number(e.target.value))}
          />
          {/* Win counter */}
          <div className="grid grid-cols-3 gap-1 pt-1">
            <div className="bg-[#050505] border border-[#1C1B1B] p-2 text-center">
              <div className="text-white font-mono text-sm font-bold">{aiVsAiWins.yellow}</div>
              <div className="text-[7px] text-[#474747] font-mono uppercase">AI-1 W</div>
            </div>
            <div className="bg-[#050505] border border-[#1C1B1B] p-2 text-center">
              <div className="text-[#474747] font-mono text-sm font-bold">{aiVsAiWins.draws}</div>
              <div className="text-[7px] text-[#474747] font-mono uppercase">Draws</div>
            </div>
            <div className="bg-[#050505] border border-[#1C1B1B] p-2 text-center">
              <div className="text-[#919191] font-mono text-sm font-bold">{aiVsAiWins.red}</div>
              <div className="text-[7px] text-[#474747] font-mono uppercase">AI-2 W</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Search Depth ── */}
      {gameMode !== 'pvp' && (
        <div className="space-y-3 pt-2 border-t border-[#1C1B1B]">
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
            onChange={e => setDepth(Number(e.target.value))}
          />
          <div className="flex justify-between text-[7px] text-[#262626] font-mono uppercase">
            <span>1</span><span>4</span><span>8</span>
          </div>
        </div>
      )}

      {/* ── Tree View Depth ── */}
      <div className="space-y-3 pt-2 border-t border-[#1C1B1B]">
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
          onChange={e => setTreeDepth(Number(e.target.value))}
        />
      </div>

      {/* ── Feature 3: Animation Speed ── */}
      <div className="space-y-2 pt-2 border-t border-[#1C1B1B]">
        <span className="font-headline text-[10px] font-bold text-[#919191] uppercase tracking-[0.1em] block">
          Tree Animation
        </span>
        <div className="grid grid-cols-2 gap-1">
          {(['slow', 'medium', 'fast', 'instant'] as const).map(s => (
            <button
              key={s}
              onClick={() => setAnimationSpeed(s)}
              className={`py-1.5 text-[7px] font-mono uppercase tracking-widest transition-colors border ${
                animationSpeed === s
                  ? 'bg-white text-black border-white'
                  : 'bg-[#050505] text-[#474747] border-[#1C1B1B] hover:border-[#474747]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ── Toggles section ── */}
      <div className="space-y-3 pt-2 border-t border-[#1C1B1B]">
        <span className="text-[8px] font-bold text-[#262626] uppercase tracking-[0.2em] block">
          Visual Overlays
        </span>

        {/* Feature 5: Heatmap */}
        <Toggle label="Heatmap" subtitle="Column score overlay" value={showHeatmap} onChange={setShowHeatmap} />

        {/* Feature 7: Threat highlights */}
        <Toggle label="Threats" subtitle="3-in-a-row highlights" value={showThreats} onChange={setShowThreats} />

        {/* Feature 8: Pruning graph */}
        <Toggle label="Pruning Graph" subtitle="Nodes bar chart" value={showPruningGraph} onChange={setShowPruningGraph} />

        {/* Hide pruned */}
        <Toggle label="Hide Pruned" subtitle="Show only explored" value={prunedHidden} onChange={setPrunedHidden} />
      </div>

      {/* ── AI Features ── */}
      <div className="space-y-3 pt-2 border-t border-[#1C1B1B]">
        <span className="text-[8px] font-bold text-[#262626] uppercase tracking-[0.2em] block">
          AI Features
        </span>

        {/* Feature 6: Iterative deepening */}
        {(gameMode !== 'pvp' && gameMode !== 'online') && (
          <>
            <Toggle label="Iterative Depth" subtitle="Show search progress" value={iterativeMode} onChange={setIterativeMode} />
            {iterativeMode && currentIterativeDepth !== undefined && (
              <div className="bg-[#050505] border border-[#1C1B1B] p-2 font-mono text-[7px] uppercase tracking-wider space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#474747]">Current depth</span>
                  <span className="text-white">{currentIterativeDepth} / {depth}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#474747]">Best col so far</span>
                  <span className="text-white">
                    {currentIterativeBestCol !== undefined ? `Col ${currentIterativeBestCol}` : '—'}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-[2px] bg-[#1C1B1B] mt-1">
                  <div
                    className="h-full bg-white transition-all duration-300"
                    style={{ width: `${(currentIterativeDepth / depth) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </>
        )}

        {/* Feature 9: Compare mode */}
        {(gameMode !== 'pvp' && gameMode !== 'online') && (
          <Toggle label="Compare Mode" subtitle="Pure vs Alpha-Beta" value={compareMode} onChange={setCompareMode} />
        )}

        {/* Feature 10: AI narrator */}
        {(gameMode !== 'pvp' && gameMode !== 'online') && (
          <Toggle label="AI Narrator" subtitle="Explain each move" value={narratorEnabled} onChange={setNarratorEnabled} />
        )}

        {/* Feature 11: Auto-calibration */}
        {gameMode === 'pvai' && (
          <>
            <Toggle label="Auto-Calibrate" subtitle="Dynamic difficulty" value={autoCalibrate} onChange={setAutoCalibrate} />
            {autoCalibrate && (
              <div className="bg-[#050505] border border-[#1C1B1B] p-2 font-mono text-[7px] uppercase tracking-wider space-y-1">
                <div className="flex justify-between">
                  <span className="text-[#474747]">Rating</span>
                  <span className="font-bold" style={{ color: ratingInfo.color }}>
                    {playerRating.score}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#474747]">Level</span>
                  <span style={{ color: ratingInfo.color }}>{ratingInfo.label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#474747]">W / L</span>
                  <span className="text-[#919191]">{playerRating.wins} / {playerRating.losses}</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Legend ── */}
      <div className="pt-4 border-t border-[#1C1B1B] space-y-2">
        <span className="text-[8px] font-bold text-[#262626] uppercase tracking-[0.2em] block mb-3">
          Legend
        </span>
        <LegendItem color="bg-white" label="MAX Node (AI)" />
        <LegendItem color="bg-[#474747]" label="MIN Node (Player)" />
        <LegendItem color="bg-white shadow-[0_0_6px_white]" label="Best Path" />
        <LegendItem color="bg-[#262626] opacity-40" label="Pruned Branch" />
        <LegendItem color="bg-[#F5C842]/30 border border-[#F5C842]/50" label="AI Threat (amber)" />
        <LegendItem color="bg-red-500/30 border border-red-500/50" label="Player Threat (red)" />
      </div>
    </div>
  );
}

function Toggle({
  label, subtitle, value, onChange
}: {
  label: string;
  subtitle: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="text-[10px] font-bold text-[#C6C6C6] uppercase tracking-wide block">
          {label}
        </span>
        <span className="text-[8px] text-[#474747] uppercase tracking-wider">
          {subtitle}
        </span>
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-10 h-5 border transition-all relative shrink-0 ${
          value
            ? 'bg-white border-white'
            : 'bg-[#050505] border-[#474747]'
        }`}
      >
        <span className={`absolute top-[3px] w-3 h-3 transition-all ${
          value
            ? 'left-[22px] bg-black'
            : 'left-[3px] bg-white'
        }`} />
      </button>
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
