// ─── Iterative Deepening Minimax ───
// Feature 6: Runs Minimax progressively from depth 1 to maxDepth,
// reporting intermediate best-move results after each depth pass.

import { BoardState, SearchNode, PerformanceStats } from './types';
import { getBestMoveMinimax } from './minimax';

export interface IterativeStep {
  depth: number;
  maxDepth: number;
  bestMove: number;
  score: number;
  tree: SearchNode;
  stats: PerformanceStats;
}

/**
 * Run iterative deepening from depth 1 → maxDepth.
 * Calls onStep after each depth with an intermediate result.
 * Returns the final (deepest) best move.
 */
export async function iterativeDeepeningMinimax(
  board: BoardState,
  maxDepth: number,
  onStep: (step: IterativeStep) => void,
  delayMs = 200
): Promise<{ move: number; tree: SearchNode; stats: PerformanceStats; isBookMove: boolean; bookMoveName?: string }> {
  let lastResult = await getBestMoveMinimax(board, 1);

  onStep({
    depth: 1,
    maxDepth,
    bestMove: lastResult.move,
    score: lastResult.tree.score,
    tree: lastResult.tree,
    stats: lastResult.stats
  });

  for (let d = 2; d <= maxDepth; d++) {
    // Small delay so the UI can re-render between depth passes
    if (delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    lastResult = await getBestMoveMinimax(board, d);

    onStep({
      depth: d,
      maxDepth,
      bestMove: lastResult.move,
      score: lastResult.tree.score,
      tree: lastResult.tree,
      stats: lastResult.stats
    });
  }

  return lastResult;
}
