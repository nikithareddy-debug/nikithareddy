/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="h-screen bg-[#0a0502] text-white font-sans overflow-hidden relative select-none flex flex-col min-h-screen">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#ff4e00] opacity-10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#00f2ff] opacity-10 blur-[150px]"></div>
      </div>

      {/* Main Layout Grid */}
      <div className="relative h-full flex flex-col p-4 md:p-8 gap-6 z-10 w-full max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="flex justify-between items-end border-b border-white/10 pb-4 shrink-0">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-200">
              NEON SYNTH // OS
            </h1>
            <p className="text-[10px] md:text-xs font-mono text-white/40 uppercase tracking-widest mt-1 italic">Experimental Audio-Visual Unit 01</p>
          </div>
        </header>

        {/* Center Body */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 grid-rows-[1fr_auto] min-h-0">
          <section className="col-span-1 lg:col-span-8 xl:col-span-9 relative flex items-center justify-center animate-in fade-in zoom-in duration-700 min-h-0 min-w-0">
            <SnakeGame />
          </section>
          
          <MusicPlayer />
        </main>
      </div>
    </div>
  );
}

