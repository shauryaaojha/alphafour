import { BoardState, Player } from './types';
import { checkWin, ROWS, COLS } from './board';

function evaluateWindow(window: Player[], piece: Player): number {
  let score = 0;
  let opponent: Player = piece === 'YELLOW' ? 'RED' : 'YELLOW';
  let pieceCount = 0;
  let emptyCount = 0;
  let oppCount = 0;

  for (const cell of window) {
    if (cell === piece) pieceCount++;
    else if (cell === null) emptyCount++;
    else if (cell === opponent) oppCount++;
  }

  if (pieceCount === 4) {
    score += 100000;
  } else if (pieceCount === 3 && emptyCount === 1) {
    score += 10;
  } else if (pieceCount === 2 && emptyCount === 2) {
    score += 3;
  }

  if (oppCount === 3 && emptyCount === 1) {
    score -= 10;
  }

  return score;
}

export function evaluateBoard(board: BoardState): number {
  if (checkWin(board, 'YELLOW')) return 100000;
  if (checkWin(board, 'RED')) return -100000;

  let score = 0;

  // Center column preference
  const centerArray: Player[] = [];
  for (let r = 0; r < ROWS; r++) {
    centerArray.push(board[r][Math.floor(COLS / 2)]);
  }
  const centerCount = centerArray.filter(cell => cell === 'YELLOW').length;
  score += centerCount * 3;

  // Horizontal
  for (let r = 0; r < ROWS; r++) {
    const rowArray = board[r];
    for (let c = 0; c < COLS - 3; c++) {
      const window: Player[] = rowArray.slice(c, c + 4);
      score += evaluateWindow(window, 'YELLOW');
    }
  }

  // Vertical
  for (let c = 0; c < COLS; c++) {
    const colArray: Player[] = [];
    for (let r = 0; r < ROWS; r++) {
      colArray.push(board[r][c]);
    }
    for (let r = 0; r < ROWS - 3; r++) {
      const window: Player[] = colArray.slice(r, r + 4);
      score += evaluateWindow(window, 'YELLOW');
    }
  }

  // Positive Diagonal
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      const window: Player[] = [board[r][c], board[r + 1][c + 1], board[r + 2][c + 2], board[r + 3][c + 3]];
      score += evaluateWindow(window, 'YELLOW');
    }
  }

  // Negative Diagonal
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 3; c < COLS; c++) {
      const window: Player[] = [board[r][c], board[r + 1][c - 1], board[r + 2][c - 2], board[r + 3][c - 3]];
      score += evaluateWindow(window, 'YELLOW');
    }
  }

  return score;
}
