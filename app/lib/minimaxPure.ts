// ─── Pure Minimax WITHOUT Alpha-Beta Pruning ───
// Feature 9: Used in Algorithm Comparison Mode to show the difference
// between exhaustive Minimax and Alpha-Beta optimized Minimax.

import { BoardState, SearchNode, PerformanceStats } from './types';
import { getValidMoves, makeMove, isTerminalNode } from './board';
import { evaluateBoard } from './heuristic';

let pureStats = { nodesEvaluated: 0 };
let pureNodeCounter = 0;

/**
 * Run pure Minimax (no alpha-beta) and return the tree + stats.
 * This is intentionally slower — the comparison is the educational point.
 * We cap at depth 4 for pure minimax to avoid browser hangs.
 */
export function getBestMovePureMinimax(
  board: BoardState,
  depth: number
): { move: number; tree: SearchNode; stats: PerformanceStats } {
  pureStats.nodesEvaluated = 0;
  pureNodeCounter = 0;

  // Cap pure minimax at depth 4 to avoid hanging
  const safeDepth = Math.min(depth, 4);

  const startTime = performance.now();
  const treeRoot = pureMinimax(board, safeDepth, true, null);
  const endTime = performance.now();

  // Find best move from root children
  let bestMove = -1;
  let bestScore = -Infinity;

  for (const child of treeRoot.children) {
    if (child.score > bestScore) {
      bestScore = child.score;
      bestMove = child.move as number;
    }
  }

  if (bestMove === -1 && treeRoot.children.length > 0) {
    bestMove = treeRoot.children[0].move as number;
  }

  // Mark best path
  treeRoot.isBestPath = true;
  const bestChild = treeRoot.children.find(c => c.move === bestMove);
  if (bestChild) markPureBestPath(bestChild);

  const stats: PerformanceStats = {
    nodesEvaluated: pureStats.nodesEvaluated,
    nodesPruned: 0, // No pruning in pure minimax
    searchDepth: safeDepth,
    timeTakenMs: endTime - startTime,
    pruningEfficiency: 0
  };

  return { move: bestMove, tree: treeRoot, stats };
}

function markPureBestPath(node: SearchNode): void {
  node.isBestPath = true;
  if (node.children.length === 0) return;
  const best = node.children.find(c => c.score === node.score);
  if (best) markPureBestPath(best);
}

/**
 * Recursive pure minimax — no alpha or beta parameters.
 */
function pureMinimax(
  board: BoardState,
  depth: number,
  isMaximizing: boolean,
  moveMade: number | null
): SearchNode {
  pureNodeCounter++;
  const terminal = isTerminalNode(board);

  const node: SearchNode = {
    id: `pure-node-${pureNodeCounter}`,
    score: 0,
    alpha: -Infinity,
    beta: Infinity,
    depth,
    move: moveMade,
    pruned: false,
    isMax: isMaximizing,
    isTerminal: terminal,
    isBestPath: false,
    visitOrder: pureNodeCounter,
    children: [],
    board
  };

  pureStats.nodesEvaluated++;

  if (depth === 0 || terminal) {
    node.score = evaluateBoard(board);
    return node;
  }

  const validMoves = getValidMoves(board);

  if (isMaximizing) {
    let maxScore = -Infinity;
    for (const move of validMoves) {
      const newBoard = makeMove(board, move, 'YELLOW');
      const child = pureMinimax(newBoard, depth - 1, false, move);
      node.children.push(child);
      maxScore = Math.max(maxScore, child.score);
    }
    node.score = maxScore;
  } else {
    let minScore = Infinity;
    for (const move of validMoves) {
      const newBoard = makeMove(board, move, 'RED');
      const child = pureMinimax(newBoard, depth - 1, true, move);
      node.children.push(child);
      minScore = Math.min(minScore, child.score);
    }
    node.score = minScore;
  }

  return node;
}
