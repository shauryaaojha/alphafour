"use client";
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } }
};

export default function TheoryPage() {
  return (
    <>
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#050505]">
        {/* Animated Background Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#4361ee]/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#e63946]/10 blur-[120px] rounded-full animate-trigger" />
      </div>

      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-14 bg-[#131313]/90 backdrop-blur-md border-b border-[#1C1B1B]">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-black tracking-tighter text-white font-headline uppercase">AlphaFour</Link>
          <nav className="hidden md:flex gap-1 font-headline text-[11px] uppercase font-bold tracking-wide">
            <Link href="/" className="text-[#919191] hover:bg-[#1C1B1B] px-3 py-1.5 transition-colors">Dashboard</Link>
            <Link href="/game" className="text-[#919191] hover:bg-[#1C1B1B] px-3 py-1.5 transition-colors">Game</Link>
            <Link href="/theory" className="text-white bg-[#1C1B1B] px-3 py-1.5 border border-[#474747] shadow-[0_0_15px_rgba(255,255,255,0.1)]">Theory</Link>
            <Link href="/settings" className="text-[#919191] hover:bg-[#1C1B1B] px-3 py-1.5 transition-colors">Settings</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 text-[#474747] hover:text-white hover:bg-[#1C1B1B] transition-colors">
            <span className="material-symbols-outlined text-lg">school</span>
          </button>
        </div>
      </header>

      {/* SideNavBar */}
      <aside className="fixed left-0 top-14 h-[calc(100vh-56px)] w-60 bg-[#0E0E0E]/80 backdrop-blur-md border-r border-[#1C1B1B] hidden lg:flex flex-col z-40">
        <div className="p-6 border-b border-[#1C1B1B]">
          <div className="text-sm font-bold text-white font-headline uppercase tracking-[0.1em]">ALPHA_FOUR</div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1 h-1 bg-[#06d6a0] animate-pulse" />
            <span className="text-[8px] text-[#474747] font-mono tracking-widest uppercase">EDU_MODE_ACTIVE</span>
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
          <Link href="/theory" className="text-white border-l-2 border-[#4361ee] pl-5 font-bold font-headline text-[10px] tracking-[0.1em] uppercase flex items-center gap-3 py-2.5 bg-[#4361ee]/10">
            <span className="material-symbols-outlined text-sm text-[#4361ee]">menu_book</span>
            Theory
          </Link>
        </nav>
        <div className="p-4 border-t border-[#1C1B1B]">
          <Link href="/game" className="w-full block text-center bg-[#4361ee] text-white font-bold text-[9px] py-3 uppercase tracking-[0.2em] hover:bg-[#324CD9] transition-colors shadow-[0_0_20px_rgba(67,97,238,0.3)]">
            LAUNCH_GAME
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-60 pt-14 pb-12 min-h-screen overflow-y-auto">
        <motion.div 
          className="max-w-5xl mx-auto p-6 md:p-12 space-y-24"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Hero Section */}
          <motion.section variants={fadeInUp} className="space-y-6 border-b border-[#1C1B1B] pb-16 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9IiMzMzMiLz48L3N2Zz4=')] opacity-30 z-[-1]" />
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-[#7b7b9e] leading-[0.9] uppercase font-headline">
              Algorithm<br/>Visualization
            </h1>
            <p className="text-[#919191] text-base md:text-lg max-w-2xl leading-relaxed font-light">
              The complete theoretical foundation for the Minimax algorithm with Alpha-Beta pruning, visually explained for adversarial game environments.
            </p>
          </motion.section>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
            {/* Left Column: Primary Content */}
            <div className="md:col-span-8 space-y-28">
              
              {/* 1. Problem Space */}
              <motion.section variants={fadeInUp} className="space-y-8 relative">
                <div className="absolute -left-12 top-2 text-8xl font-black text-[#1C1B1B]/40 z-[-1] select-none">01</div>
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-[0.15em] border-b-2 border-white inline-block pb-2">Problem Space & Complexity</h2>
                </div>
                <p className="text-[#C6C6C6] leading-relaxed text-sm">
                  Connect 4 has a state-space complexity of approximately <span className="text-[#06d6a0] font-mono font-bold bg-[#06d6a0]/10 px-2 py-0.5 rounded">4.5 × 10¹³</span> legal positions. The board is a 6×7 grid with a branching factor of up to 7, making exhaustive search intractable without algorithmic optimization.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-[#0E0E0E] border border-[#1C1B1B] rounded-xl hover:border-[#4361ee]/50 transition-colors shadow-lg">
                    <div className="text-[28px] text-white font-black mb-1">O(7⁶)</div>
                    <div className="text-[10px] text-[#7b7b9e] font-mono uppercase tracking-widest">Complexity (No Pruning)</div>
                    <div className="mt-3 text-xs text-[#919191] border-t border-[#1C1B1B] pt-3">≈ 117,649 nodes evaluated to reach depth 6.</div>
                  </div>
                  <div className="p-6 bg-[#0E0E0E] border border-[#1C1B1B] rounded-xl hover:border-[#06d6a0]/50 transition-colors shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#06d6a0]/10 blur-xl" />
                    <div className="text-[28px] text-[#06d6a0] font-black mb-1">O(7³)</div>
                    <div className="text-[10px] text-[#7b7b9e] font-mono uppercase tracking-widest">With Alpha-Beta</div>
                    <div className="mt-3 text-xs text-[#919191] border-t border-[#1C1B1B] pt-3">≈ 343 nodes (best-case ordering). Massive computation savings.</div>
                  </div>
                </div>
              </motion.section>

              {/* 2. Minimax Algorithm */}
              <motion.section variants={fadeInUp} className="space-y-8 relative">
                <div className="absolute -left-12 top-2 text-8xl font-black text-[#1C1B1B]/40 z-[-1] select-none">02</div>
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-[0.15em] border-b-2 border-white inline-block pb-2">The Minimax Algorithm</h2>
                </div>
                <p className="text-[#C6C6C6] leading-relaxed text-sm">
                  Minimax computes the optimal move in a zero-sum game. It alternates between a MAX player (AI) fighting for the highest score, and a MIN player (opponent) driving the score to the lowest possible value.
                </p>
                <div className="flex bg-[#0E0E0E] rounded-xl border border-[#1C1B1B] overflow-hidden shadow-2xl">
                  <div className="w-1/2 p-8 border-r border-[#1C1B1B] relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#f4a261] to-transparent" />
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-6 h-6 rounded bg-[#f4a261] shadow-[0_0_10px_rgba(244,162,97,0.5)] flex items-center justify-center font-mono text-[9px] text-black font-bold">MAX</div>
                      <div className="text-xs font-black text-white uppercase tracking-widest">Maximizer (AI)</div>
                    </div>
                    <p className="text-xs text-[#919191] leading-relaxed">Selects the move with the highest guaranteed score. Assumes the opponent will always play their absolute best response.</p>
                  </div>
                  <div className="w-1/2 p-8 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#4361ee] to-transparent" />
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-6 h-6 rounded bg-[#4361ee] shadow-[0_0_10px_rgba(67,97,238,0.5)] flex items-center justify-center font-mono text-[9px] text-white font-bold">MIN</div>
                      <div className="text-xs font-black text-white uppercase tracking-widest">Minimizer (Human)</div>
                    </div>
                    <p className="text-xs text-[#919191] leading-relaxed">Simulates the opponent choosing the worst possible outcome for the AI. Forces the AI to plan defensively.</p>
                  </div>
                </div>
              </motion.section>

              {/* 3. Alpha-Beta Pruning */}
              <motion.section variants={fadeInUp} className="space-y-8 relative">
                 <div className="absolute -left-12 top-2 text-8xl font-black text-[#1C1B1B]/40 z-[-1] select-none">03</div>
                <div>
                  <h2 className="text-xl font-bold text-[#06d6a0] uppercase tracking-[0.15em] border-b-2 border-[#06d6a0] inline-block pb-2">Alpha-Beta Pruning</h2>
                </div>
                <p className="text-[#C6C6C6] leading-relaxed text-sm">
                  Alpha-Beta pruning completely eliminates branches that cannot possibly influence the final decision. This doesn't just approximate; it yields the <b>exact same move</b> as pure Minimax, but dramatically faster.
                </p>
                <div className="bg-[#0E0E0E] rounded-xl border border-[#1C1B1B] p-8 shadow-lg">
                  <div className="flex flex-col items-center justify-center mb-8 gap-6">
                    <div className="flex gap-4 items-center">
                      <div className="px-3 py-1 bg-[#262626] rounded text-[#06d6a0] font-mono text-xs font-bold border border-[#06d6a0]/30 shadow-[0_0_15px_rgba(6,214,160,0.1)]">
                        α (Alpha): Best MIN value guaranteed to MAX
                      </div>
                      <div className="px-3 py-1 bg-[#262626] rounded text-[#e63946] font-mono text-xs font-bold border border-[#e63946]/30 shadow-[0_0_15px_rgba(230,57,70,0.1)]">
                        β (Beta): Best MAX value guaranteed to MIN
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8 bg-[#131313] px-8 py-6 rounded-xl border border-[#1C1B1B]">
                       <div className="text-3xl font-black text-white font-mono tracking-widest">β ≤ α</div>
                       <div className="h-0.5 w-12 bg-white/20 relative"><div className="absolute right-0 top-[-4px] w-0 h-0 border-t-[5px] border-b-[5px] border-l-[8px] border-t-transparent border-b-transparent border-l-white/50"></div></div>
                       <div className="px-6 py-2 bg-[#e63946] text-white font-black uppercase tracking-[0.2em] rounded animate-pulse shadow-[0_0_20px_rgba(230,57,70,0.4)]">
                         PRUNE BRANCH
                       </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-[#4361ee]/5 border-l-4 border-[#4361ee] rounded-r text-sm text-[#C6C6C6] italic tracking-wide">
                    &ldquo;If the opponent already has a better move elsewhere in the tree, they will never allow play to reach this state. We can stop evaluating this entire branch immediately.&rdquo;
                  </div>
                </div>
              </motion.section>

              {/* 4. Heuristic Evaluation */}
              <motion.section variants={fadeInUp} className="space-y-8 relative">
                <div className="absolute -left-12 top-2 text-8xl font-black text-[#1C1B1B]/40 z-[-1] select-none">04</div>
                <div>
                  <h2 className="text-xl font-bold text-white uppercase tracking-[0.15em] border-b-2 border-white inline-block pb-2">Heuristic Evaluation</h2>
                </div>
                <p className="text-[#C6C6C6] leading-relaxed text-sm">
                  At the depth limit, the game isn't over. We use a heuristic function to statically evaluate the board position, assigning numerical values to threatening patterns.
                </p>
                <div className="bg-[#131313] rounded-xl border border-[#1C1B1B] overflow-hidden shadow-2xl">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#0E0E0E] border-b border-[#1C1B1B]">
                        <th className="text-left p-5 text-[#7b7b9e] font-headline uppercase tracking-[0.2em] text-[10px]">Board Pattern</th>
                        <th className="text-right p-5 text-[#7b7b9e] font-headline uppercase tracking-[0.2em] text-[10px]">Score Weight</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#C6C6C6]">
                      <tr className="border-b border-[#1C1B1B]/50 hover:bg-[#1C1B1B]/50 transition-colors">
                        <td className="p-5 flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#06d6a0] shadow-[0_0_8px_#06d6a0]"/> AI absolute victory (4 in a row)</td>
                        <td className="text-right p-5 font-mono text-[#06d6a0] font-bold">+ 100,000</td>
                      </tr>
                      <tr className="border-b border-[#1C1B1B]/50 hover:bg-[#1C1B1B]/50 transition-colors">
                        <td className="p-5 flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-[#e63946] shadow-[0_0_8px_#e63946]"/> Human victory (4 in a row)</td>
                        <td className="text-right p-5 font-mono text-[#e63946] font-bold">- 100,000</td>
                      </tr>
                      <tr className="border-b border-[#1C1B1B]/50 hover:bg-[#1C1B1B]/50 transition-colors">
                        <td className="p-5">AI 3-in-a-row (open end)</td>
                        <td className="text-right p-5 font-mono text-white">+ 10</td>
                      </tr>
                      <tr className="border-b border-[#1C1B1B]/50 hover:bg-[#1C1B1B]/50 transition-colors">
                        <td className="p-5">Human 3-in-a-row (open end)</td>
                        <td className="text-right p-5 font-mono text-[#e63946]">- 10</td>
                      </tr>
                      <tr className="hover:bg-[#1C1B1B]/50 transition-colors">
                        <td className="p-5">Strategic Center Control (per disc)</td>
                        <td className="text-right p-5 font-mono text-white">+ 3</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.section>
            </div>

            {/* Right Column: Viva Q&A */}
            <div className="md:col-span-4">
              <div className="sticky top-24 space-y-8">
                {/* Visual Graphic */}
                <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-xl border border-[#4361ee]/30 p-6 shadow-[0_10px_30px_rgba(67,97,238,0.15)] relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10">
                     <span className="material-symbols-outlined text-8xl">account_tree</span>
                   </div>
                   <h3 className="text-[14px] font-black text-white mb-2 tracking-[0.2em] uppercase font-headline">Key Metrics</h3>
                   <div className="space-y-4 mt-6 font-mono text-[11px]">
                    <div className="flex justify-between items-center bg-[#050505]/50 px-3 py-2 rounded"><span className="text-[#919191]">Board</span><span className="text-[#06d6a0] font-bold">6 × 7</span></div>
                    <div className="flex justify-between items-center bg-[#050505]/50 px-3 py-2 rounded"><span className="text-[#919191]">Max Branch</span><span className="text-white">7</span></div>
                    <div className="flex justify-between items-center bg-[#050505]/50 px-3 py-2 rounded"><span className="text-[#919191]">D6 Eval (No Prune)</span><span className="text-[#e63946]">~117,649</span></div>
                    <div className="flex justify-between items-center bg-[#050505]/50 px-3 py-2 rounded"><span className="text-[#919191]">Avg Pruning %</span><span className="text-[#4361ee] font-bold shadow-sm">65 - 75%</span></div>
                  </div>
                </div>

                {/* Viva Prep */}
                <div className="bg-[#0E0E0E]/80 backdrop-blur rounded-xl border border-[#1C1B1B] p-8 shadow-xl">
                  <h3 className="text-[11px] font-black text-white mb-8 flex items-center gap-3 tracking-[0.2em] uppercase border-b border-[#1C1B1B] pb-4">
                    <span className="material-symbols-outlined text-lg text-[#f4a261]">lightbulb</span>
                    Key Takeaways
                  </h3>
                  <div className="space-y-2">
                    <QAItem
                      q="What is Minimax?"
                      a="A recursive algorithm that explores all future game states, assuming the opponent plays perfectly, and selects the move with the highest guaranteed score."
                    />
                    <div className="h-px w-full bg-[#1C1B1B]" />
                    <QAItem
                      q="What is Alpha-Beta Pruning?"
                      a="An optimization that terminates evaluation of branches which cannot possibly affect the AI's final move choice, yielding extreme computational savings."
                    />
                    <div className="h-px w-full bg-[#1C1B1B]" />
                    <QAItem
                      q="Why are we building a tree?"
                      a="Connect 4 is a 'fully observable' adversarial environment. We can map every possible future outcome as paths in a state-space tree (Unit 2, Trees/Graphs)."
                    />
                    <div className="h-px w-full bg-[#1C1B1B]" />
                    <QAItem
                      q="Can the AI be beaten?"
                      a="At depth 7+, the AI plays near-perfectly block-for-block. At lower depths, humans can trick it by exploiting gaps in its heuristic evaluation."
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
}

function QAItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div 
      className="group cursor-pointer border border-transparent hover:border-[#4361ee]/30 hover:bg-[#4361ee]/5 p-3 rounded-lg transition-all"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between">
        <p className="text-[12px] font-black text-white uppercase tracking-wider transition-colors">
          {q}
        </p>
        <span 
          className={`material-symbols-outlined text-[#4361ee] text-sm transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
        >
          expand_more
        </span>
      </div>
      <motion.div 
        initial={false} 
        animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }} 
        className="overflow-hidden"
      >
        <p className="text-xs text-[#919191] leading-relaxed pt-3">
          {a}
        </p>
      </motion.div>
    </div>
  );
}
