"use client";
import Link from 'next/link';

export default function TheoryPage() {
  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-14 bg-[#131313] border-b border-[#1C1B1B]">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-black tracking-tighter text-white font-headline uppercase">AlphaFour</Link>
          <nav className="hidden md:flex gap-1 font-headline text-[11px] uppercase font-bold tracking-wide">
            <Link href="/" className="text-[#919191] hover:bg-[#1C1B1B] px-3 py-1.5 transition-colors">Dashboard</Link>
            <Link href="/game" className="text-[#919191] hover:bg-[#1C1B1B] px-3 py-1.5 transition-colors">Game</Link>
            <Link href="/theory" className="text-white bg-[#1C1B1B] px-3 py-1.5">Theory</Link>
            <Link href="/settings" className="text-[#919191] hover:bg-[#1C1B1B] px-3 py-1.5 transition-colors">Settings</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-[#474747] hover:text-white hover:bg-[#1C1B1B] transition-colors">
            <span className="material-symbols-outlined text-lg">account_circle</span>
          </button>
        </div>
      </header>

      {/* SideNavBar */}
      <aside className="fixed left-0 top-14 h-[calc(100vh-56px)] w-60 bg-[#0E0E0E] border-r border-[#1C1B1B] hidden lg:flex flex-col">
        <div className="p-6 border-b border-[#1C1B1B]">
          <div className="text-sm font-bold text-white font-headline uppercase tracking-[0.1em]">ALPHA_FOUR</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1 h-1 bg-white animate-pulse" />
            <span className="text-[8px] text-[#474747] font-mono tracking-widest uppercase">SYSTEM_ACTIVE</span>
          </div>
        </div>
        <nav className="flex-1 py-4 space-y-0.5">
          <Link href="/" className="text-[#474747] pl-6 font-headline text-[10px] tracking-[0.1em] uppercase flex items-center gap-3 py-2.5 hover:text-[#919191] hover:bg-[#1C1B1B]/50 transition-all">
            <span className="material-symbols-outlined text-sm">insights</span>
            Analytics
          </Link>
          <Link href="/game" className="text-[#474747] pl-6 font-headline text-[10px] tracking-[0.1em] uppercase flex items-center gap-3 py-2.5 hover:text-[#919191] hover:bg-[#1C1B1B]/50 transition-all">
            <span className="material-symbols-outlined text-sm">psychology</span>
            Neural Map
          </Link>
          <Link href="/theory" className="text-white border-l-2 border-white pl-5 font-bold font-headline text-[10px] tracking-[0.1em] uppercase flex items-center gap-3 py-2.5 bg-[#1C1B1B]">
            <span className="material-symbols-outlined text-sm">menu_book</span>
            Theory
          </Link>
          <Link href="/settings" className="text-[#474747] pl-6 font-headline text-[10px] tracking-[0.1em] uppercase flex items-center gap-3 py-2.5 hover:text-[#919191] hover:bg-[#1C1B1B]/50 transition-all">
            <span className="material-symbols-outlined text-sm">tune</span>
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-[#1C1B1B]">
          <Link href="/game" className="w-full block text-center bg-white text-black font-bold text-[9px] py-3 uppercase tracking-[0.2em] hover:bg-[#E5E2E1] transition-colors">
            LAUNCH_GAME
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-60 pt-14 pb-12 min-h-screen overflow-y-auto">
        <div className="max-w-5xl mx-auto p-6 md:p-12 space-y-16">
          {/* Hero Section */}
          <section className="space-y-6 border-b border-[#1C1B1B] pb-12">
            <div className="inline-block px-3 py-1 border border-[#262626] text-[#474747] text-[9px] font-mono uppercase tracking-[0.2em]">
              DOCUMENTATION / VIVA PREP
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[0.9] uppercase font-headline">
              Algorithm<br/>Documentation
            </h1>
            <p className="text-[#919191] text-sm max-w-xl leading-relaxed">
              Complete theoretical foundation for the Minimax algorithm with Alpha-Beta pruning in adversarial game environments.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            {/* Left Column: Primary Content */}
            <div className="md:col-span-8 space-y-20">
              {/* 1. Problem Space */}
              <section className="space-y-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black text-[#1C1B1B]">01</span>
                  <h2 className="text-sm font-bold text-white uppercase tracking-[0.15em]">Problem Space & Complexity</h2>
                </div>
                <p className="text-[#C6C6C6] leading-relaxed text-sm">
                  Connect 4 has a state-space complexity of approximately <span className="text-white font-mono">4.5 × 10¹³</span> legal positions. The board is a 6×7 grid with a branching factor of up to 7, making exhaustive search intractable without optimization.
                </p>
                <div className="p-6 bg-[#0E0E0E] border-l-2 border-white font-mono text-[10px] text-[#919191] uppercase tracking-widest space-y-2">
                  <div>Game Tree Depth: 42 (Max Moves)</div>
                  <div>Branching Factor: 7 (Columns)</div>
                  <div>Without Pruning: O(7⁶) ≈ 117,649 nodes at depth 6</div>
                  <div>With Alpha-Beta: O(7³) ≈ 343 nodes (best case)</div>
                </div>
              </section>

              {/* 2. Minimax Algorithm */}
              <section className="space-y-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black text-[#1C1B1B]">02</span>
                  <h2 className="text-sm font-bold text-white uppercase tracking-[0.15em]">Minimax Algorithm</h2>
                </div>
                <p className="text-[#C6C6C6] leading-relaxed text-sm">
                  Minimax is a recursive backtracking algorithm for two-player zero-sum games. It builds a game tree where the MAX player (AI) maximizes the score and the MIN player (opponent) minimizes it.
                </p>
                <div className="grid grid-cols-2 gap-px bg-[#1C1B1B] border border-[#1C1B1B]">
                  <div className="p-6 bg-[#0E0E0E]">
                    <div className="text-[9px] font-black text-white uppercase tracking-widest mb-3">Maximizer (AI)</div>
                    <p className="text-[10px] text-[#919191] leading-relaxed">Selects the move with the highest guaranteed score. Represents optimal AI play.</p>
                  </div>
                  <div className="p-6 bg-[#0E0E0E]">
                    <div className="text-[9px] font-black text-white uppercase tracking-widest mb-3">Minimizer (Player)</div>
                    <p className="text-[10px] text-[#919191] leading-relaxed">Simulates the opponent choosing the worst possible outcome for the AI.</p>
                  </div>
                </div>
                <div className="p-6 bg-[#0E0E0E] border border-[#1C1B1B] font-mono text-[10px] text-[#C6C6C6] leading-relaxed whitespace-pre-wrap">{`function minimax(board, depth, isMax):
  if depth == 0 or game over:
    return heuristic(board)
  
  if isMax:
    best = -∞
    for each move:
      score = minimax(child, depth-1, false)
      best = max(best, score)
    return best
  else:
    best = +∞
    for each move:
      score = minimax(child, depth-1, true)
      best = min(best, score)
    return best`}</div>
              </section>

              {/* 3. Alpha-Beta Pruning */}
              <section className="space-y-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black text-[#1C1B1B]">03</span>
                  <h2 className="text-sm font-bold text-white uppercase tracking-[0.15em]">Alpha-Beta Pruning</h2>
                </div>
                <p className="text-[#C6C6C6] leading-relaxed text-sm">
                  Alpha-Beta pruning eliminates branches that cannot influence the final decision. Alpha (α) is the best score MAX is guaranteed. Beta (β) is the best score MIN is guaranteed. When β ≤ α, the branch is pruned.
                </p>
                <div className="bg-[#0E0E0E] border border-[#1C1B1B] p-6">
                  <div className="flex gap-16 justify-center mb-6">
                    <div className="w-16 h-16 border border-white flex items-center justify-center text-[9px] tracking-tighter font-mono text-white">MAX</div>
                    <div className="w-16 h-16 border border-[#474747] flex items-center justify-center text-[9px] tracking-tighter text-[#474747] font-mono relative">
                      PRUNED
                      <div className="absolute inset-0 flex items-center justify-center opacity-20">
                        <div className="w-full h-[1px] bg-white rotate-45" />
                        <div className="w-full h-[1px] bg-white -rotate-45 absolute" />
                      </div>
                    </div>
                  </div>
                  <div className="font-mono text-[10px] text-white tracking-[0.2em] uppercase text-center">
                    Condition: β ≤ α → PRUNE
                  </div>
                </div>
                <div className="p-6 border-l-2 border-white bg-[#0E0E0E]">
                  <p className="text-xs text-[#C6C6C6] italic tracking-wide">
                    &ldquo;Pruning does not change the result of minimax; it ignores branches that cannot influence the final decision. In the best case, it reduces complexity from O(b^d) to O(b^(d/2)).&rdquo;
                  </p>
                </div>
              </section>

              {/* 4. Heuristic Function */}
              <section className="space-y-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black text-[#1C1B1B]">04</span>
                  <h2 className="text-sm font-bold text-white uppercase tracking-[0.15em]">Heuristic Evaluation</h2>
                </div>
                <p className="text-[#C6C6C6] leading-relaxed text-sm">
                  The heuristic function estimates how favorable a board position is without playing to completion. It scores patterns in horizontal, vertical, and diagonal directions.
                </p>
                <div className="bg-[#0E0E0E] border border-[#1C1B1B]">
                  <table className="w-full font-mono text-[10px]">
                    <thead>
                      <tr className="border-b border-[#1C1B1B]">
                        <th className="text-left p-4 text-[#474747] uppercase tracking-widest text-[9px]">Condition</th>
                        <th className="text-right p-4 text-[#474747] uppercase tracking-widest text-[9px]">Score</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#C6C6C6]">
                      <tr className="border-b border-[#1C1B1B]/50"><td className="p-4">AI wins (4 in a row)</td><td className="text-right p-4 text-white font-bold">+100,000</td></tr>
                      <tr className="border-b border-[#1C1B1B]/50"><td className="p-4">Player wins (4 in a row)</td><td className="text-right p-4 text-white font-bold">-100,000</td></tr>
                      <tr className="border-b border-[#1C1B1B]/50"><td className="p-4">AI 3-in-a-row + open end</td><td className="text-right p-4">+10</td></tr>
                      <tr className="border-b border-[#1C1B1B]/50"><td className="p-4">AI 2-in-a-row + 2 open</td><td className="text-right p-4">+3</td></tr>
                      <tr className="border-b border-[#1C1B1B]/50"><td className="p-4">Player 3-in-a-row + open</td><td className="text-right p-4">-10</td></tr>
                      <tr><td className="p-4">AI disc in center column</td><td className="text-right p-4">+3</td></tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>

            {/* Right Column: Viva Q&A */}
            <div className="md:col-span-4 space-y-8">
              <div className="sticky top-20 space-y-8">
                {/* Viva Prep */}
                <div className="bg-[#0E0E0E] border border-[#1C1B1B] p-6">
                  <h3 className="text-[10px] font-black text-white mb-6 flex items-center gap-2 tracking-[0.2em] uppercase">
                    <span className="material-symbols-outlined text-sm">quiz</span>
                    VIVA PREP
                  </h3>
                  <div className="space-y-8">
                    <QAItem
                      q="What is Minimax?"
                      a="A recursive algorithm that explores all future game states and picks the move with the best guaranteed outcome."
                    />
                    <QAItem
                      q="What is Alpha-Beta?"
                      a="An optimization that prunes branches which cannot affect the final decision, cutting ~70% of evaluations."
                    />
                    <QAItem
                      q="What is a heuristic?"
                      a="A scoring function that estimates how good a board position is without playing to completion."
                    />
                    <QAItem
                      q="Why Connect 4?"
                      a="Classic adversarial toy problem that directly maps to Unit 1, 2, and 3 syllabus topics."
                    />
                    <QAItem
                      q="Time complexity?"
                      a="Without pruning: O(b^d). With alpha-beta best case: O(b^(d/2)). b=7, d=depth."
                    />
                    <QAItem
                      q="Can the AI be beaten?"
                      a="At depth 7+, the AI plays near-perfectly. At lower depths, skilled players can exploit heuristic gaps."
                    />
                  </div>
                </div>

                {/* Key Numbers */}
                <div className="bg-[#0E0E0E] border border-[#1C1B1B] p-6">
                  <h3 className="text-[10px] font-black text-[#474747] uppercase tracking-[0.2em] mb-4">Key Numbers</h3>
                  <div className="space-y-3 font-mono text-[9px]">
                    <div className="flex justify-between"><span className="text-[#474747]">Board</span><span className="text-white">6 × 7</span></div>
                    <div className="flex justify-between"><span className="text-[#474747]">Max Branch</span><span className="text-white">7</span></div>
                    <div className="flex justify-between"><span className="text-[#474747]">Depth 6 (no prune)</span><span className="text-white">~117,649</span></div>
                    <div className="flex justify-between"><span className="text-[#474747]">Depth 6 (best)</span><span className="text-white">~343</span></div>
                    <div className="flex justify-between"><span className="text-[#474747]">Avg Pruning</span><span className="text-white">65-75%</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <footer className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 bg-[#0E0E0E] border-t border-[#1C1B1B] h-8 font-mono text-[9px] tracking-widest uppercase">
        <div className="text-[#474747] flex items-center gap-2">
          <span className="material-symbols-outlined text-[10px]">terminal</span>
          AlphaFour v2.0
        </div>
        <div className="text-white flex items-center gap-2">
          <span className="material-symbols-outlined text-[10px]">check_circle</span>
          SYS: NOMINAL
        </div>
      </footer>
    </>
  );
}

function QAItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold text-white uppercase tracking-wide">{q}</p>
      <p className="text-[10px] text-[#919191] leading-relaxed">{a}</p>
    </div>
  );
}
