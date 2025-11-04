import { useState, useEffect, useRef } from "react";
import { tracks } from "../data/tracks";
import Sidebar from "../components/Sidebar";
import { Play, Pause, SkipForward, Volume2, Radio, Music } from "lucide-react";

export default function RadioPage() {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef(null);
  const prevTrackRef = useRef(null);

  // biramo novu pesmu nasumično ali ne istu kao prethodnu
  const getRandomTrack = () => {
    if (tracks.length === 0) return null;

    let nextTrack;
    do {
      nextTrack = tracks[Math.floor(Math.random() * tracks.length)];
    } while (nextTrack === prevTrackRef.current && tracks.length > 1);

    prevTrackRef.current = nextTrack;
    return nextTrack;
  };

  const playNext = () => {
    const next = getRandomTrack();
    setCurrentTrack(next);
    setIsPlaying(true);
  };

  // kad se mountuje komponenta — pusti prvu pesmu
  useEffect(() => {
    playNext();
  }, []);

  // kontrola audio plejer-a
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;
    
    audioRef.current.volume = volume;
    
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack, volume]);

  const handleEnded = () => {
    playNext();
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0f2a] to-[#0a0a0a] text-white">
      <Sidebar />

      <div className="flex-1 flex flex-col items-center justify-center p-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
              <Radio size={32} className="text-white" />
            </div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
              RAP STATION RADIO
            </h1>
          </div>
          <p className="text-gray-300 text-lg font-light">
            Non-stop rap music • Premium shuffle mode
          </p>
        </div>

        {currentTrack ? (
          <div className="bg-gradient-to-br from-[#1a1025] to-[#2d1a3a] rounded-2xl p-8 max-w-md w-full shadow-2xl border border-purple-500/20">
            {/* Album Cover */}
            <div className="relative mb-6">
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                className="w-64 h-64 rounded-xl object-cover mx-auto shadow-lg shadow-purple-500/20"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/50 to-transparent" />
              
              {/* Now Playing Badge */}
              <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                NOW PLAYING
              </div>
            </div>

            {/* Track Info */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2 truncate">{currentTrack.title}</h2>
              <p className="text-gray-300 text-lg mb-1">{currentTrack.artist}</p>
              <p className="text-purple-400 text-sm font-medium">REP STANICA • Radio Mode</p>
            </div>

            {/* Controls */}
            <div className="space-y-6">
              {/* Volume Control */}
              <div className="flex items-center gap-3">
                <Volume2 size={20} className="text-gray-400" />
                <div 
                  className="flex-1 h-1 bg-gray-700 rounded-full cursor-pointer group"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    setVolume(percent);
                  }}
                >
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative group-hover:from-purple-400 group-hover:to-pink-400 transition-all"
                    style={{ width: `${volume * 100}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg" />
                  </div>
                </div>
              </div>

              {/* Player Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={playNext}
                  className="p-3 bg-gradient-to-br from-purple-900 to-pink-900 rounded-full hover:from-purple-800 hover:to-pink-800 transition-all hover:scale-105 border border-purple-500/30"
                  title="Next track"
                >
                  <SkipForward size={24} className="text-white" />
                </button>
                
                <button
                  onClick={togglePlay}
                  className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:from-purple-400 hover:to-pink-400 transition-all hover:scale-105 shadow-lg shadow-purple-500/30"
                >
                  {isPlaying ? (
                    <Pause size={28} className="text-white" />
                  ) : (
                    <Play size={28} className="text-white" fill="white" />
                  )}
                </button>
                
                <button
                  onClick={playNext}
                  className="p-3 bg-gradient-to-br from-purple-900 to-pink-900 rounded-full hover:from-purple-800 hover:to-pink-800 transition-all hover:scale-105 rotate-180 border border-purple-500/30"
                  title="Previous track"
                >
                  <SkipForward size={24} className="text-white" />
                </button>
              </div>
            </div>

            {/* Status */}
            <div className="text-center mt-6">
              <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                {isPlaying ? (
                  <>
                    <Music size={16} className="text-purple-400" />
                    <span>Currently playing</span>
                  </>
                ) : (
                  <>
                    <Pause size={16} className="text-gray-400" />
                    <span>Paused</span>
                  </>
                )}
                <span>• Auto-shuffle enabled</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Starting radio stream...</p>
          </div>
        )}

        {/* Audio element */}
        <audio
          ref={audioRef}
          src={currentTrack?.src}
          onEnded={handleEnded}
        />

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            {tracks.length} tracks in rotation • No repeats
          </p>
        </div>
      </div>
    </div>
  );
}