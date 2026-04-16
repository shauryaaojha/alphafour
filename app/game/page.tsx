"use client";
import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Player, BoardState, SearchNode, PerformanceStats, GameStatus,
  GameMode, HistoryEntry, ThreatWindow, MoveStats, PlayerRating
} from '../lib/types';
import {
  createEmptyBoard, makeMove, getValidMoves, isValidMove,
  checkWin, isBoardFull, getWinningCells
} from '../lib/board';
import { getBestMoveMinimax } from '../lib/minimax';
import { getBestMovePureMinimax } from '../lib/minimaxPure';
import { iterativeDeepeningMinimax } from '../lib/iterativeDeepening';
import { detectThreats } from '../lib/threats';
import { evaluateBoard } from '../lib/heuristic';
import GameBoard from '../components/GameBoard';
import StatusBar from '../components/StatusBar';
import TreeVisualizer from '../components/TreeVisualizer';
import StatsPanel from '../components/StatsPanel';
import ControlPanel from '../components/ControlPanel';
import PruningGraph from '../components/PruningGraph';
import ComparePanel from '../components/ComparePanel';
import SpeechBubble from '../components/SpeechBubble';

// ── Feature 5: heatmap normalization helper ──
function computeHeatmap(board: BoardState): number[] {
  const scores: number[] = [];
  for (let col = 0; col < 7; col++) {
    if (!isValidMove(board, col)) {
      scores.push(0);
    } else {
      const sim = makeMove(board, col, 'YELLOW');
      scores.push(evaluateBoard(sim));
    }
  }
  const valid = scores.filter((_, i) => isValidMove(board, i));
  const min = Math.min(...valid);
  const max = Math.max(...valid);
  const range = max - min || 1;
  return scores.map((s, i) => isValidMove(board, i) ? (s - min) / range : 0);
}

// ── Feature 11: depth from rating ──
function depthFromRating(rating: number): number {
  if (rating < 800) return 2;
  if (rating < 1000) return 4;
  if (rating < 1200) return 6;
  return 7;
}

