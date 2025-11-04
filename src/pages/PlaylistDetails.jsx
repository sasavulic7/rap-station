import { useParams } from "react-router-dom";
import { usePlayerStore } from "../store/playerStore";
import { useState, useEffect } from "react";
import { tracks } from "../data/tracks";
import Sidebar from "../components/sidebar";
import { Link } from "react-router-dom";
import Player from "../components/Player";
import { Play, Pause, Heart, Plus, Trash2, ArrowLeft, Music } from "lucide-react";

export default function PlaylistDetails() {
  const { id } = useParams();
  const { 
    playlists, 
    addToPlaylist, 
    removeFromPlaylist, 
    playTrack, 
    currentTrack, 
    isPlaying, 
    togglePlay,
    setPlaylist,
    toggleLike,
    isLiked
  } = usePlayerStore();

  const playlist = playlists.find((pl) => pl.id.toString() === id);

  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTracks, setSelectedTracks] = useState([]);

  useEffect(() => {
    if (playlist && playlist.tracks.length > 0) {
      setPlaylist(playlist.tracks);
    }
  }, [playlist, setPlaylist]);

  if (!playlist) return <p className="p-8 text-white">Playlist not found.</p>;

  const filteredTracks = tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.artist.toLowerCase().includes(search.toLowerCase())
  );

  const toggleTrackSelection = (track) => {
    setSelectedTracks((prev) =>
      prev.includes(track)
        ? prev.filter((t) => t !== track)
        : [...prev, track]
    );
  };

  const handleAddTracks = () => {
    selectedTracks.forEach((track) => addToPlaylist(playlist.id, track));
    setSelectedTracks([]);
    setSearch("");
    setShowAddModal(false);
  };

  const handlePlayTrack = (track) => {
    playTrack(track);
  };

  const handlePlayPlaylist = () => {
    if (playlist.tracks.length > 0) {
      setPlaylist(playlist.tracks);
      playTrack(playlist.tracks[0]);
    }
  };

  const featuredArtist = playlist.tracks.length > 0 ? playlist.tracks[0].artist : "Unknown Artist";

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-[#0a0a0a] via-[#1a0f2a] to-[#0a0a0a]">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Glavni sadržaj */}
        <div className="flex-1 overflow-y-auto">
          {/* Header sa slikom i informacijama */}
          <div className="relative h-80 bg-gradient-to-br from-purple-900/50 via-pink-900/30 to-[#1a0f2a] p-8 flex items-end">
            <div className="flex items-end gap-8">
              <div className="w-60 h-60 bg-gradient-to-br from-purple-500 to-pink-500 shadow-2xl shadow-purple-500/30 rounded-2xl overflow-hidden">
                {playlist.tracks.length > 0 ? (
                  <img
                    src={playlist.tracks[0].cover}
                    alt={playlist.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600">
                    <Music size={64} className="text-white" />
                  </div>
                )}
              </div>
              
              <div className="text-white pb-6">
                <p className="text-sm font-semibold mb-3 text-purple-300">PLAYLIST</p>
                <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-purple-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                  {playlist.name}
                </h1>
                <p className="text-gray-300 text-lg">
                  {playlist.tracks.length} song{playlist.tracks.length !== 1 && "s"} • {featuredArtist}
                </p>
              </div>
            </div>

            {/* Play dugme na headeru */}
            <div className="absolute bottom-8 right-8">
              <button
                onClick={handlePlayPlaylist}
                disabled={playlist.tracks.length === 0}
                className={`p-5 rounded-full shadow-2xl transition-all duration-300 ${
                  playlist.tracks.length === 0
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 hover:scale-105 shadow-purple-500/50'
                }`}
              >
                <Play size={32} fill="white" />
              </button>
            </div>
          </div>

          {/* Kontent */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                <Link 
                  to="/playlists" 
                  className="text-gray-400 hover:text-purple-300 transition flex items-center gap-2 bg-[#1a1025] px-4 py-2 rounded-xl border border-purple-500/20"
                >
                  <ArrowLeft size={20} />
                  Back to Playlists
                </Link>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20"
              >
                <Plus size={20} />
                Add Songs
              </button>
            </div>

            {/* Lista pesama */}
            {playlist.tracks.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
                  <Plus size={32} className="text-purple-400" />
                </div>
                <p className="text-gray-400 text-xl mb-6">This playlist is empty</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/20"
                >
                  Add your first song
                </button>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-[#1a1025] to-[#2d1a3a] rounded-2xl overflow-hidden border border-purple-500/20 shadow-xl shadow-purple-500/10">
                {/* Table Header */}
                <div className="grid grid-cols-[60px_1fr_120px] gap-6 px-8 py-4 border-b border-purple-500/20 text-gray-400 text-sm font-medium">
                  <div>#</div>
                  <div>TITLE</div>
                  <div className="text-right">ACTIONS</div>
                </div>

                {/* Lista pesama sa scroll-om */}
                <div className="max-h-[500px] overflow-y-auto">
                  {playlist.tracks.map((track, index) => (
                    <div
                      key={track.id}
                      className={`grid grid-cols-[60px_1fr_120px] gap-6 px-8 py-4 items-center group hover:bg-purple-500/10 transition-all ${
                        currentTrack?.id === track.id ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/10' : ''
                      }`}
                    >
                      {/* Broj / Play dugme */}
                      <div className="relative">
                        {currentTrack?.id === track.id && isPlaying ? (
                          <div className="w-5 h-5 flex items-center justify-center">
                            <div className="w-1 h-3 bg-purple-400 mx-0.5 animate-pulse rounded-full"></div>
                            <div className="w-1 h-3 bg-purple-400 mx-0.5 animate-pulse rounded-full" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        ) : (
                          <span className="text-gray-400 group-hover:hidden text-lg">
                            {index + 1}
                          </span>
                        )}
                        <button
                          onClick={() => 
                            currentTrack?.id === track.id 
                              ? togglePlay()
                              : handlePlayTrack(track)
                          }
                          className="hidden group-hover:block absolute top-0 left-0"
                        >
                          {currentTrack?.id === track.id && isPlaying ? (
                            <Pause size={20} className="text-purple-400" />
                          ) : (
                            <Play size={20} className="text-purple-400" fill="currentColor" />
                          )}
                        </button>
                      </div>

                      {/* Informacije o pesmi */}
                      <div 
                        className="flex items-center gap-4 cursor-pointer group/track"
                        onClick={() => handlePlayTrack(track)}
                      >
                        <img
                          src={track.cover}
                          alt={track.title}
                          className="w-12 h-12 rounded-lg object-cover shadow-lg group-hover/track:shadow-purple-500/30 transition-all"
                        />
                        <div className="flex-1">
                          <p className={`font-medium text-lg ${
                            currentTrack?.id === track.id ? 'text-purple-400' : 'text-white'
                          } group-hover/track:text-purple-300 transition-colors`}>
                            {track.title}
                          </p>
                          <p className="text-gray-400 text-sm">{track.artist}</p>
                        </div>
                      </div>

                      {/* Akcije */}
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(track);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        >
                          <Heart
                            size={18}
                            fill={isLiked(track.id) ? "red" : "none"}
                            stroke={isLiked(track.id) ? "red" : "currentColor"}
                          />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromPlaylist(playlist.id, track.id);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors p-2 opacity-0 group-hover:opacity-100"
                          title="Remove from playlist"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal za dodavanje pesama */}
            {showAddModal && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                <div className="bg-gradient-to-br from-[#1a1025] to-[#2d1a3a] p-8 rounded-2xl w-[500px] max-h-[80vh] overflow-hidden flex flex-col border border-purple-500/20 shadow-2xl shadow-purple-500/20">
                  <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Add Songs to {playlist.name}
                  </h2>
                  <input
                    type="text"
                    placeholder="Search by title or artist..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-4 rounded-xl bg-[#0a0a0a] border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors mb-4"
                  />

                  <div className="flex-1 overflow-y-auto border border-purple-500/20 rounded-xl p-4 mb-6 bg-[#0a0a0a]/50">
                    {filteredTracks.map((track) => (
                      <div
                        key={track.id}
                        onClick={() => toggleTrackSelection(track)}
                        className={`flex items-center gap-4 cursor-pointer p-3 rounded-xl transition-all ${
                          selectedTracks.includes(track)
                            ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
                            : "bg-transparent hover:bg-purple-500/10"
                        }`}
                      >
                        <img
                          src={track.cover}
                          alt={track.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-white">{track.title}</p>
                          <p className="text-gray-400 text-sm">{track.artist}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 transition-all ${
                          selectedTracks.includes(track) 
                            ? 'bg-purple-500 border-purple-500' 
                            : 'border-gray-500'
                        }`} />
                      </div>
                    ))}
                    {filteredTracks.length === 0 && (
                      <p className="text-gray-400 text-center py-8">No songs found.</p>
                    )}
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-400">
                      {selectedTracks.length} track{selectedTracks.length !== 1 && 's'} selected
                    </span>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setShowAddModal(false);
                        setSelectedTracks([]);
                        setSearch("");
                      }}
                      className="px-6 py-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors border border-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddTracks}
                      disabled={selectedTracks.length === 0}
                      className={`px-6 py-3 rounded-xl transition-all ${
                        selectedTracks.length === 0
                          ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/20'
                      }`}
                    >
                      Add Selected
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Player */}
      <Player />
    </div>
  );
}