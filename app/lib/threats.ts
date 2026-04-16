// ─── Threat Detection for AlphaFour ───
// Feature 7: Identifies 3-in-a-row threats on the board for visual overlay.

import { BoardState, ThreatWindow } from './types';
import { ROWS, COLS, getAvailableRow, isValidMove, makeMove } from './board';
import { evaluateBoard } from './heuristic';

/**
 * Scan all windows of 4 in all directions and detect threats.
 * Returns an array of ThreatWindows for the board overlay.
 */
export function detectThreats(board: BoardState): ThreatWindow[] {
  const threats: ThreatWindow[] = [];

  // Helper: check a 4-cell window for threats
  function checkWindow(cells: { r: number; c: number }[]): void {
    const values = cells.map(p => board[p.r][p.c]);
    const yellowCount = values.filter(v => v === 'YELLOW').length;
    const redCount = values.filter(v => v === 'RED').length;
    const emptyCount = values.filter(v => v === null).length;

    // AI win: AI has 4 in a row
    if (yellowCount === 4) {
      threats.push({ cells, type: 'ai-win', col: -1, label: 'AI wins!' });
      return;
    }

    // AI threat: 3 AI + 1 empty (offensive threat)
    if (yellowCount === 3 && emptyCount === 1 && redCount === 0) {
      const emptyCell = cells.find(p => board[p.r][p.c] === null);
      if (emptyCell) {
        const row = getAvailableRow(board, emptyCell.c);
        if (row === emptyCell.r) { // Only if the empty cell is reachable
          threats.push({
            cells,
            type: 'ai-threat',
            col: emptyCell.c,
            label: `AI threat → col ${emptyCell.c}`
          });
        }
      }
    }

    // Player threat: 3 Player + 1 empty (defensive threat)
    if (redCount === 3 && emptyCount === 1 && yellowCount === 0) {
      const emptyCell = cells.find(p => board[p.r][p.c] === null);
      if (emptyCell) {
        const row = getAvailableRow(board, emptyCell.c);
        if (row === emptyCell.r) {
          threats.push({
            cells,
            type: 'player-threat',
            col: emptyCell.c,
            label: `Block col ${emptyCell.c}!`
          });
        }
      }
    }
  }

  // Horizontal windows
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      checkWindow([
        { r, c }, { r, c: c + 1 }, { r, c: c + 2 }, { r, c: c + 3 }
      ]);
    }
  }

  // Vertical windows
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r <= ROWS - 4; r++) {
      checkWindow([
        { r, c }, { r: r + 1, c }, { r: r + 2, c }, { r: r + 3, c }
      ]);
    }
  }

  // Diagonal (positive slope)
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      checkWindow([
        { r, c }, { r: r + 1, c: c + 1 }, { r: r + 2, c: c + 2 }, { r: r + 3, c: c + 3 }
      ]);
    }
  }

  // Diagonal (negative slope)
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 3; c < COLS; c++) {
      checkWindow([
        { r, c }, { r: r + 1, c: c - 1 }, { r: r + 2, c: c - 2 }, { r: r + 3, c: c - 3 }
      ]);
    }
  }

  // Deduplicate: keep only the most significant threat per cell-window
  const seen = new Set<string>();
  return threats.filter(t => {
    const key = t.cells.map(p => `${p.r},${p.c}`).sort().join(';');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Compute per-column heuristic scores for the heatmap overlay (Feature 5).
 * Returns an array of 7 normalized scores (0–1) for columns 0–6.
 */
export function computeColumnHeatmap(board: BoardState): number[] {
  const scores: number[] = [];
  for (let col = 0; col < COLS; col++) {
    if (!isValidMove(board, col)) {
      scores.push(0);
    } else {
      const simulated = makeMove(board, col, 'YELLOW');
      scores.push(evaluateBoard(simulated));
    }
  }

  // Normalize to 0–1
  const validScores = scores.filter((_, i) => isValidMove(board, i));
  const min = Math.min(...validScores);
  const max = Math.max(...validScores);
  const range = max - min || 1;

  return scores.map((s, i) => {
    if (!isValidMove(board, i)) return 0;
    return (s - min) / range;
  });
}