export default function GamePage() {
  // ─── Core Game State ───
  const [board, setBoard] = useState<BoardState>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('RED');
  const [status, setStatus] = useState<GameStatus>('PLAYING');
  const [winner, setWinner] = useState<Player>(null);
  const [moveNumber, setMoveNumber] = useState(0);
  const [winningCells, setWinningCells] = useState<{ r: number; c: number }[] | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  // ─── Feature 1: Replay History ───
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [replayIndex, setReplayIndex] = useState<number | null>(null); // null = live game
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayPlaying, setReplayPlaying] = useState(false);
  const replayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ─── AI & Visualization State ───
  const [depth, setDepth] = useState(5);
  const [treeDepth, setTreeDepth] = useState(3);
  const [searchTree, setSearchTree] = useState<SearchNode | null>(null);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats | null>(null);
  const [prunedHidden, setPrunedHidden] = useState(false);
  const [selectedNode, setSelectedNode] = useState<SearchNode | null>(null);

  // ─── Feature 2: Game Mode ───
  const [gameMode, setGameMode] = useState<GameMode>('pvai');
  const [aiVsAiDelay, setAiVsAiDelay] = useState(500);
  const [aiVsAiWins, setAiVsAiWins] = useState({ yellow: 0, red: 0, draws: 0 });

  // ─── Feature 3: Animation Speed ───
  const [animationSpeed, setAnimationSpeed] = useState<'slow' | 'medium' | 'fast' | 'instant'>('fast');

  // ─── Feature 4: Book move badge ───
  const [bookMoveBadge, setBookMoveBadge] = useState<{ name: string } | null>(null);

  // ─── Feature 5: Heatmap ───
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [heatmapData, setHeatmapData] = useState<number[] | null>(null);

  // ─── Feature 6: Iterative deepening ───
  const [iterativeMode, setIterativeMode] = useState(false);
  const [currentIterativeDepth, setCurrentIterativeDepth] = useState<number | undefined>(undefined);
  const [currentIterativeBestCol, setCurrentIterativeBestCol] = useState<number | undefined>(undefined);

  // ─── Feature 7: Threats ───
  const [showThreats, setShowThreats] = useState(false);
  const [threats, setThreats] = useState<ThreatWindow[]>([]);

  // ─── Feature 8: Pruning Graph ───
  const [showPruningGraph, setShowPruningGraph] = useState(false);
  const [moveStatsHistory, setMoveStatsHistory] = useState<MoveStats[]>([]);

  // ─── Feature 9: Compare Mode ───
  const [compareMode, setCompareMode] = useState(false);
  const [pureTree, setPureTree] = useState<SearchNode | null>(null);
  const [pureStats, setPureStats] = useState<PerformanceStats | null>(null);

  // ─── Feature 10: AI Narrator ───
  const [narratorEnabled, setNarratorEnabled] = useState(false);
  const [narration, setNarration] = useState<string | null>(null);
  const [narrationLoading, setNarrationLoading] = useState(false);
  const [narrationCol, setNarrationCol] = useState<number | null>(null);
  const narrationCache = useRef<Map<string, string>>(new Map());

  // ─── Feature 11: Auto-Calibration ───
  const [autoCalibrate, setAutoCalibrate] = useState(false);
  const [playerRating, setPlayerRating] = useState<PlayerRating>({
    score: 1000, gamesPlayed: 0, wins: 0, losses: 0
  });
  const gameStartMoveRef = useRef(0);

  // ─── Feature 12: PvP Player Names & Online ───
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');
  const [onlineRoomCode, setOnlineRoomCode] = useState<string>('');
  const [joinCodeInput, setJoinCodeInput] = useState<string>('');
  const [onlinePlayerColor, setOnlinePlayerColor] = useState<Player>(null);
  const [isRoomCreator, setIsRoomCreator] = useState(false);

  // ─── Effective depth (auto-calibration overrides slider) ───
  const effectiveDepth = autoCalibrate && gameMode === 'pvai'
    ? depthFromRating(playerRating.score)
    : depth;

  // ─── Reset Game ───
  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPlayer('RED');
    setStatus('PLAYING');
    setWinner(null);
    setMoveNumber(0);
    setWinningCells(null);
    setSearchTree(null);
    setPerformanceStats(null);
    setSelectedNode(null);
    setHistory([]);
    setReplayIndex(null);
    setIsReplaying(false);
    setReplayPlaying(false);
    setBookMoveBadge(null);
    setHeatmapData(null);
    setThreats([]);
    setPureTree(null);
    setPureStats(null);
    setNarration(null);
    setNarrationLoading(false);
    setNarrationCol(null);
    setCurrentIterativeDepth(undefined);
    setCurrentIterativeBestCol(undefined);
    
    // Reset online state if we change mode or reset completely
    if (gameMode !== 'online') {
      setOnlineRoomCode('');
      setOnlinePlayerColor(null);
      setIsRoomCreator(false);
    }
    
    gameStartMoveRef.current = moveNumber;
  }, [moveNumber, gameMode]);

  // ─── Check Terminal State ───
  const checkTerminalState = useCallback((currentBoard: BoardState, moveMadePlayer: Player): boolean => {
    if (checkWin(currentBoard, moveMadePlayer)) {
      setStatus('WIN');
      setWinner(moveMadePlayer);
      setWinningCells(getWinningCells(currentBoard));
      return true;
    }
    if (isBoardFull(currentBoard)) {
      setStatus('DRAW');
      return true;
    }
    return false;
  }, []);

  // ─── Feature 11: Update rating after game ends ───
  const updateRating = useCallback((gameWinner: Player, totalMoves: number) => {
    if (!autoCalibrate || gameMode !== 'pvai') return;
    setPlayerRating(prev => {
      let newScore = prev.score;
      let wins = prev.wins;
      let losses = prev.losses;
      if (gameWinner === 'RED') {
        newScore = Math.min(2000, prev.score + 50);
        wins++;
      } else if (gameWinner === 'YELLOW') {
        const penalty = totalMoves < 10 ? 30 : 15;
        newScore = Math.max(400, prev.score - penalty);
        losses++;
      }
      // Auto-update search depth based on new rating
      if (autoCalibrate) {
        setDepth(depthFromRating(newScore));
      }
      return { score: newScore, gamesPlayed: prev.gamesPlayed + 1, wins, losses };
    });
  }, [autoCalibrate, gameMode]);

  // ─── Feature 10: Fetch AI narration ───
  const fetchNarration = useCallback(async (
    col: number,
    detectedThreats: ThreatWindow[],
    stats: PerformanceStats | null,
    alternativeScores: { col: number; score: number }[]
  ) => {
    if (!narratorEnabled) return;

    setNarrationLoading(true);
    setNarrationCol(col);

    const cacheKey = `${col}-${detectedThreats.map(t => t.col).join(',')}-${stats?.nodesEvaluated ?? 0}`;
    if (narrationCache.current.has(cacheKey)) {
      setNarration(narrationCache.current.get(cacheKey)!);
      setNarrationLoading(false);
      return;
    }

    const isBlockingMove = detectedThreats.some(t => t.type === 'player-threat' && t.col === col);

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          chosenColumn: col,
          topAlternatives: alternativeScores.slice(0, 3),
          heuristicScore: stats ? stats.nodesEvaluated : 0,
          threats: detectedThreats.map(t => ({ type: t.type, col: t.col, label: t.label })),
          isBlockingMove,
          moveNumber,
        }),
      });
      const data = await res.json();
      const explanation = data.explanation as string;
      narrationCache.current.set(cacheKey, explanation);
      setNarration(explanation);
    } catch {
      setNarration('AI narration unavailable.');
    } finally {
      setNarrationLoading(false);
    }
  }, [narratorEnabled, moveNumber]);

  // ─── Post-AI-move processing (shared for both pvai and aivai) ───
  const handleAiMoveResult = useCallback((
    aiMove: number,
    newBoard: BoardState,
    tree: SearchNode,
    stats: PerformanceStats,
    isBookMove: boolean,
    bookMoveName?: string,
    currentMoveNum?: number
  ) => {
    const currentMv = currentMoveNum ?? moveNumber;

    setSearchTree(tree);
    setPerformanceStats(stats);

    // Feature 4: Book move badge
    if (isBookMove && bookMoveName) {
      setBookMoveBadge({ name: bookMoveName });
      setTimeout(() => setBookMoveBadge(null), 2500);
    } else {
      setBookMoveBadge(null);
    }

    // Feature 5: Heatmap
    if (showHeatmap) {
      setHeatmapData(computeHeatmap(newBoard));
    }

    // Feature 7: Threats
    const detectedThreats = detectThreats(newBoard);
    setThreats(detectedThreats);

    // Feature 8: Pruning graph stats
    setMoveStatsHistory(prev => [...prev, {
      move: currentMv,
      evaluated: stats.nodesEvaluated,
      pruned: stats.nodesPruned,
      depth: stats.searchDepth,
      time: stats.timeTakenMs,
      efficiency: stats.pruningEfficiency,
    }]);

    // Feature 10: AI narration
    const alternatives = tree.children
      .filter(c => !c.pruned && c.move !== aiMove)
      .map(c => ({ col: c.move as number, score: c.score }))
      .sort((a, b) => b.score - a.score);
    fetchNarration(aiMove, detectedThreats, stats, alternatives);

    // Feature 1: Store history entry
    setHistory(prev => [...prev, {
      board: newBoard,
      player: 'YELLOW',
      col: aiMove,
      moveNumber: currentMv,
      tree,
      stats,
      isBookMove,
      bookMoveName,
    }]);
  }, [moveNumber, showHeatmap, fetchNarration]);

  // ─── Player Move Handler ───
  const handleColumnClick = useCallback((colIndex: number) => {
    // In replay mode, clicking exits replay
    if (isReplaying) {
      setIsReplaying(false);
      setReplayIndex(null);
      return;
    }

    if (status !== 'PLAYING') return;

    if (gameMode === 'pvp') {
      // Feature 12: HvH mode
      if (!isValidMove(board, colIndex)) return;
      const playerDisc: Player = currentPlayer;
      const newBoard = makeMove(board, colIndex, playerDisc);
      setBoard(newBoard);
      const newMoveNum = moveNumber + 1;
      setMoveNumber(newMoveNum);

      setHistory(prev => [...prev, {
        board: newBoard, player: playerDisc, col: colIndex, moveNumber: newMoveNum,
        tree: null, stats: null
      }]);

      if (checkTerminalState(newBoard, playerDisc)) {
        updateRating(playerDisc, newMoveNum);
        return;
      }
      setCurrentPlayer(prev => prev === 'RED' ? 'YELLOW' : 'RED');
      return;
    }

    if (gameMode === 'online') {
      if (!onlineRoomCode || onlinePlayerColor !== currentPlayer) return;
      if (!isValidMove(board, colIndex)) return;

      // Optimistic upate
      const newBoard = makeMove(board, colIndex, onlinePlayerColor);
      setBoard(newBoard);
      const newMoveNum = moveNumber + 1;
      setMoveNumber(newMoveNum);

      setHistory(prev => [...prev, {
        board: newBoard, player: onlinePlayerColor, col: colIndex, moveNumber: newMoveNum,
        tree: null, stats: null
      }]);

      if (checkTerminalState(newBoard, onlinePlayerColor)) {
        updateRating(onlinePlayerColor, newMoveNum);
      } else {
        setCurrentPlayer(onlinePlayerColor === 'RED' ? 'YELLOW' : 'RED');
      }

      // Send to server
      fetch('/api/rooms/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: onlineRoomCode, col: colIndex, player: onlinePlayerColor })
      }).catch(e => console.error("Move failed to send", e));
      return;
    }

    // pvai: only RED (human) clicks
    if (currentPlayer !== 'RED') return;
    if (!isValidMove(board, colIndex)) return;

    const newBoard = makeMove(board, colIndex, 'RED');
    setBoard(newBoard);
    const newMoveNum = moveNumber + 1;
    setMoveNumber(newMoveNum);

    // Feature 7: Update threats after player move
    if (showThreats) setThreats(detectThreats(newBoard));

    setHistory(prev => [...prev, {
      board: newBoard, player: 'RED', col: colIndex, moveNumber: newMoveNum,
      tree: null, stats: null
    }]);

    if (checkTerminalState(newBoard, 'RED')) {
      updateRating('RED', newMoveNum);
      return;
    }

    setCurrentPlayer('YELLOW');
    setStatus('AI_THINKING');
  }, [status, currentPlayer, board, moveNumber, gameMode, isReplaying, showThreats, checkTerminalState, updateRating]);

  // ─── AI Move (pvai) ───
  useEffect(() => {
    if (gameMode !== 'pvai' || currentPlayer !== 'YELLOW' || status !== 'AI_THINKING') return;

    const timeoutId = setTimeout(async () => {
      try {
        let aiMove: number;
        let tree: SearchNode;
        let stats: PerformanceStats;
        let isBookMove = false;
        let bookMoveName: string | undefined;

        if (iterativeMode) {
          // Feature 6: Iterative deepening
          setCurrentIterativeDepth(1);
          const result = await iterativeDeepeningMinimax(
            board, effectiveDepth,
            (step) => {
              setCurrentIterativeDepth(step.depth);
              setCurrentIterativeBestCol(step.bestMove);
              setSearchTree(step.tree); // Live tree update per depth
            },
            150
          );
          aiMove = result.move;
          tree = result.tree;
          stats = result.stats;
          isBookMove = result.isBookMove;
          bookMoveName = result.bookMoveName;
          setCurrentIterativeDepth(effectiveDepth);
        } else {
          const result = getBestMoveMinimax(board, effectiveDepth);
          aiMove = result.move;
          tree = result.tree;
          stats = result.stats;
          isBookMove = result.isBookMove;
          bookMoveName = result.bookMoveName;
        }

        let finalMove = aiMove;
        if (finalMove === -1 || finalMove === null) {
          const valid = getValidMoves(board);
          if (valid.length > 0) finalMove = valid[0];
        }

        if (finalMove !== null && finalMove !== -1) {
          const newBoard = makeMove(board, finalMove, 'YELLOW');
          setBoard(newBoard);
          const newMoveNum = moveNumber + 1;
          setMoveNumber(newMoveNum);

          // Feature 9: Compare mode — also run pure minimax
          if (compareMode) {
            const pureResult = getBestMovePureMinimax(board, Math.min(effectiveDepth, 4));
            setPureTree(pureResult.tree);
            setPureStats(pureResult.stats);
          }

          handleAiMoveResult(finalMove, newBoard, tree, stats, isBookMove, bookMoveName, newMoveNum);

          if (!checkTerminalState(newBoard, 'YELLOW')) {
            setCurrentPlayer('RED');
            setStatus('PLAYING');
          } else {
            updateRating('YELLOW', newMoveNum);
          }
        }
      } catch (e) {
        console.error('AI computation error:', e);
        setCurrentPlayer('RED');
        setStatus('PLAYING');
      }
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [currentPlayer, status, board, effectiveDepth, gameMode, iterativeMode, compareMode, checkTerminalState, handleAiMoveResult, moveNumber, updateRating]);

  // ─── Feature 2: AI vs AI auto-play loop ───
  useEffect(() => {
    if (gameMode !== 'aivai' || status !== 'PLAYING') return;

    const timeoutId = setTimeout(async () => {
      try {
        if (status !== 'PLAYING') return;

        const currentAiPlayer: Player = currentPlayer ?? 'YELLOW';
        const playerDisc = currentAiPlayer;

        const d1 = Math.max(1, effectiveDepth);
        const d2 = Math.max(1, effectiveDepth - 2);
        const searchDepth = currentAiPlayer === 'YELLOW' ? d1 : d2;

        const result = getBestMoveMinimax(board, searchDepth);
        let aiMove = result.move;
        if (aiMove === -1 || aiMove === null) {
          const valid = getValidMoves(board);
          if (valid.length > 0) aiMove = valid[0];
        }

        if (aiMove !== null && aiMove !== -1) {
          const newBoard = makeMove(board, aiMove, playerDisc);
          setBoard(newBoard);
          const newMoveNum = moveNumber + 1;
          setMoveNumber(newMoveNum);
          setSearchTree(result.tree);
          setPerformanceStats(result.stats);
          setThreats(detectThreats(newBoard));

          setHistory(prev => [...prev, {
            board: newBoard, player: playerDisc, col: aiMove, moveNumber: newMoveNum,
            tree: result.tree, stats: result.stats
          }]);

          if (checkTerminalState(newBoard, playerDisc)) {
            if (playerDisc === 'YELLOW') {
              setAiVsAiWins(prev => ({ ...prev, yellow: prev.yellow + 1 }));
            } else {
              setAiVsAiWins(prev => ({ ...prev, red: prev.red + 1 }));
            }
            // Auto reset after 2s for continuous AI vs AI
            setTimeout(() => {
              setBoard(createEmptyBoard());
              setCurrentPlayer('YELLOW');
              setStatus('PLAYING');
              setWinner(null);
              setWinningCells(null);
              setMoveNumber(0);
            }, 2000);
          } else {
            setCurrentPlayer(prev => prev === 'RED' ? 'YELLOW' : 'RED');
          }
        }
      } catch (e) {
        console.error('AI vs AI error:', e);
      }
    }, aiVsAiDelay);

    return () => clearTimeout(timeoutId);
  }, [gameMode, status, board, currentPlayer, effectiveDepth, aiVsAiDelay, moveNumber, checkTerminalState]);

  // ─── Feature 1: Replay Auto-Play ───
  useEffect(() => {
    if (!replayPlaying) return;
    if (replayIndex === null || replayIndex >= history.length - 1) {
      setReplayPlaying(false);
      return;
    }

    replayTimerRef.current = setTimeout(() => {
      setReplayIndex(i => (i ?? 0) + 1);
    }, 1000);

    return () => {
      if (replayTimerRef.current) clearTimeout(replayTimerRef.current);
    };
  }, [replayPlaying, replayIndex, history.length]);

  // ─── Feature 1: Replay board state ───
  const replayEntry = replayIndex !== null ? history[replayIndex] : null;
  const displayBoard = isReplaying && replayEntry ? replayEntry.board : board;
  const displayTree = isReplaying && replayEntry ? replayEntry.tree : searchTree;
  const displayStats = isReplaying && replayEntry ? replayEntry.stats : performanceStats;

  // ─── Feature 1: Replay move cell for highlight ───
  const replayMoveCell = isReplaying && replayEntry
    ? (() => {
        // Find which cell was placed in the replay entry
        const prev = replayIndex! > 0 ? history[replayIndex! - 1].board : createEmptyBoard();
        for (let r = 0; r < 6; r++) {
          for (let c = 0; c < 7; c++) {
            if (prev[r][c] !== replayEntry.board[r][c]) return { r, c };
          }
        }
        return null;
      })()
    : null;

  // ─── Feature 12: Online Polling ───
  useEffect(() => {
    if (gameMode !== 'online' || !onlineRoomCode) return;

    const intervalId = setInterval(async () => {
      try {
        const res = await fetch(`/api/rooms?code=${onlineRoomCode}`);
        if (res.ok) {
          const roomData = await res.json();
          // Update game state from server if it advanced
          if (roomData.lastMoveNum > moveNumber) {
            setBoard(roomData.board);
            setCurrentPlayer(roomData.currentPlayer);
            setStatus(roomData.status);
            setWinner(roomData.winner);
            setMoveNumber(roomData.lastMoveNum);
            
            if (roomData.status === 'WIN') {
               setWinningCells(getWinningCells(roomData.board));
            }

            // Optional: determine which col was placed from diffing board
            // and add to history (simplified for now to just sync board)
          } else if (roomData.status === 'PLAYING' && status !== 'PLAYING') {
            // Room was reset by other player
            resetGame();
            setOnlineRoomCode(roomData.code);
            setOnlinePlayerColor(isRoomCreator ? 'RED' : 'YELLOW');
          }
        }
      } catch (e) {
        console.error('Polling error', e);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [gameMode, onlineRoomCode, moveNumber, resetGame, isRoomCreator, status]);

  // ─── Feature 12: Online Room Actions ───
  const createRoom = async () => {
    try {
      const res = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName: player1Name })
      });
      const data = await res.json();
      setOnlineRoomCode(data.code);
      setOnlinePlayerColor('RED');
      setIsRoomCreator(true);
      resetGame();
    } catch(e) {
      console.error(e);
    }
  };

  const joinRoom = async () => {
    if (!joinCodeInput) return;
    try {
      const res = await fetch('/api/rooms', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: joinCodeInput, playerName: player2Name })
      });
      if (res.ok) {
        const data = await res.json();
        setOnlineRoomCode(data.code);
        setOnlinePlayerColor('YELLOW');
        setIsRoomCreator(false);
        // Force sync
        setBoard(data.board);
        setCurrentPlayer(data.currentPlayer);
        setStatus(data.status);
        setMoveNumber(data.lastMoveNum);
      } else {
        alert("Room full or not found");
      }
    } catch(e) {
      console.error(e);
    }
  };

  // ─── Feature 8: CSV export ───
  const exportCSV = useCallback(() => {
    const header = 'Move,Evaluated,Pruned,Depth,Time(ms),Efficiency(%)';
    const rows = moveStatsHistory.map(s =>
      `${s.move},${s.evaluated},${s.pruned},${s.depth},${s.time.toFixed(1)},${s.efficiency}`
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'alphafour_stats.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [moveStatsHistory]);

  // ─── Determine status display ───
  const getStatusLabel = () => {
    if (gameMode === 'pvp') {
      const name = currentPlayer === 'RED' ? player1Name : player2Name;
      if (status === 'WIN') {
        return winner === 'RED' ? `${player1Name} wins!` : `${player2Name} wins!`;
      }
      return `${name}'s turn`;
    }
    return undefined; // StatusBar handles its own labels
  };

  return (
    <>
      {/* ═══ Top App Bar ═══ */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-14 bg-[#131313] border-b border-[#1C1B1B]">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-black tracking-tighter text-white font-headline uppercase">
            AlphaFour
          </Link>
          <nav className="hidden md:flex gap-1 font-headline text-[11px] uppercase font-bold tracking-wide">
            <Link href="/" className="text-[#919191] hover:bg-[#1C1B1B] px-3 py-1.5 transition-colors">Dashboard</Link>
            <Link href="/game" className="text-white bg-[#1C1B1B] px-3 py-1.5">Game</Link>
            <Link href="/theory" className="text-[#919191] hover:bg-[#1C1B1B] px-3 py-1.5 transition-colors">Theory</Link>
            <Link href="/settings" className="text-[#919191] hover:bg-[#1C1B1B] px-3 py-1.5 transition-colors">Settings</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {/* Feature 4: Book move badge */}
          {bookMoveBadge && (
            <div className="flex items-center gap-2 bg-white text-black px-3 py-1 text-[8px] font-mono uppercase font-bold tracking-widest animate-pulse">
              📖 Book: {bookMoveBadge.name}
            </div>
          )}
          {/* Feature 2: Mode badge */}
          <div className="text-[8px] font-mono uppercase tracking-widest text-[#474747] border border-[#1C1B1B] px-2 py-1">
            {gameMode === 'pvai' ? 'PvAI' : gameMode === 'aivai' ? 'AI×AI' : 'PvP'}
          </div>
          <div className="flex items-center gap-2 font-mono text-[9px] text-[#474747] uppercase tracking-widest">
            <span className={`w-1.5 h-1.5 ${status === 'AI_THINKING' ? 'bg-[#474747] animate-pulse' : 'bg-white'}`} />
            {status === 'AI_THINKING' ? 'COMPUTING' : status === 'WIN' ? 'GAME OVER' : 'READY'}
          </div>
        </div>
      </header>

      {/* ═══ Left Sidebar: Controls ═══ */}
      <aside className="fixed left-0 top-14 h-[calc(100vh-14px)] w-60 bg-[#0E0E0E] border-r border-[#1C1B1B] z-40 hidden lg:flex flex-col">
        <div className="p-6 border-b border-[#1C1B1B]">
          <div className="text-sm font-bold text-white font-headline uppercase tracking-[0.1em]">ALPHA_FOUR</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1 h-1 bg-white animate-pulse" />
            <span className="text-[8px] text-[#474747] font-mono tracking-widest uppercase">MINIMAX_ENGINE_ACTIVE</span>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="py-4 space-y-0.5 border-b border-[#1C1B1B]">
          <Link href="/" className="flex items-center gap-3 py-2.5 pl-6 text-[#474747] hover:text-[#919191] hover:bg-[#1C1B1B]/50 transition-all font-headline text-[10px] tracking-[0.1em] uppercase">
            <span className="material-symbols-outlined text-sm">insights</span>
            Analytics
          </Link>
          <Link href="/game" className="flex items-center gap-3 py-2.5 pl-5 text-white border-l-2 border-white bg-[#1C1B1B] font-bold font-headline text-[10px] tracking-[0.1em] uppercase">
            <span className="material-symbols-outlined text-sm">psychology</span>
            Neural Map
          </Link>
          <Link href="/theory" className="flex items-center gap-3 py-2.5 pl-6 text-[#474747] hover:text-[#919191] hover:bg-[#1C1B1B]/50 transition-all font-headline text-[10px] tracking-[0.1em] uppercase">
            <span className="material-symbols-outlined text-sm">menu_book</span>
            Theory
          </Link>
        </nav>

        {/* Controls */}
        <div className="flex-1 overflow-auto px-4 py-4 no-scrollbar">
          <ControlPanel
            depth={depth}
            setDepth={setDepth}
            prunedHidden={prunedHidden}
            setPrunedHidden={setPrunedHidden}
            treeDepth={treeDepth}
            setTreeDepth={setTreeDepth}
            gameMode={gameMode}
            setGameMode={setGameMode}
            aiVsAiDelay={aiVsAiDelay}
            setAiVsAiDelay={setAiVsAiDelay}
            aiVsAiRunning={status === 'PLAYING' && gameMode === 'aivai'}
            aiVsAiWins={aiVsAiWins}
            animationSpeed={animationSpeed}
            setAnimationSpeed={setAnimationSpeed}
            showHeatmap={showHeatmap}
            setShowHeatmap={setShowHeatmap}
            iterativeMode={iterativeMode}
            setIterativeMode={setIterativeMode}
            currentIterativeDepth={currentIterativeDepth}
            currentIterativeBestCol={currentIterativeBestCol}
            showThreats={showThreats}
            setShowThreats={setShowThreats}
            showPruningGraph={showPruningGraph}
            setShowPruningGraph={setShowPruningGraph}
            compareMode={compareMode}
            setCompareMode={setCompareMode}
            narratorEnabled={narratorEnabled}
            setNarratorEnabled={setNarratorEnabled}
            autoCalibrate={autoCalibrate}
            setAutoCalibrate={setAutoCalibrate}
            playerRating={playerRating}
            player1Name={player1Name}
            setPlayer1Name={setPlayer1Name}
            player2Name={player2Name}
            setPlayer2Name={setPlayer2Name}
          />
        </div>

        {/* Reset Button */}
        <div className="p-4 border-t border-[#1C1B1B]">
          <button
            onClick={resetGame}
            className="w-full bg-white text-black font-bold text-[9px] py-3 uppercase tracking-[0.2em] hover:bg-[#E5E2E1] transition-colors active:scale-[0.98]"
          >
            RESET_SIMULATION
          </button>
        </div>
      </aside>

      {/* ═══ Main Content: Game Board ═══ */}
      <main className={`lg:ml-60 pt-14 min-h-screen bg-[#050505] ${compareMode ? 'lg:mr-0' : 'lg:mr-80'}`}>
        <div className="flex flex-col items-center justify-start min-h-[calc(100vh-56px)] p-4 sm:p-6">

          {/* Status Bar */}
          <div className="w-full max-w-xl mb-4">
            {gameMode === 'online' && onlineRoomCode ? (
              <div className="bg-[#0E0E0E] border border-[#1C1B1B] px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-[#919191] font-mono uppercase tracking-widest">Room</span>
                  <span className="text-sm text-white font-mono uppercase bg-[#1C1B1B] px-3 py-1 font-bold tracking-widest border border-[#474747]">
                     {onlineRoomCode}
                  </span>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className={`flex flex-col items-center gap-1.5 transition-opacity duration-300 ${currentPlayer === 'RED' ? 'opacity-100' : 'opacity-20'}`}>
                    <div className="w-4 h-4 bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)] rounded-full" />
                    <span className="text-[9px] font-mono uppercase text-[#e63946] tracking-[0.1em] font-bold">{isRoomCreator ? 'You' : 'Opponent'}</span>
                  </div>
                  
                  <div className="text-[#474747] text-[10px] font-mono font-bold tracking-[0.2em] uppercase">
                    {status === 'WIN' ? 'Winner!' : status === 'DRAW' ? 'Draw' : 'VS'}
                  </div>
                  
                  <div className={`flex flex-col items-center gap-1.5 transition-opacity duration-300 ${currentPlayer === 'YELLOW' ? 'opacity-100' : 'opacity-20'}`}>
                    <div className="w-4 h-4 bg-[#f4a261] shadow-[0_0_8px_rgba(244,162,97,0.4)] rounded-full" />
                    <span className="text-[9px] font-mono uppercase text-[#f4a261] tracking-[0.1em] font-bold">{!isRoomCreator ? 'You' : 'Opponent'}</span>
                  </div>
                </div>
              </div>
            ) : gameMode === 'pvp' && getStatusLabel() ? (
              <div className="bg-[#0E0E0E] border border-[#1C1B1B] px-4 py-3 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase font-bold text-white tracking-widest">
                  {getStatusLabel()}
                </span>
                <span className="font-mono text-[8px] text-[#474747] uppercase tracking-widest">
                  Move: {moveNumber}
                </span>
              </div>
            ) : (
              <StatusBar
                status={status}
                winner={winner}
                moveNumber={moveNumber}
                onReset={resetGame}
              />
            )}
          </div>

          {/* Feature 1: Replay Timeline */}
          {history.length > 1 && (
            <div className="w-full max-w-xl mb-4 bg-[#0E0E0E] border border-[#1C1B1B] p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-[#474747]">
                  Replay Timeline
                  {isReplaying && replayIndex !== null && (
                    <span className="ml-2 text-white">— Move {replayIndex + 1}/{history.length}</span>
                  )}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (!isReplaying) { setIsReplaying(true); setReplayIndex(0); }
                      else { setReplayIndex(i => Math.max(0, (i ?? 0) - 1)); }
                    }}
                    className="text-[#474747] hover:text-white font-mono text-[8px] uppercase tracking-widest border border-[#1C1B1B] px-2 py-1 transition-colors"
                  >
                    ◀
                  </button>
                  <button
                    onClick={() => {
                      if (!isReplaying) { setIsReplaying(true); setReplayIndex(0); }
                      setReplayPlaying(p => !p);
                    }}
                    className={`font-mono text-[8px] uppercase tracking-widest border px-2 py-1 transition-colors ${
                      replayPlaying ? 'bg-white text-black border-white' : 'text-[#474747] hover:text-white border-[#1C1B1B]'
                    }`}
                  >
                    {replayPlaying ? '⏸' : '▶'}
                  </button>
                  <button
                    onClick={() => {
                      if (!isReplaying) { setIsReplaying(true); setReplayIndex(0); }
                      else { setReplayIndex(i => Math.min(history.length - 1, (i ?? 0) + 1)); }
                    }}
                    className="text-[#474747] hover:text-white font-mono text-[8px] uppercase tracking-widest border border-[#1C1B1B] px-2 py-1 transition-colors"
                  >
                    ▶▶
                  </button>
                  {isReplaying && (
                    <button
                      onClick={() => { setIsReplaying(false); setReplayIndex(null); setReplayPlaying(false); }}
                      className="text-white font-mono text-[8px] uppercase tracking-widest border border-white px-2 py-1"
                    >
                      Live
                    </button>
                  )}
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={history.length - 1}
                value={isReplaying ? (replayIndex ?? 0) : history.length - 1}
                onChange={e => {
                  setIsReplaying(true);
                  setReplayIndex(Number(e.target.value));
                  setReplayPlaying(false);
                }}
                className="w-full"
              />
            </div>
          )}

          {/* Connect 4 Board or Online Lobby */}
          <div className="w-full max-w-xl">
            {gameMode === 'online' && !onlineRoomCode ? (
              <div className="bg-[#0E0E0E] border border-[#1C1B1B] p-8 text-center space-y-6">
                <h3 className="text-white font-headline text-2xl uppercase tracking-wider">Online Multiplayer</h3>
                <p className="text-[#919191] font-mono text-xs">Play against someone on another device.</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#050505] border border-[#1C1B1B] p-4 flex flex-col items-center gap-3">
                     <span className="material-symbols-outlined text-white text-3xl">add_circle</span>
                     <button onClick={createRoom} className="w-full py-2 bg-white text-black font-bold font-mono text-xs uppercase hover:bg-gray-200">
                       Create Room
                     </button>
                  </div>
                  <div className="bg-[#050505] border border-[#1C1B1B] p-4 flex flex-col items-center gap-3">
                     <input 
                       value={joinCodeInput} 
                       onChange={e => setJoinCodeInput(e.target.value.toUpperCase())}
                       maxLength={4}
                       placeholder="CODE"
                       className="w-full bg-[#1C1B1B] text-white font-mono text-center text-lg p-2 focus:outline-none focus:ring-1 focus:ring-white uppercase"
                     />
                     <button onClick={joinRoom} className="w-full py-2 border border-white text-white font-bold font-mono text-xs uppercase hover:bg-white hover:text-black transition-colors">
                       Join Room
                     </button>
                  </div>
                </div>
              </div>
            ) : (
              <GameBoard
                board={displayBoard}
                onColumnClick={handleColumnClick}
                disabled={
                  isReplaying ||
                  status !== 'PLAYING' ||
                  (gameMode === 'pvai' && currentPlayer !== 'RED') ||
                  gameMode === 'aivai' ||
                  (gameMode === 'online' && currentPlayer !== onlinePlayerColor)
                }
                winningCells={winningCells}
                hoveredCol={hoveredCol}
                onColumnHover={setHoveredCol}
                replayMoveCell={replayMoveCell}
                heatmap={heatmapData}
                showHeatmap={showHeatmap}
                threats={threats}
                showThreats={showThreats}
              />
            )}
          </div>

          {/* Turn indicator */}
          <div className="mt-5 flex gap-12 items-center">
            {gameMode === 'online' && onlineRoomCode ? null /* Rendered in the top status bar now */ : gameMode === 'pvp' ? (
              <>
                <div className={`flex flex-col items-center gap-2 transition-opacity duration-300 ${currentPlayer === 'RED' && status === 'PLAYING' ? 'opacity-100' : 'opacity-20'}`}>
                  <div className="w-6 h-6 bg-white shadow-[0_0_12px_rgba(255,255,255,0.3)] rounded-full" />
                  <span className="text-[8px] font-mono uppercase text-[#919191] tracking-[0.2em] font-bold">{player1Name}</span>
                </div>
                <div className="text-[#262626] text-[10px] font-mono">VS</div>
                <div className={`flex flex-col items-center gap-2 transition-opacity duration-300 ${currentPlayer === 'YELLOW' && status === 'PLAYING' ? 'opacity-100' : 'opacity-20'}`}>
                  <div className="w-6 h-6 bg-[#404040] shadow-[0_0_12px_rgba(64,64,64,0.3)] rounded-full" />
                  <span className="text-[8px] font-mono uppercase text-[#919191] tracking-[0.2em] font-bold">{player2Name}</span>
                </div>
              </>
            ) : gameMode === 'aivai' ? (
              <>
                <div className={`flex flex-col items-center gap-2 transition-opacity duration-300 ${currentPlayer === 'YELLOW' && status === 'PLAYING' ? 'opacity-100' : 'opacity-20'}`}>
                  <div className="w-6 h-6 bg-white shadow-[0_0_12px_rgba(255,255,255,0.3)]" />
                  <span className="text-[8px] font-mono uppercase text-[#919191] tracking-[0.2em] font-bold">AI-1 (D{effectiveDepth})</span>
                </div>
                <div className="text-[#262626] text-[10px] font-mono">VS</div>
                <div className={`flex flex-col items-center gap-2 transition-opacity duration-300 ${currentPlayer === 'RED' && status === 'PLAYING' ? 'opacity-100' : 'opacity-20'}`}>
                  <div className="w-6 h-6 bg-[#404040] shadow-[0_0_12px_rgba(64,64,64,0.3)]" />
                  <span className="text-[8px] font-mono uppercase text-[#919191] tracking-[0.2em] font-bold">AI-2 (D{Math.max(1, effectiveDepth - 2)})</span>
                </div>
              </>
            ) : (
              <>
                <div className={`flex flex-col items-center gap-2 transition-opacity duration-300 ${currentPlayer === 'RED' ? 'opacity-100' : 'opacity-20'}`}>
                  <div className="w-6 h-6 bg-white shadow-[0_0_12px_rgba(255,255,255,0.3)]" />
                  <span className="text-[8px] font-mono uppercase text-[#919191] tracking-[0.2em] font-bold">You</span>
                </div>
                <div className="text-[#262626] text-[10px] font-mono">VS</div>
                <div className={`flex flex-col items-center gap-2 transition-opacity duration-300 ${currentPlayer === 'YELLOW' ? 'opacity-100' : 'opacity-20'}`}>
                  <div className="w-6 h-6 bg-[#404040] shadow-[0_0_12px_rgba(64,64,64,0.3)]" />
                  <span className="text-[8px] font-mono uppercase text-[#919191] tracking-[0.2em] font-bold">AI (D{effectiveDepth})</span>
                </div>
              </>
            )}
          </div>

          {/* Feature 10: AI Narrator speech bubble */}
          {narratorEnabled && (narrationLoading || narration) && (
            <div className="w-full max-w-xl mt-5">
              <SpeechBubble
                explanation={narration}
                loading={narrationLoading}
                chosenColumn={narrationCol}
                stats={displayStats}
              />
            </div>
          )}

          {/* Feature 8: Pruning Graph (inline below board when enabled) */}
          {showPruningGraph && (
            <div className="w-full max-w-xl mt-5 bg-[#0E0E0E] border border-[#1C1B1B] p-4">
              <PruningGraph
                history={moveStatsHistory}
                onReset={() => setMoveStatsHistory([])}
                onExport={exportCSV}
              />
            </div>
          )}

          {/* Mobile Controls */}
          <div className="lg:hidden mt-6 w-full max-w-xl space-y-4">
            <div className="bg-[#0E0E0E] border border-[#1C1B1B] p-4">
              <ControlPanel
                depth={depth}
                setDepth={setDepth}
                prunedHidden={prunedHidden}
                setPrunedHidden={setPrunedHidden}
                treeDepth={treeDepth}
                setTreeDepth={setTreeDepth}
                gameMode={gameMode}
                setGameMode={setGameMode}
                aiVsAiDelay={aiVsAiDelay}
                setAiVsAiDelay={setAiVsAiDelay}
                aiVsAiRunning={status === 'PLAYING' && gameMode === 'aivai'}
                aiVsAiWins={aiVsAiWins}
                animationSpeed={animationSpeed}
                setAnimationSpeed={setAnimationSpeed}
                showHeatmap={showHeatmap}
                setShowHeatmap={setShowHeatmap}
                iterativeMode={iterativeMode}
                setIterativeMode={setIterativeMode}
                currentIterativeDepth={currentIterativeDepth}
                currentIterativeBestCol={currentIterativeBestCol}
                showThreats={showThreats}
                setShowThreats={setShowThreats}
                showPruningGraph={showPruningGraph}
                setShowPruningGraph={setShowPruningGraph}
                compareMode={compareMode}
                setCompareMode={setCompareMode}
                narratorEnabled={narratorEnabled}
                setNarratorEnabled={setNarratorEnabled}
                autoCalibrate={autoCalibrate}
                setAutoCalibrate={setAutoCalibrate}
                playerRating={playerRating}
                player1Name={player1Name}
                setPlayer1Name={setPlayer1Name}
                player2Name={player2Name}
                setPlayer2Name={setPlayer2Name}
              />
            </div>
          </div>
        </div>
      </main>

      {/* ═══ Right Sidebar: Tree / Compare ═══ */}
      {!compareMode ? (
        <aside className="fixed right-0 top-14 h-[calc(100vh-14px)] w-80 bg-[#0E0E0E] border-l border-[#1C1B1B] z-40 hidden lg:flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-[#1C1B1B] flex items-center justify-between">
            <div>
              <h3 className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                Decision Tree
              </h3>
              <p className="text-[8px] text-[#474747] font-mono tracking-wider uppercase mt-0.5">
                {isReplaying ? `Replay — Move ${(replayIndex ?? 0) + 1}` : 'Minimax α-β Pruning'}
              </p>
            </div>
            <span className="material-symbols-outlined text-white text-lg animate-thinking">account_tree</span>
          </div>

          {/* Tree Visualization */}
          <div className="flex-1 overflow-auto p-4 no-scrollbar">
            <TreeVisualizer
              tree={displayTree}
              prunedHidden={prunedHidden}
              onNodeClick={setSelectedNode}
              maxDepthToShow={treeDepth}
              animationSpeed={animationSpeed}
            />
          </div>

          {/* Selected Node Details */}
          {selectedNode && (
            <div className="p-4 border-t border-[#1C1B1B] bg-[#050505]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[8px] font-bold text-[#919191] uppercase tracking-[0.2em]">
                  Node_Details
                </span>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-[#474747] hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined text-xs">close</span>
                </button>
              </div>
              <div className="font-mono text-[8px] space-y-1.5 uppercase">
                <div className="flex justify-between">
                  <span className="text-[#474747]">Type</span>
                  <span className="text-white">{selectedNode.isMax ? 'MAX (AI)' : 'MIN (Player)'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#474747]">Score</span>
                  <span className="text-white">{selectedNode.score >= 100000 ? '+∞' : selectedNode.score <= -100000 ? '-∞' : selectedNode.score}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#474747]">Column</span>
                  <span className="text-white">{selectedNode.move !== null ? `C${selectedNode.move}` : 'ROOT'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#474747]">α / β</span>
                  <span className="text-white">
                    {selectedNode.alpha === -Infinity ? '-∞' : selectedNode.alpha} / {selectedNode.beta === Infinity ? '∞' : selectedNode.beta}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#474747]">Visit #</span>
                  <span className="text-white">{selectedNode.visitOrder ?? '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#474747]">Children</span>
                  <span className="text-white">{selectedNode.children.length}</span>
                </div>
                {selectedNode.pruned && (
                  <div className="text-[#474747] italic">✂ This branch was pruned</div>
                )}
                {selectedNode.isBestPath && (
                  <div className="text-white font-bold">★ Best path node</div>
                )}
              </div>
            </div>
          )}

          {/* Stats Panel */}
          <div className="border-t border-[#1C1B1B]">
            {displayStats ? (
              <StatsPanel stats={displayStats} />
            ) : (
              <div className="p-4 text-[8px] font-mono text-[#262626] uppercase tracking-widest text-center">
                No computation data yet
              </div>
            )}
          </div>
        </aside>
      ) : (
        // Feature 9: Compare mode — full-width right panel
        <aside className="fixed right-0 top-14 h-[calc(100vh-14px)] w-[50vw] bg-[#0E0E0E] border-l border-[#1C1B1B] z-40 hidden lg:flex flex-col">
          <div className="p-4 border-b border-[#1C1B1B] flex items-center justify-between">
            <div>
              <h3 className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                Algorithm Comparison
              </h3>
              <p className="text-[8px] text-[#474747] font-mono tracking-wider uppercase mt-0.5">
                Pure Minimax vs Alpha-Beta Pruning
              </p>
            </div>
            <button
              onClick={() => setCompareMode(false)}
              className="text-[#474747] hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            <ComparePanel
              pureTree={pureTree}
              pureStats={pureStats}
              alphaBetaTree={searchTree}
              alphaBetaStats={performanceStats}
              prunedHidden={prunedHidden}
              onNodeClick={setSelectedNode}
            />
          </div>
        </aside>
      )}

      {/* ═══ Bottom Status Bar ═══ */}
      <footer className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 bg-[#0E0E0E] h-8 border-t border-[#1C1B1B] font-mono text-[9px] tracking-widest uppercase">
        <div className="flex items-center gap-2 text-[#474747]">
          <span className="material-symbols-outlined text-[10px]">memory</span>
          DEPTH: {effectiveDepth}
        </div>
        <div className="flex items-center gap-2 text-[#474747]">
          <span className="material-symbols-outlined text-[10px]">speed</span>
          {displayStats ? `${Math.round(displayStats.timeTakenMs)}MS` : 'IDLE'}
        </div>
        {/* Feature 11: Rating display */}
        {autoCalibrate && (
          <div className="flex items-center gap-2 text-[#919191]">
            <span className="material-symbols-outlined text-[10px]">trending_up</span>
            RATING: {playerRating.score}
          </div>
        )}
        <div className="flex items-center gap-2 text-white">
          <span className="material-symbols-outlined text-[10px]">check_circle</span>
          SYS: NOMINAL
        </div>
      </footer>
    </>
  );
}
