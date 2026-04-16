import { NextRequest, NextResponse } from 'next/server';
import { makeMove, checkWin, isBoardFull, isValidMove } from '../../../lib/board';

export async function POST(req: NextRequest) {
  try {
    const { code, col, player } = await req.json();
    const roomCode = code.toUpperCase();
    const room = global.gameRooms?.[roomCode];

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    if (room.status !== 'PLAYING') {
      return NextResponse.json({ error: 'Game is over' }, { status: 400 });
    }

    if (room.currentPlayer !== player) {
      return NextResponse.json({ error: 'Not your turn' }, { status: 400 });
    }

    if (!isValidMove(room.board, col)) {
      return NextResponse.json({ error: 'Invalid move' }, { status: 400 });
    }

    // Apply the move
    room.board = makeMove(room.board, col, player);
    room.lastMoveNum++;
    room.lastActivity = Date.now();

    // Check terminal states
    if (checkWin(room.board, player)) {
      room.status = 'WIN';
      room.winner = player;
    } else if (isBoardFull(room.board)) {
      room.status = 'DRAW';
    } else {
      // Toggle turn
      room.currentPlayer = player === 'RED' ? 'YELLOW' : 'RED';
    }

    return NextResponse.json(room);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
