import { BoardState, Player } from './types';

export const ROWS = 6;
export const COLS = 7;

export function createEmptyBoard(): BoardState {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

export function getAvailableRow(board: BoardState, col: number): number {
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r][col] === null) {
      return r;
    }
  }
  return -1;
}

export function isValidMove(board: BoardState, col: number): boolean {
  return board[0][col] === null;
}

export function getValidMoves(board: BoardState): number[] {
  const moves = [];
  const colOrder = [3, 2, 4, 1, 5, 0, 6]; 
  for (const c of colOrder) {
    if (board[0][c] === null) {
      moves.push(c);
    }
  }
  return moves;
}

export function makeMove(board: BoardState, col: number, player: Player): BoardState {
  const newBoard = board.map(row => [...row]);
  const row = getAvailableRow(newBoard, col);
  if (row !== -1) {
    newBoard[row][col] = player;
  }
  return newBoard;
}

export function checkWin(board: BoardState, player: Player): boolean {
  // horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      if (board[r][c] === player && board[r][c+1] === player && board[r][c+2] === player && board[r][c+3] === player) {
        return true;
      }
    }
  }
  // vertical
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] === player && board[r+1][c] === player && board[r+2][c] === player && board[r+3][c] === player) {
        return true;
      }
    }
  }
  // diagonal right
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 0; c < COLS - 3; c++) {
      if (board[r][c] === player && board[r+1][c+1] === player && board[r+2][c+2] === player && board[r+3][c+3] === player) {
        return true;
      }
    }
  }
  // diagonal left
  for (let r = 0; r < ROWS - 3; r++) {
    for (let c = 3; c < COLS; c++) {
      if (board[r][c] === player && board[r+1][c-1] === player && board[r+2][c-2] === player && board[r+3][c-3] === player) {
        return true;
      }
    }
  }
  return false;
}

export function isBoardFull(board: BoardState): boolean {
  for (let c = 0; c < COLS; c++) {
    if (board[0][c] === null) return false;
  }
  return true;
}

export function isTerminalNode(board: BoardState): boolean {
  return checkWin(board, 'RED') || checkWin(board, 'YELLOW') || isBoardFull(board);
}

export function getWinningCells(board: BoardState): {r: number, c: number}[] | null {
  const players: Player[] = ['RED', 'YELLOW'];
  
  for (const player of players) {
    // horizontal
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        if (board[r][c] === player && board[r][c+1] === player && board[r][c+2] === player && board[r][c+3] === player) {
          return [{r,c}, {r,c:c+1}, {r,c:c+2}, {r,c:c+3}];
        }
      }
    }
    // vertical
    for (let r = 0; r < ROWS - 3; r++) {
      for (let c = 0; c < COLS; c++) {
        if (board[r][c] === player && board[r+1][c] === player && board[r+2][c] === player && board[r+3][c] === player) {
          return [{r,c}, {r:r+1,c}, {r:r+2,c}, {r:r+3,c}];
        }
      }
    }
    // diagonal right
    for (let r = 0; r < ROWS - 3; r++) {
      for (let c = 0; c < COLS - 3; c++) {
        if (board[r][c] === player && board[r+1][c+1] === player && board[r+2][c+2] === player && board[r+3][c+3] === player) {
          return [{r,c}, {r:r+1,c:c+1}, {r:r+2,c:c+2}, {r:r+3,c:c+3}];
        }
      }
    }
    // diagonal left
    for (let r = 0; r < ROWS - 3; r++) {
      for (let c = 3; c < COLS; c++) {
        if (board[r][c] === player && board[r+1][c-1] === player && board[r+2][c-2] === player && board[r+3][c-3] === player) {
          return [{r,c}, {r:r+1,c:c-1}, {r:r+2,c:c-2}, {r:r+3,c:c-3}];
        }
      }
    }
  }
  return null;
}
