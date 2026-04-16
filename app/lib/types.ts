// ─── Type Definitions for AlphaFour AI Engine ───

export type Player = 'RED' | 'YELLOW' | null;
export type BoardState = Player[][];
export type GameMode = 'pvai' | 'aivai' | 'pvp' | 'online';

export interface SearchNode {
  id: string;
  score: number;
  alpha: number;
  beta: number;
  depth: number;
  move: number | null; // Which column was played to get here
  pruned: boolean;
  isMax: boolean;
  isTerminal: boolean;
  isBestPath: boolean; // Highlight the optimal path
  children: SearchNode[];
  board: BoardState;
  visitOrder?: number; // For animated node-by-node tree build (Feature 3)
}

export interface PerformanceStats {
  nodesEvaluated: number;
  nodesPruned: number;
  searchDepth: number;
  timeTakenMs: number;
  pruningEfficiency: number; // percentage
}

export type GameStatus = 'PLAYING' | 'AI_THINKING' | 'WIN' | 'DRAW';

// Feature 1 — Replay & Move History
export interface HistoryEntry {
  board: BoardState;
  player: Player;
  col: number;
  moveNumber: number;
  tree: SearchNode | null;
  stats: PerformanceStats | null;
  isBookMove?: boolean;
  bookMoveName?: string;
}

// Feature 7 — Threat Detection
export type ThreatType = 'ai-win' | 'ai-threat' | 'player-threat';
export interface ThreatWindow {
  cells: { r: number; c: number }[];
  type: ThreatType;
  col: number; // blocking/winning column
  label: string;
}

// Feature 8 — Pruning Graph
export interface MoveStats {
  move: number;
  evaluated: number;
  pruned: number;
  depth: number;
  time: number;
  efficiency: number;
}

// Feature 11 — Auto-Calibration
export interface PlayerRating {
  score: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
}
