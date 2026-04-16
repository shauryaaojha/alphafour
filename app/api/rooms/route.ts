// ─── Multiplayer Room API ───
// Manages transient room states for Online Multiplayer (Feature 12)
// Since this is for a local expo/demo, we use an in-memory global state.
import { NextRequest, NextResponse } from 'next/server';
import { Player, BoardState, GameStatus } from '../../lib/types';

// Global store for rooms
declare global {
  var gameRooms: Record<string, RoomState>;
}

if (!global.gameRooms) {
  global.gameRooms = {};
}

export interface RoomState {
  code: string;
  board: BoardState;
  currentPlayer: Player;
  players: { red: string | null; yellow: string | null };
  status: GameStatus;
  winner: Player | null;
  lastMoveNum: number;
  lastActivity: number;
}

// Helper to clean up old rooms
function cleanupRooms() {
  const now = Date.now();
  for (const code in global.gameRooms) {
    // Remove if inactive for 1 hour
    if (now - global.gameRooms[code].lastActivity > 3600000) {
      delete global.gameRooms[code];
    }
  }
}

// GET: Fetch room state
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code || !global.gameRooms[code]) {
    return NextResponse.json({ error: 'Room not found' }, { status: 404 });
  }
  global.gameRooms[code].lastActivity = Date.now();
  return NextResponse.json(global.gameRooms[code]);
}

// POST: Create a new room
export async function POST(req: NextRequest) {
  cleanupRooms();
  try {
    const { playerName } = await req.json();
    
    // Generate a 4-letter room code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    
    // Create empty board
    const emptyBoard = Array(6).fill(null).map(() => Array(7).fill(null));

    const newRoom: RoomState = {
      code,
      board: emptyBoard,
      currentPlayer: 'RED',
      players: { red: playerName || 'Player 1', yellow: null },
      status: 'PLAYING',
      winner: null,
      lastMoveNum: 0,
      lastActivity: Date.now()
    };

    global.gameRooms[code] = newRoom;
    return NextResponse.json(newRoom);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

// PUT: Join an existing room
export async function PUT(req: NextRequest) {
  try {
    const { code, playerName } = await req.json();
    const roomCode = code.toUpperCase();
    const room = global.gameRooms[roomCode];

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    if (room.players.yellow) {
      return NextResponse.json({ error: 'Room is full' }, { status: 403 });
    }

    room.players.yellow = playerName || 'Player 2';
    room.lastActivity = Date.now();

    return NextResponse.json(room);
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
