import { usePlayerStore } from "../store/playerStore";
import Sidebar from "../components/sidebar"
import Player from "../components/Player"
import { Play, Heart } from "lucide-react";
import { useState } from "react";

export default function Liked() {
  const { likedTracks, playTrack, toggleLike, currentTrack, isPlaying } = usePlayerStore();
  const [hoveredTrack, setHoveredTrack] = useState(null);

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
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl">
                <Heart size={32} className="text-white" fill="white" />
              </div>
              <div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-red-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
                  LIKED SONGS
                </h1>
                <p className="text-gray-300 text-lg font-light mt-2">
                  Your personal collection • {likedTracks.length} loved tracks
                </p>
              </div>
            </div>
          </div>

          {likedTracks.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/30">
                <Heart size={32} className="text-red-400" />
              </div>
              <p className="text-gray-400 text-xl mb-4">No liked songs yet</p>
              <p className="text-gray-500 text-sm">
                Like some songs to see them here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {likedTracks.map((track) => (
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
                    className="absolute top-3 right-3 p-2 bg-black/60 rounded-full text-red-500 hover:scale-110 transition-transform z-10"
                    title="Unlike song"
                  >
                    <Heart
                      size={18}
                      fill="red"
                      stroke="red"
                    />
                  </button>

                  {/* Hover Gradient Border Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:via-pink-500/10 group-hover:to-purple-500/10 transition-all duration-500 pointer-events-none" />
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          {likedTracks.length > 0 && (
            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm">
                ❤️ {likedTracks.length} loved tracks • Your personal favorites
              </p>
            </div>
          )}
        </main>
      </div>

      <Player />
    </div>
  );
}