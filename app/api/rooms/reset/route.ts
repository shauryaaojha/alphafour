import { NextRequest, NextResponse } from 'next/server';
import { Player, BoardState, GameStatus } from '../../../lib/types';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    const roomCode = code.toUpperCase();
    // @ts-ignore
    const room = global.gameRooms?.[roomCode];

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const emptyBoard = Array(6).fill(null).map(() => Array(7).fill(null));

    room.board = emptyBoard;
    room.currentPlayer = 'RED';
    room.status = 'PLAYING';
    room.winner = null;
    room.lastMoveNum = 0;
    room.lastActivity = Date.now();

    return NextResponse.json(room);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
