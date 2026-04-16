// ─── Opening Book for Connect 4 ───
// Feature 4: Hard-coded optimal first moves from Connect 4 theory.
// Board is hashed as a string of "R", "Y", "." per row, joined.

import { BoardState } from './types';

export interface BookEntry {
  col: number;
  name: string;
}

/**
 * Compute a compact string hash of the board for lookup.
 * We only hash the occupied cells (rows 3–5, bottom half) and
 * the move count so early-game positions are uniquely identified.
 */
function hashBoard(board: BoardState): string {
  return board.map(row =>
    row.map(cell => cell === 'YELLOW' ? 'Y' : cell === 'RED' ? 'R' : '.').join('')
  ).join('|');
}

/**
 * Opening book: maps board hash → {col, name}.
 * Only covers the first 1-4 moves where theory is well-established.
 *
 * Key insight from Connect 4 theory (Victor Allis, 1988):
 *   - The first player can always force a win with optimal play
 *   - The center column (3) is the strongest opening move
 */
const OPENING_BOOK: Record<string, BookEntry> = {
  // Empty board → play center (column 3)
  '.......|.......|.......|.......|.......|.......': { col: 3, name: 'Centre Opening' },

  // After RED plays col 3 → AI plays col 3 (double center)
  '.......|.......|.......|.......|.......|...R...': { col: 3, name: 'Centre Response' },

  // After RED plays col 2 → AI plays col 3
  '.......|.......|.......|.......|.......|..R....': { col: 3, name: 'Centre Control' },

  // After RED plays col 4 → AI plays col 3
  '.......|.......|.......|.......|.......|....R..': { col: 3, name: 'Centre Control' },

  // After RED plays col 3, AI responds col 3, RED plays col 3 again (stacked center)
  '.......|.......|.......|.......|...Y...|...R...': { col: 3, name: 'Centre Stack' },

  // After RED plays col 0 → AI plays col 3 (center is more valuable)
  '.......|.......|.......|.......|.......|R......': { col: 3, name: 'Centre Priority' },

  // After RED plays col 6 → AI plays col 3
  '.......|.......|.......|.......|.......|......R': { col: 3, name: 'Centre Priority' },

  // After RED col 3, AI col 3, RED col 2 → AI plays col 4 (balance)
  '.......|.......|.......|.......|...Y...|..RR...': { col: 4, name: 'Balance Response' },

  // After RED col 3, AI col 3, RED col 4 → AI plays col 2 (balance)
  '.......|.......|.......|.......|...Y...|...RR..': { col: 2, name: 'Balance Response' },

  // Double-threat setup: after RED col 1, AI plays col 3
  '.......|.......|.......|.......|.......|.R.....': { col: 3, name: 'Diagonal Setup' },

  // After RED col 5, AI plays col 3
  '.......|.......|.......|.......|.......|.....R.': { col: 3, name: 'Diagonal Setup' },
};

/**
 * Look up the current board in the opening book.
 * Returns { col, name } if found, or null if no book move.
 */
export function lookupBook(board: BoardState): BookEntry | null {
  const hash = hashBoard(board);
  return OPENING_BOOK[hash] ?? null;
}
