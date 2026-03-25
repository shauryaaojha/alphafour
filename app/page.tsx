"use client";
import Link from 'next/link';

export default function DashboardPage() {
  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-14 bg-[#131313] border-b border-[#1C1B1B]">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-black tracking-tighter text-white font-headline uppercase">AlphaFour</Link>
          <nav className="hidden md:flex gap-1 font-headline text-[11px] uppercase font-bold tracking-wide">
            <Link href="/" className="text-white bg-[#1C1B1B] px-3 py-1.5">Dashboard</Link>
            <Link href="/game" className="text-[#919191] hover:bg-[#1C1B1B] px-3 py-1.5 transition-colors">Game</Link>
            <Link href="/theory" className="text-[#919191] hover:bg-[#1C1B1B] px-3 py-1.5 transition-colors">Theory</Link>
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
          <h3 className="font-headline font-bold text-sm text-white tracking-[0.1em] uppercase">ALPHA_FOUR</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1 h-1 bg-white animate-pulse" />
            <p className="text-[8px] tracking-[0.1em] text-[#474747] uppercase font-mono">SYSTEM_ACTIVE</p>
          </div>
        </div>
        <nav className="flex-1 py-4 space-y-0.5">
          <Link href="/" className="text-white border-l-2 border-white pl-5 font-bold font-headline text-[10px] tracking-[0.1em] uppercase flex items-center gap-3 py-2.5 bg-[#1C1B1B]">
            <span className="material-symbols-outlined text-sm">insights</span>
            Analytics
          </Link>
          <Link href="/game" className="text-[#474747] pl-6 font-headline text-[10px] tracking-[0.1em] uppercase flex items-center gap-3 py-2.5 hover:text-[#919191] hover:bg-[#1C1B1B]/50 transition-all">
            <span className="material-symbols-outlined text-sm">psychology</span>
            Neural Map
          </Link>
          <Link href="/theory" className="text-[#474747] pl-6 font-headline text-[10px] tracking-[0.1em] uppercase flex items-center gap-3 py-2.5 hover:text-[#919191] hover:bg-[#1C1B1B]/50 transition-all">
            <span className="material-symbols-outlined text-sm">menu_book</span>
            Theory
          </Link>
          <Link href="/settings" className="text-[#474747] pl-6 font-headline text-[10px] tracking-[0.1em] uppercase flex items-center gap-3 py-2.5 hover:text-[#919191] hover:bg-[#1C1B1B]/50 transition-all">
            <span className="material-symbols-outlined text-sm">tune</span>
            Settings
          </Link>
        </nav>
        <div className="p-4 border-t border-[#1C1B1B]">
          <Link href="/game" className="w-full block text-center bg-white text-black font-bold text-[9px] py-3 uppercase tracking-[0.2em] hover:bg-[#E5E2E1] transition-colors active:scale-[0.98]">
            LAUNCH_GAME
          </Link>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="lg:ml-60 pt-14 pb-12 p-6 min-h-screen">
        <div className="max-w-6xl mx-auto py-8">
          {/* Hero Section */}
          <section className="mb-16">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.9] uppercase mb-6 font-headline">
              Connect 4 AI<br/>
              <span className="text-[#474747]">Minimax Visualizer</span>
            </h1>
            <p className="text-[#919191] text-sm max-w-xl leading-relaxed">
              Watch an AI think in real time. AlphaFour uses the Minimax algorithm with Alpha-Beta pruning to play Connect 4 optimally, and visualizes the entire decision tree so you can see exactly how it evaluates every possible future.
            </p>
            <Link href="/game" className="inline-flex items-center gap-3 mt-8 bg-white text-black font-bold text-[11px] px-8 py-4 uppercase tracking-[0.2em] hover:bg-[#E5E2E1] transition-colors active:scale-[0.98]">
              <span className="material-symbols-outlined text-lg" style={{fontVariationSettings: "'FILL' 1"}}>play_arrow</span>
              START PLAYING
            </Link>
          </section>

          {/* Stats Overview */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1C1B1B] mb-16 border border-[#1C1B1B]">
            <div className="bg-[#0E0E0E] p-6">
              <span className="block text-[9px] uppercase text-[#474747] font-bold tracking-[0.2em] mb-2">Algorithm</span>
              <span className="text-2xl font-headline font-black text-white">Minimax</span>
              <span className="block text-[9px] text-[#262626] uppercase tracking-widest mt-1">+ Alpha-Beta</span>
            </div>
            <div className="bg-[#0E0E0E] p-6">
              <span className="block text-[9px] uppercase text-[#474747] font-bold tracking-[0.2em] mb-2">Max Depth</span>
              <span className="text-2xl font-headline font-black text-white">8 <span className="text-[10px] text-[#474747] font-normal tracking-widest uppercase">ply</span></span>
            </div>
            <div className="bg-[#0E0E0E] p-6">
              <span className="block text-[9px] uppercase text-[#474747] font-bold tracking-[0.2em] mb-2">Pruning</span>
              <span className="text-2xl font-headline font-black text-white">~70<span className="text-[10px] text-[#474747] font-normal">%</span></span>
              <span className="block text-[9px] text-[#262626] uppercase tracking-widest mt-1">efficiency</span>
            </div>
            <div className="bg-[#0E0E0E] p-6">
              <span className="block text-[9px] uppercase text-[#474747] font-bold tracking-[0.2em] mb-2">Board</span>
              <span className="text-2xl font-headline font-black text-white">6×7</span>
              <span className="block text-[9px] text-[#262626] uppercase tracking-widest mt-1">42 positions</span>
            </div>
          </section>

          {/* Feature Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <FeatureCard
              icon="psychology"
              title="Intelligent AI"
              description="Minimax algorithm evaluates thousands of positions per second with Alpha-Beta pruning for optimal play."
              stat="O(b^(d/2))"
              statLabel="Complexity"
            />
            <FeatureCard
              icon="account_tree"
              title="Tree Visualization"
              description="See every node the AI explored: MAX/MIN labels, alpha-beta values, pruned branches, and the best path highlighted."
              stat="Real-time"
              statLabel="Rendering"
            />
            <FeatureCard
              icon="tune"
              title="Full Control"
              description="Adjust search depth from 1-8, toggle pruned branch visibility, and explore individual nodes by clicking."
              stat="1→8"
              statLabel="Depth Range"
            />
          </section>

          {/* Algorithm Preview */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7 bg-[#0E0E0E] border border-[#1C1B1B] p-8">
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-black text-[#1C1B1B]">01</span>
                <h2 className="text-sm font-bold text-white uppercase tracking-[0.15em]">How It Works</h2>
              </div>
              <div className="space-y-4 font-mono text-[10px] text-[#919191] uppercase tracking-wider">
                <div className="flex gap-4 items-start">
                  <span className="text-white font-bold shrink-0">STEP 1</span>
                  <span>You drop a disc → Board state updates</span>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-white font-bold shrink-0">STEP 2</span>
                  <span>AI receives the board → Minimax called at depth N</span>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-white font-bold shrink-0">STEP 3</span>
                  <span>MAX node (AI turn) → Maximizes score across children</span>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-white font-bold shrink-0">STEP 4</span>
                  <span>MIN node (Your turn) → Minimizes score (worst case)</span>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-white font-bold shrink-0">STEP 5</span>
                  <span>Alpha-Beta check → If β ≤ α, prune remaining branches</span>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-white font-bold shrink-0">STEP 6</span>
                  <span>Best column selected → Disc drops → Tree rendered</span>
                </div>
              </div>
            </div>
            <div className="md:col-span-5 bg-[#0E0E0E] border border-[#1C1B1B] p-8">
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-4xl font-black text-[#1C1B1B]">02</span>
                <h2 className="text-sm font-bold text-white uppercase tracking-[0.15em]">Syllabus Coverage</h2>
              </div>
              <div className="space-y-5">
                <SyllabusItem unit="Unit 1" topics="Problem space, toy problems, game tree, state formulation" />
                <SyllabusItem unit="Unit 2" topics="DFS/BFS, depth-limited search, tree traversal" />
                <SyllabusItem unit="Unit 3" topics="Minimax, alpha-beta pruning, adversarial search, intelligent agents" />
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Nav */}
      <footer className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 h-8 bg-[#0E0E0E] border-t border-[#1C1B1B]">
        <div className="flex items-center gap-2 text-[#474747] font-mono text-[9px] tracking-widest uppercase">
          <span className="material-symbols-outlined text-[10px]">terminal</span>
          AlphaFour v2.0
        </div>
        <div className="flex items-center gap-2 text-[#474747] font-mono text-[9px] tracking-widest uppercase">
          <span className="material-symbols-outlined text-[10px]">code</span>
          Next.js + TypeScript
        </div>
        <div className="flex items-center gap-2 text-white font-mono text-[9px] tracking-widest uppercase">
          <span className="material-symbols-outlined text-[10px]">check_circle</span>
          SYS: NOMINAL
        </div>
      </footer>

      {/* Floating Play Button */}
      <Link
        href="/game"
        className="fixed bottom-12 right-8 w-14 h-14 bg-white flex items-center justify-center text-black z-40 transition-transform hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.15)]"
      >
        <span className="material-symbols-outlined text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>play_arrow</span>
      </Link>
    </>
  );
}

function FeatureCard({ icon, title, description, stat, statLabel }: {
  icon: string;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
}) {
  return (
    <div className="bg-[#0E0E0E] border border-[#1C1B1B] p-6 group hover:border-[#474747] transition-colors">
      <span className="material-symbols-outlined text-white text-2xl mb-4 block" style={{fontVariationSettings: "'FILL' 0, 'wght' 200"}}>{icon}</span>
      <h3 className="text-xs font-bold text-white uppercase tracking-[0.15em] mb-2">{title}</h3>
      <p className="text-[10px] text-[#919191] leading-relaxed mb-4">{description}</p>
      <div className="flex items-end gap-2 pt-3 border-t border-[#1C1B1B]">
        <span className="text-lg font-headline font-black text-white">{stat}</span>
        <span className="text-[8px] text-[#474747] uppercase tracking-widest font-mono mb-0.5">{statLabel}</span>
      </div>
    </div>
  );
}

function SyllabusItem({ unit, topics }: { unit: string; topics: string }) {
  return (
    <div className="space-y-1">
      <div className="text-[9px] font-bold text-white uppercase tracking-[0.2em]">{unit}</div>
      <p className="text-[10px] text-[#919191] leading-relaxed">{topics}</p>
    </div>
  );
}
