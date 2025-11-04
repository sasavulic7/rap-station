import { Heart, Play } from "lucide-react";
import { usePlayerStore } from "../store/playerStore";
import { tracks } from "../data/tracks";
import Sidebar from "../components/Sidebar";
import Player from "../components/Player";
import { useEffect, useState } from "react";

export default function Home() {
  const { playTrack, setPlaylist, toggleLike, isLiked, currentTrack, isPlaying } = usePlayerStore();
  const [hoveredTrack, setHoveredTrack] = useState(null);
  const [shuffledTracks, setShuffledTracks] = useState([]);

  // Funkcija za mešanje niza
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const randomTracks = shuffleArray(tracks);
    setShuffledTracks(randomTracks);
    setPlaylist(randomTracks);
  }, [setPlaylist]);

  const handlePlayTrack = (track) => {
    playTrack(track);
  };

  const handleLikeTrack = (e, track) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike(track);
  };

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-[#0a0a0a] via-[#1a0f2a] to-[#0a0a0a]">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
               REP STANICA
            </h1>
          </div>

          {/* Track Grid - koristi shuffledTracks umesto tracks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {shuffledTracks.map((track) => (
              <div
                key={track.id}
                className="bg-gradient-to-br from-[#1a1025] to-[#2d1a3a] rounded-2xl p-4 hover:from-[#2a1a3a] hover:to-[#3d1a4a] transition-all duration-300 group border border-purple-500/10 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/20 relative overflow-hidden cursor-pointer"
                onMouseEnter={() => setHoveredTrack(track.id)}
                onMouseLeave={() => setHoveredTrack(null)}
                onClick={() => handlePlayTrack(track)}
              >
                {/* Play Overlay */}
                <div 
                  className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-2xl flex items-center justify-center transition-opacity duration-300 ${
                    hoveredTrack === track.id ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handlePlayTrack(track);
                    }}
                    className="bg-purple-500 hover:bg-purple-400 rounded-full p-4 transform hover:scale-110 transition-all duration-200 shadow-2xl"
                  >
                    {currentTrack?.id === track.id && isPlaying ? (
                      <div className="w-6 h-6 flex items-center justify-center">
                        <div className="w-2 h-4 bg-white mx-0.5 animate-pulse"></div>
                        <div className="w-2 h-4 bg-white mx-0.5 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    ) : (
                      <Play size={24} fill="white" />
                    )}
                  </button>
                </div>

                {/* Album Art */}
                <div className="relative mb-4">
                  <img
                    src={track.cover}
                    alt={track.title}
                    className="rounded-xl w-full aspect-square object-cover shadow-lg group-hover:shadow-purple-500/30 transition-all duration-300"
                  />
                  
                  {/* Now Playing Indicator */}
                  {currentTrack?.id === track.id && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      NOW
                    </div>
                  )}
                </div>

                {/* Track Info */}
                <div className="space-y-2">
                  <h3 className="font-bold text-white truncate text-sm group-hover:text-purple-300 transition-colors">
                    {track.title}
                  </h3>
                  <p className="text-gray-400 text-xs truncate">
                    {track.artist}
                  </p>
                </div>

                {/* Like Button */}
                <button
                  onClick={(e) => handleLikeTrack(e, track)}
                  className="absolute top-3 right-3 p-2 bg-black/60 rounded-full text-gray-400 hover:text-red-500 transition-colors z-10"
                >
                  <Heart
                    size={18}
                    fill={isLiked(track.id) ? "red" : "none"}
                    stroke={isLiked(track.id) ? "red" : "currentColor"}
                  />
                </button>

                {/* Hover Gradient Border Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:via-pink-500/10 group-hover:to-purple-500/10 transition-all duration-500 pointer-events-none" />
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 text-sm">
              🎧 Za ljubitelje rep muzike • {shuffledTracks.length} pesama dostupno (Probna verzija)
            </p>
          </div>
        </main>
      </div>

      <Player />

      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(168, 85, 247, 0.3) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 4px;
          margin: 4px 0;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.3);
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.5);
        }
        
        .custom-scrollbar::-webkit-scrollbar-corner {
          background: transparent;
        }
      `}</style>
    </div>
  );
}