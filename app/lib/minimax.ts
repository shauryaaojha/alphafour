// ─── Minimax with Alpha-Beta Pruning + Full Tree Recording ───
// This module implements the core AI algorithm. It stores the ENTIRE
// search tree so the visualizer can render every explored node.
// Feature 3: Records visit order for animated node-by-node tree build.
// Feature 4: Checks the opening book before running Minimax.

import { BoardState, SearchNode, PerformanceStats } from './types';
import { getValidMoves, makeMove, isTerminalNode } from './board';
import { evaluateBoard } from './heuristic';
import { lookupBook } from './openingBook';

let globalStats = {
  nodesEvaluated: 0,
  nodesPruned: 0
};
let nodeCounter = 0;
let visitCounter = 0; // Feature 3: visit order for animation stagger

/**
 * Entry point: runs Minimax from the current board and returns
 * the best column, the full search tree, and performance stats.
 *
 * Feature 4: Checks opening book first. Returns bookMove flag.
 */
export function getBestMoveMinimax(
  board: BoardState,
  depth: number
): { move: number; tree: SearchNode; stats: PerformanceStats; isBookMove: boolean; bookMoveName?: string } {
  globalStats.nodesEvaluated = 0;
  globalStats.nodesPruned = 0;
  nodeCounter = 0;
  visitCounter = 0;

  // ── Feature 4: Opening Book Check ──
  const bookEntry = lookupBook(board);
  if (bookEntry) {
    // Validate the book move is still legal
    const validMoves = getValidMoves(board);
    if (validMoves.includes(bookEntry.col)) {
      // Create a minimal synthetic tree node for the visualizer
      const syntheticTree: SearchNode = {
        id: 'book-root',
        score: 0,
        alpha: -Infinity,
        beta: Infinity,
        depth,
        move: null,
        pruned: false,
        isMax: true,
        isTerminal: false,
        isBestPath: true,
        visitOrder: 0,
        children: [{
          id: 'book-move',
          score: 999,
          alpha: -Infinity,
          beta: Infinity,
          depth: depth - 1,
          move: bookEntry.col,
          pruned: false,
          isMax: false,
          isTerminal: false,
          isBestPath: true,
          visitOrder: 1,
          children: [],
          board: makeMove(board, bookEntry.col, 'YELLOW')
        }],
        board
      };
      const stats: PerformanceStats = {
        nodesEvaluated: 1,
        nodesPruned: 0,
        searchDepth: depth,
        timeTakenMs: 0,
        pruningEfficiency: 0
      };
      return { move: bookEntry.col, tree: syntheticTree, stats, isBookMove: true, bookMoveName: bookEntry.name };
    }
  }

  const startTime = performance.now();
  const treeRoot = minimax(board, depth, -Infinity, Infinity, true, null);
  const endTime = performance.now();

  const timeTakenMs = endTime - startTime;

  // Find the best move from root's children
  let bestMove = -1;
  let bestScore = -Infinity;

  for (const child of treeRoot.children) {
    if (!child.pruned && child.score > bestScore) {
      bestScore = child.score;
      bestMove = child.move as number;
    }
  }

  // Fallback if no valid best move found
  if (bestMove === -1 && treeRoot.children.length > 0) {
    const unpruned = treeRoot.children.filter(c => !c.pruned);
    if (unpruned.length > 0) {
      bestMove = unpruned[0].move as number;
    } else {
      bestMove = treeRoot.children[0].move as number;
    }
  }

  // Mark the best path through the tree (for green highlight in visualizer)
  markBestPath(treeRoot, bestMove);

  const totalNodes = globalStats.nodesEvaluated;
  const pruned = globalStats.nodesPruned;
  const pruningEfficiency = (totalNodes + pruned) > 0
    ? (pruned / (totalNodes + pruned)) * 100
    : 0;

  const stats: PerformanceStats = {
    nodesEvaluated: totalNodes,
    nodesPruned: pruned,
    searchDepth: depth,
    timeTakenMs,
    pruningEfficiency: Number(pruningEfficiency.toFixed(1))
  };

  return { move: bestMove, tree: treeRoot, stats, isBookMove: false };
}

