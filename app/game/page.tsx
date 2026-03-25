"use client";
import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Player, BoardState, SearchNode, PerformanceStats, GameStatus } from '../lib/types';
import { createEmptyBoard, makeMove, getValidMoves, isValidMove, checkWin, isBoardFull, getWinningCells } from '../lib/board';
import { getBestMoveMinimax } from '../lib/minimax';
import GameBoard from '../components/GameBoard';
import StatusBar from '../components/StatusBar';
import TreeVisualizer from '../components/TreeVisualizer';
import StatsPanel from '../components/StatsPanel';
import ControlPanel from '../components/ControlPanel';

export default function GamePage() {
  // ─── Game State ───
  const [board, setBoard] = useState<BoardState>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>('RED');
  const [status, setStatus] = useState<GameStatus>('PLAYING');
  const [winner, setWinner] = useState<Player>(null);
  const [moveNumber, setMoveNumber] = useState(0);
  const [winningCells, setWinningCells] = useState<{ r: number; c: number }[] | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);

  // ─── AI & Visualization State ───
  const [depth, setDepth] = useState(5);
  const [treeDepth, setTreeDepth] = useState(3);
  const [searchTree, setSearchTree] = useState<SearchNode | null>(null);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats | null>(null);
  const [prunedHidden, setPrunedHidden] = useState(false);
  const [selectedNode, setSelectedNode] = useState<SearchNode | null>(null);

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
  }, []);

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

  // ─── Player Move Handler ───
  const handleColumnClick = useCallback((colIndex: number) => {
    if (status !== 'PLAYING' || currentPlayer !== 'RED') return;
    if (!isValidMove(board, colIndex)) return;

    const newBoard = makeMove(board, colIndex, 'RED');
    setBoard(newBoard);
    setMoveNumber(m => m + 1);

    if (checkTerminalState(newBoard, 'RED')) return;

    setCurrentPlayer('YELLOW');
    setStatus('AI_THINKING');
  }, [status, currentPlayer, board, checkTerminalState]);

  // ─── AI Move (runs when it's AI's turn) ───
  useEffect(() => {
    if (currentPlayer !== 'YELLOW' || status !== 'AI_THINKING') return;

    const timeoutId = setTimeout(() => {
      try {
        const { move, tree, stats } = getBestMoveMinimax(board, depth);

        let aiMove = move;
        if (aiMove === -1 || aiMove === null) {
          const valid = getValidMoves(board);
          if (valid.length > 0) aiMove = valid[0];
        }

        if (aiMove !== null && aiMove !== -1) {
          const newBoard = makeMove(board, aiMove, 'YELLOW');
          setBoard(newBoard);
          setSearchTree(tree);
          setPerformanceStats(stats);
          setMoveNumber(m => m + 1);

          if (!checkTerminalState(newBoard, 'YELLOW')) {
            setCurrentPlayer('RED');
            setStatus('PLAYING');
          }
        }
      } catch (e) {
        console.error('AI computation error:', e);
        setCurrentPlayer('RED');
        setStatus('PLAYING');
      }
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [currentPlayer, status, board, depth, checkTerminalState]);

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
        <div className="flex items-center gap-2">
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
        <nav className="py-4 space-y-0.5">
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
          <Link href="/settings" className="flex items-center gap-3 py-2.5 pl-6 text-[#474747] hover:text-[#919191] hover:bg-[#1C1B1B]/50 transition-all font-headline text-[10px] tracking-[0.1em] uppercase">
            <span className="material-symbols-outlined text-sm">tune</span>
            Settings
          </Link>
        </nav>

        {/* Controls */}
        <div className="flex-1 overflow-auto px-6 py-4 border-t border-[#1C1B1B]">
          <ControlPanel
            depth={depth}
            setDepth={setDepth}
            prunedHidden={prunedHidden}
            setPrunedHidden={setPrunedHidden}
            treeDepth={treeDepth}
            setTreeDepth={setTreeDepth}
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
      <main className="lg:ml-60 lg:mr-80 pt-14 min-h-screen bg-[#050505]">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] p-4 sm:p-6">
          {/* Status Bar */}
          <div className="w-full max-w-xl mb-4">
            <StatusBar
              status={status}
              winner={winner}
              moveNumber={moveNumber}
              onReset={resetGame}
            />
          </div>

          {/* Connect 4 Board */}
          <div className="w-full max-w-xl">
            <GameBoard
              board={board}
              onColumnClick={handleColumnClick}
              disabled={status !== 'PLAYING' || currentPlayer !== 'RED'}
              winningCells={winningCells}
              hoveredCol={hoveredCol}
              onColumnHover={setHoveredCol}
            />
          </div>

          {/* Turn Indicator */}
          <div className="mt-6 flex gap-12 items-center">
            <div className={`flex flex-col items-center gap-2 transition-opacity duration-300 ${currentPlayer === 'RED' ? 'opacity-100' : 'opacity-20'}`}>
              <div className="w-6 h-6 bg-white shadow-[0_0_12px_rgba(255,255,255,0.3)]" />
              <span className="text-[8px] font-mono uppercase text-[#919191] tracking-[0.2em] font-bold">You</span>
            </div>
            <div className="text-[#262626] text-[10px] font-mono">VS</div>
            <div className={`flex flex-col items-center gap-2 transition-opacity duration-300 ${currentPlayer === 'YELLOW' ? 'opacity-100' : 'opacity-20'}`}>
              <div className="w-6 h-6 bg-[#404040] shadow-[0_0_12px_rgba(64,64,64,0.3)]" />
              <span className="text-[8px] font-mono uppercase text-[#919191] tracking-[0.2em] font-bold">AI</span>
            </div>
          </div>

          {/* Mobile Controls (shown on small screens) */}
          <div className="lg:hidden mt-6 w-full max-w-xl space-y-4">
            <div className="bg-[#0E0E0E] border border-[#1C1B1B] p-4">
              <ControlPanel
                depth={depth}
                setDepth={setDepth}
                prunedHidden={prunedHidden}
                setPrunedHidden={setPrunedHidden}
                treeDepth={treeDepth}
                setTreeDepth={setTreeDepth}
              />
            </div>
          </div>
        </div>
      </main>

      {/* ═══ Right Sidebar: Tree Visualization ═══ */}
      <aside className="fixed right-0 top-14 h-[calc(100vh-14px)] w-80 bg-[#0E0E0E] border-l border-[#1C1B1B] z-40 hidden lg:flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#1C1B1B] flex items-center justify-between">
          <div>
            <h3 className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              Decision Tree
            </h3>
            <p className="text-[8px] text-[#474747] font-mono tracking-wider uppercase mt-0.5">
              Minimax α-β Pruning
            </p>
          </div>
          <span className="material-symbols-outlined text-white text-lg animate-thinking">account_tree</span>
        </div>

        {/* Tree Visualization */}
        <div className="flex-1 overflow-auto p-4 no-scrollbar">
          <TreeVisualizer
            tree={searchTree}
            prunedHidden={prunedHidden}
            onNodeClick={setSelectedNode}
            maxDepthToShow={treeDepth}
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
          {performanceStats ? (
            <StatsPanel stats={performanceStats} />
          ) : (
            <div className="p-4 text-[8px] font-mono text-[#262626] uppercase tracking-widest text-center">
              No computation data yet
            </div>
          )}
        </div>
      </aside>

      {/* ═══ Bottom Status Bar ═══ */}
      <footer className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 bg-[#0E0E0E] h-8 border-t border-[#1C1B1B] font-mono text-[9px] tracking-widest uppercase">
        <div className="flex items-center gap-2 text-[#474747]">
          <span className="material-symbols-outlined text-[10px]">memory</span>
          DEPTH: {depth}
        </div>
        <div className="flex items-center gap-2 text-[#474747]">
          <span className="material-symbols-outlined text-[10px]">speed</span>
          {performanceStats ? `${Math.round(performanceStats.timeTakenMs)}MS` : 'IDLE'}
        </div>
        <div className="flex items-center gap-2 text-white">
          <span className="material-symbols-outlined text-[10px]">check_circle</span>
          SYS: NOMINAL
        </div>
      </footer>
    </>
  );
}
