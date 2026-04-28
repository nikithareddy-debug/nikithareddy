import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Dreams (AI Gen 1)',
    artist: 'SoundHelix Algo',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '6:12',
  },
  {
    id: 2,
    title: 'Cyber Grid (AI Gen 2)',
    artist: 'SoundHelix Algo',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '7:05',
  },
  {
    id: 3,
    title: 'Synthetic Waves (AI Gen 3)',
    artist: 'SoundHelix Algo',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '5:44',
  },
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(console.error);
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (audioRef.current) {
      const duration = audioRef.current.duration;
      audioRef.current.currentTime = (value / 100) * duration;
      setProgress(value);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />
      {/* Left Sidebar: Playlist */}
      <aside className="col-span-1 lg:col-span-4 xl:col-span-3 flex flex-col gap-4 overflow-y-auto">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 h-full flex flex-col">
          <h2 className="text-xs font-mono text-white/50 uppercase tracking-widest mb-4 shrink-0">Now Playing Queue</h2>
          <div className="space-y-3 flex-1 overflow-y-auto min-h-0">
            {TRACKS.map((track, i) => {
              const isCurrent = i === currentTrackIndex;
              return (
                <div 
                  key={track.id}
                  onClick={() => { setCurrentTrackIndex(i); setIsPlaying(true); }}
                  className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer ${
                    isCurrent 
                      ? 'bg-orange-500/20 border border-orange-500/30' 
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className={`shrink-0 w-10 h-10 rounded flex items-center justify-center font-bold text-xs ${
                    isCurrent ? 'bg-orange-500 text-black' : 'bg-white/10 text-white/60 italic underline'
                  }`}>
                    {(i + 1).toString().padStart(2, '0')}
                  </div>
                  <div className="min-w-0">
                    <div className={`text-sm font-semibold truncate ${isCurrent ? 'text-orange-200' : 'text-white/80'}`}>
                      {track.title}
                    </div>
                    <div className="text-[10px] text-white/40 uppercase truncate">
                      {track.artist} &bull; {track.duration}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 shrink-0 p-4 border border-white/5 bg-black/40 rounded-xl">
             <div className="text-[10px] text-white/30 uppercase tracking-widest flex justify-between mb-2">
               <span>Audio State</span>
               <span className="text-cyan-400">{isPlaying ? "ACTIVE" : "STANDBY"}</span>
             </div>
             <div className="h-4 flex items-end">
               {isPlaying ? (
                 <div className="flex gap-1 items-end h-full w-full opacity-50">
                   <div className="flex-1 bg-cyan-400 animate-[bounce_1s_infinite] h-full shadow-[0_0_8px_#00f2ff]"></div>
                   <div className="flex-1 bg-cyan-400 animate-[bounce_0.8s_infinite] h-2/3 shadow-[0_0_8px_#00f2ff]"></div>
                   <div className="flex-1 bg-cyan-400 animate-[bounce_1.2s_infinite] h-4/5 shadow-[0_0_8px_#00f2ff]"></div>
                   <div className="flex-1 bg-cyan-400 animate-[bounce_0.9s_infinite] h-full shadow-[0_0_8px_#00f2ff]"></div>
                   <div className="flex-1 bg-cyan-400 animate-[bounce_1.1s_infinite] h-1/2 shadow-[0_0_8px_#00f2ff]"></div>
                 </div>
               ) : (
                 <div className="w-full h-[2px] bg-white/10"></div>
               )}
             </div>
          </div>
        </div>
      </aside>

      {/* Bottom Player Controls */}
      <footer className="col-span-1 lg:col-span-12 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl p-4 md:p-6 flex flex-col md:flex-row items-center gap-6 mt-auto">
        {/* Song Details */}
        <div className="w-full md:w-48 xl:w-64 text-center md:text-left shrink-0">
          <div className="text-sm font-bold text-white leading-none truncate">{currentTrack.title}</div>
          <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1 truncate">By {currentTrack.artist}</div>
        </div>

        {/* Playback UI */}
        <div className="flex-1 flex flex-col gap-2 w-full">
          <div className="flex items-center justify-center gap-8">
            <button onClick={handlePrev} className="text-white/40 hover:text-white transition-colors">
              <SkipBack size={20} />
            </button>
            <button 
              onClick={togglePlay}
              className="w-12 h-12 rounded-full border border-orange-500/50 flex items-center justify-center bg-orange-500/20 text-orange-500 shadow-[0_0_20px_rgba(255,78,0,0.2)] text-xl hover:bg-orange-500 hover:text-black transition-all"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>
            <button onClick={handleNext} className="text-white/40 hover:text-white transition-colors">
              <SkipForward size={20} />
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-mono text-white/30 w-8 text-right">
              {audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}
            </span>
            <div className="flex-1 h-1 bg-white/10 rounded-full relative group flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleProgressChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div 
                className="absolute left-0 h-1 bg-orange-500 shadow-[0_0_10px_rgba(255,78,0,0.5)] rounded-full transition-all duration-100 ease-linear pointer-events-none"
                style={{ width: `${progress}%` }}
              ></div>
              <div 
                className="absolute w-3 h-3 bg-white rounded-full border-2 border-orange-500 transition-all duration-100 ease-linear group-hover:scale-125 pointer-events-none"
                style={{ left: `calc(${progress}% - 6px)` }}
              ></div>
            </div>
            <span className="text-[10px] font-mono text-white/30 w-8">
              {currentTrack.duration}
            </span>
          </div>
        </div>

        {/* Volume & Utility */}
        <div className="w-full md:w-48 xl:w-64 flex items-center justify-center md:justify-end gap-3 shrink-0 hidden sm:flex">
          <button 
            onClick={toggleMute}
            className="p-2 text-white/40 hover:text-cyan-400 transition-colors"
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <div className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-white/40 text-[10px] hover:bg-white/5 transition-colors cursor-pointer">
            GEAR
          </div>
        </div>
      </footer>
    </>
  );
}
