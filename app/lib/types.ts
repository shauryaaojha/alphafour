// ─── Type Definitions for AlphaFour AI Engine ───

export type Player = 'RED' | 'YELLOW' | null;
export type BoardState = Player[][];

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
}

export interface PerformanceStats {
  nodesEvaluated: number;
  nodesPruned: number;
  searchDepth: number;
  timeTakenMs: number;
  pruningEfficiency: number; // percentage
}

export type GameStatus = 'PLAYING' | 'AI_THINKING' | 'WIN' | 'DRAW';
