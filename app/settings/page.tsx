"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const [centerControl, setCenterControl] = useState(74);
  const [sequenceStrength, setSequenceStrength] = useState(92);
  const [adjacency, setAdjacency] = useState(45);
  const [maxDepth, setMaxDepth] = useState(8);
  const [searchTimeout, setSearchTimeout] = useState(1.5);
  const [alphaBetaEnabled, setAlphaBetaEnabled] = useState(true);
  const [showNodeScores, setShowNodeScores] = useState(true);
  const [animateTree, setAnimateTree] = useState(true);
  const [highlightPruning, setHighlightPruning] = useState(false);

  return (
    <>
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 h-14 bg-[#131313] border-b border-[#1C1B1B]">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-black tracking-tighter text-white font-headline uppercase">AlphaFour</Link>
          <nav className="hidden md:flex gap-1 font-headline text-[11px] uppercase font-bold tracking-wide">
            <Link href="/" className="text-[#919191] hover:bg-[#1C1B1B] px-3 py-1.5 transition-colors">Dashboard</Link>
            <Link href="/game" className="text-[#919191] hover:bg-[#1C1B1B] px-3 py-1.5 transition-colors">Game</Link>
            <Link href="/theory" className="text-[#919191] hover:bg-[#1C1B1B] px-3 py-1.5 transition-colors">Theory</Link>
            <Link href="/settings" className="text-white bg-[#1C1B1B] px-3 py-1.5">Settings</Link>
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
          <Link href="/theory" className="text-[#474747] pl-6 font-headline text-[10px] tracking-[0.1em] uppercase flex items-center gap-3 py-2.5 hover:text-[#919191] hover:bg-[#1C1B1B]/50 transition-all">
            <span className="material-symbols-outlined text-sm">menu_book</span>
            Theory
          </Link>
          <Link href="/settings" className="text-white border-l-2 border-white pl-5 font-bold font-headline text-[10px] tracking-[0.1em] uppercase flex items-center gap-3 py-2.5 bg-[#1C1B1B]">
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
      <main className="lg:ml-60 pt-14 pb-12 px-6 md:px-8 min-h-screen bg-[#050505]">
        <div className="max-w-5xl mx-auto py-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-headline text-4xl md:text-5xl font-black tracking-tighter text-white uppercase">Settings</h1>
            <p className="text-[#474747] font-mono text-[10px] tracking-[0.2em] mt-2 uppercase">System Configuration / AI Parameters</p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Heuristic Weightings */}
              <section className="bg-[#0E0E0E] p-6 border border-[#1C1B1B]">
                <div className="flex items-center mb-6 border-b border-[#1C1B1B] pb-4">
                  <span className="material-symbols-outlined text-white mr-3 text-sm">psychology</span>
                  <h2 className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-white">Heuristic Weightings</h2>
                </div>
                <div className="space-y-8">
                  <SliderSetting label="Center Control" value={centerControl} onChange={setCenterControl} hint="Prioritizes center column occupancy" />
                  <SliderSetting label="Sequence Strength" value={sequenceStrength} onChange={setSequenceStrength} hint="Evaluates connected disc patterns" />
                  <SliderSetting label="Adjacency" value={adjacency} onChange={setAdjacency} hint="Measures defensive density" />
                </div>
              </section>

              {/* Search Parameters */}
              <section className="bg-[#0E0E0E] p-6 border border-[#1C1B1B]">
                <div className="flex items-center mb-6 border-b border-[#1C1B1B] pb-4">
                  <span className="material-symbols-outlined text-white mr-3 text-sm">radar</span>
                  <h2 className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-white">Search Parameters</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-3">
                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#919191]">Max Depth</label>
                        <span className="font-mono text-white text-[10px]">{maxDepth} PLY</span>
                      </div>
                      <input className="w-full" max="8" min="1" type="range" value={maxDepth} onChange={e => setMaxDepth(Number(e.target.value))} />
                    </div>
                    <div>
                      <div className="flex justify-between mb-3">
                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#919191]">Search Timeout</label>
                        <span className="font-mono text-white text-[10px]">{searchTimeout.toFixed(1)} SEC</span>
                      </div>
                      <input className="w-full" max="5.0" min="0.1" step="0.1" type="range" value={searchTimeout} onChange={e => setSearchTimeout(Number(e.target.value))} />
                    </div>
                  </div>
                  <div className="flex flex-col justify-center bg-[#131313] p-5 border border-[#1C1B1B]">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white block">Alpha-Beta Pruning</span>
                        <span className="text-[8px] text-[#474747] font-mono tracking-widest uppercase mt-1">Efficiency Mode</span>
                      </div>
                      <ToggleSwitch checked={alphaBetaEnabled} onChange={setAlphaBetaEnabled} />
                    </div>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 space-y-6">
              {/* AI Profile */}
              <section className="bg-[#0E0E0E] p-6 border border-[#1C1B1B] flex flex-col items-center justify-center text-center relative overflow-hidden h-56">
                <div className="absolute inset-0 opacity-5 pointer-events-none" style={{backgroundImage: "radial-gradient(circle at 50% 50%, #FFFFFF 0%, transparent 70%)"}} />
                <div className="relative z-10">
                  <div className="w-24 h-24 mb-4 mx-auto flex items-center justify-center relative">
                    <div className="absolute inset-0 border border-[#1C1B1B] animate-[spin_20s_linear_infinite]" />
                    <div className="absolute inset-3 border border-[#262626] animate-[spin_15s_linear_reverse_infinite]" />
                    <span className="material-symbols-outlined text-4xl text-white" style={{fontVariationSettings: "'FILL' 0, 'wght' 200"}}>hub</span>
                  </div>
                  <h3 className="font-headline font-bold uppercase tracking-[0.2em] text-white text-[10px]">MINIMAX_ENGINE</h3>
                  <p className="font-mono text-[8px] text-[#262626] mt-2 tracking-[0.2em] uppercase">Adversarial Search Core</p>
                </div>
              </section>

              {/* Interface Visuals */}
              <section className="bg-[#0E0E0E] p-6 border border-[#1C1B1B] space-y-4">
                <div className="flex items-center mb-2 border-b border-[#1C1B1B] pb-4">
                  <span className="material-symbols-outlined text-white mr-3 text-sm">visibility</span>
                  <h2 className="font-headline text-[10px] font-bold uppercase tracking-[0.2em] text-white">Interface Visuals</h2>
                </div>
                <ToggleRow label="Show Node Scores" checked={showNodeScores} onChange={setShowNodeScores} />
                <ToggleRow label="Animate Tree Search" checked={animateTree} onChange={setAnimateTree} />
                <ToggleRow label="Highlight Pruning" checked={highlightPruning} onChange={setHighlightPruning} />
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <footer className="fixed bottom-0 left-0 w-full z-50 h-8 bg-[#0E0E0E] border-t border-[#1C1B1B] flex justify-around items-center px-4 font-mono text-[9px] tracking-widest uppercase">
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

function SliderSetting({ label, value, onChange, hint }: {
  label: string; value: number; onChange: (v: number) => void; hint: string;
}) {
  return (
    <div>
      <div className="flex justify-between mb-3">
        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#919191]">{label}</label>
        <span className="font-mono text-white text-[10px] tracking-widest">{value}%</span>
      </div>
      <input className="w-full" max="100" min="0" type="range" value={value} onChange={e => onChange(Number(e.target.value))} />
      <p className="text-[8px] text-[#262626] mt-2 uppercase tracking-wider">{hint}</p>
    </div>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-10 h-5 border transition-all relative ${
        checked ? 'bg-white border-white' : 'bg-[#050505] border-[#474747]'
      }`}
    >
      <span className={`absolute top-[3px] w-3 h-3 transition-all ${
        checked ? 'left-[22px] bg-black' : 'left-[3px] bg-white'
      }`} />
    </button>
  );
}

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-4 bg-[#131313] border border-[#1C1B1B] hover:border-[#474747] transition-colors cursor-pointer group"
         onClick={() => onChange(!checked)}>
      <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#C6C6C6] group-hover:text-white transition-colors">{label}</span>
      <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
  );
}