/**
 * Mark the best path from root → leaf for visualization.
 */
function markBestPath(node: SearchNode, bestMove: number | null): void {
  node.isBestPath = true;

  if (bestMove !== null && node.children.length > 0) {
    // At root level, follow the child matching bestMove
    const bestChild = node.children.find(c => c.move === bestMove && !c.pruned);
    if (bestChild) {
      markBestPathRecursive(bestChild);
    }
  }
}

function markBestPathRecursive(node: SearchNode): void {
  node.isBestPath = true;

  if (node.children.length === 0) return;

  // The best child is the one whose score equals this node's score
  const bestChild = node.children.find(c => !c.pruned && c.score === node.score);
  if (bestChild) {
    markBestPathRecursive(bestChild);
  }
}

/**
 * Core Minimax with Alpha-Beta Pruning (recursive).
 * Records every node in the search tree for the visualizer.
 * Feature 3: assigns visitOrder to each node for staggered animation.
 */
function minimax(
  board: BoardState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  moveMade: number | null
): SearchNode {
  nodeCounter++;
  visitCounter++;
  const myVisitOrder = visitCounter; // Feature 3: snapshot visit order
  const terminal = isTerminalNode(board);

  const node: SearchNode = {
    id: `node-${nodeCounter}`,
    score: 0,
    alpha,
    beta,
    depth,
    move: moveMade,
    pruned: false,
    isMax: isMaximizing,
    isTerminal: terminal,
    isBestPath: false,
    visitOrder: myVisitOrder, // Feature 3
    children: [],
    board
  };

  globalStats.nodesEvaluated++;

  // Base case: leaf node — evaluate heuristic
  if (depth === 0 || terminal) {
    node.score = evaluateBoard(board);
    return node;
  }

  const validMoves = getValidMoves(board);

  if (isMaximizing) {
    // ─── MAX Node (AI's turn) ───
    let maxScore = -Infinity;

    for (const move of validMoves) {
      const newBoard = makeMove(board, move, 'YELLOW');
      const child = minimax(newBoard, depth - 1, alpha, beta, false, move);
      node.children.push(child);

      maxScore = Math.max(maxScore, child.score);
      alpha = Math.max(alpha, child.score);
      node.alpha = alpha;

      // Beta cutoff: prune remaining branches
      if (beta <= alpha) {
        const currentIndex = validMoves.indexOf(move);
        for (let i = currentIndex + 1; i < validMoves.length; i++) {
          nodeCounter++;
          visitCounter++;
          const prunedMove = validMoves[i];
          node.children.push({
            id: `node-${nodeCounter}`,
            score: 0,
            alpha,
            beta,
            depth: depth - 1,
            move: prunedMove,
            pruned: true,
            isMax: false,
            isTerminal: false,
            isBestPath: false,
            visitOrder: visitCounter,
            children: [],
            board: makeMove(board, prunedMove, 'YELLOW')
          });
          globalStats.nodesPruned++;
        }
        break;
      }
    }
    node.score = maxScore;
    return node;
  } else {
    // ─── MIN Node (Player's turn) ───
    let minScore = Infinity;

    for (const move of validMoves) {
      const newBoard = makeMove(board, move, 'RED');
      const child = minimax(newBoard, depth - 1, alpha, beta, true, move);
      node.children.push(child);

      minScore = Math.min(minScore, child.score);
      beta = Math.min(beta, child.score);
      node.beta = beta;

      // Alpha cutoff: prune remaining branches
      if (beta <= alpha) {
        const currentIndex = validMoves.indexOf(move);
        for (let i = currentIndex + 1; i < validMoves.length; i++) {
          nodeCounter++;
          visitCounter++;
          const prunedMove = validMoves[i];
          node.children.push({
            id: `node-${nodeCounter}`,
            score: 0,
            alpha,
            beta,
            depth: depth - 1,
            move: prunedMove,
            pruned: true,
            isMax: true,
            isTerminal: false,
            isBestPath: false,
            visitOrder: visitCounter,
            children: [],
            board: makeMove(board, prunedMove, 'RED')
          });
          globalStats.nodesPruned++;
        }
        break;
      }
    }
    node.score = minScore;
    return node;
  }
}
