import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { usePlayerStore } from "../store/playerStore";
import { tracks } from "../data/tracks";
import { Home, Library, Heart, Radio, Plus, Music } from "lucide-react";

export default function Sidebar() {
  const { createPlaylist, addToPlaylist, playlists } = usePlayerStore();
  const [showModal, setShowModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedTracks, setSelectedTracks] = useState([]);
  const location = useLocation();

  const filteredTracks = tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.artist.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!playlistName.trim()) return;

    const newPlaylistId = Date.now();
    createPlaylist(playlistName);

    selectedTracks.forEach((track) => {
      addToPlaylist(newPlaylistId, track);
    });

    setPlaylistName("");
    setSearch("");
    setSelectedTracks([]);
    setShowModal(false);
  };

  const toggleTrackSelection = (track) => {
    setSelectedTracks((prev) =>
      prev.includes(track)
        ? prev.filter((t) => t !== track)
        : [...prev, track]
    );
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-80 bg-gradient-to-b from-[#0a0a0a] to-[#151515] border-r border-gray-800 p-8 flex flex-col text-white">
      {/* Logo */}
      <div className="mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Music size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
            REP STANICA
          </h1>
        </div>
        <p className="text-gray-500 text-sm mt-2"></p>
      </div>

      {/* Main Navigation */}
      <nav className="space-y-2 mb-12">
        <Link 
          to="/" 
          className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
            isActive('/') 
              ? 'bg-gray-800 text-white shadow-lg' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <Home size={22} />
          <span className="font-medium">Home</span>
        </Link>

        <Link 
          to="/playlists" 
          className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
            isActive('/playlists') 
              ? 'bg-gray-800 text-white shadow-lg' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <Library size={22} />
          <span className="font-medium">Playlists</span>
        </Link>

        <Link 
          to="/liked" 
          className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
            isActive('/liked') 
              ? 'bg-gray-800 text-white shadow-lg' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <Heart size={22} />
          <span className="font-medium">Liked Songs</span>
        </Link>

        <Link 
          to="/radio" 
          className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
            isActive('/radio') 
              ? 'bg-gray-800 text-white shadow-lg' 
              : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <Radio size={22} />
          <span className="font-medium">Radio</span>
        </Link>
      </nav>

      {/* Quick Stats */}
      <div className="mb-8">
        <h3 className="text-gray-500 text-sm font-semibold mb-4 uppercase tracking-wider">Library</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-gray-400 text-sm">
            <span>Playlists</span>
            <span className="text-white font-medium">{playlists.length}</span>
          </div>
          <div className="flex justify-between items-center text-gray-400 text-sm">
            <span>Tracks</span>
            <span className="text-white font-medium">{tracks.length}</span>
          </div>
        </div>
      </div>

      {/* Your Playlists */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <h3 className="text-gray-500 text-sm font-semibold mb-4 uppercase tracking-wider">Your Playlists</h3>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="space-y-2 pr-2">
            {playlists.map((pl) => (
              <Link
                key={pl.id}
                to={`/playlists/${pl.id}`}
                className={`flex items-center gap-3 p-2 rounded-lg text-sm transition-all ${
                  isActive(`/playlists/${pl.id}`)
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-600 rounded flex items-center justify-center">
                  <Music size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate font-medium">{pl.name}</p>
                  <p className="text-xs text-gray-500">{pl.tracks.length} songs</p>
                </div>
              </Link>
            ))}
            {playlists.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">No playlists yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Create Playlist Button */}
      <div className="mt-auto pt-6 border-t border-gray-800">
        <button
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold transition-all hover:shadow-lg"
        >
          <Plus size={20} />
          New Playlist
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-[#1a1025] to-[#2d1a3a] p-8 rounded-2xl w-[500px] border border-purple-500/20 shadow-2xl shadow-purple-500/20">
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Create Playlist
            </h2>

            <input
              type="text"
              placeholder="Playlist name..."
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              className="w-full p-4 rounded-xl bg-[#0a0a0a] border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors mb-4"
            />

            <input
              type="text"
              placeholder="Search by title or artist..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-4 rounded-xl bg-[#0a0a0a] border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors mb-4"
            />

            <div className="max-h-48 overflow-y-auto border border-purple-500/20 rounded-xl p-4 mb-6 bg-[#0a0a0a]/50 custom-scrollbar">
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
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white">{track.title}</p>
                    <p className="text-xs text-gray-400">{track.artist}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 transition-all ${
                    selectedTracks.includes(track) 
                      ? 'bg-purple-500 border-purple-500' 
                      : 'border-gray-500'
                  }`} />
                </div>
              ))}
              {filteredTracks.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">No songs found.</p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors border border-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!playlistName.trim()}
                className={`px-6 py-3 rounded-xl transition-all ${
                  !playlistName.trim() 
                    ? 'bg-gray-600 cursor-not-allowed text-gray-400' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/20'
                }`}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(168, 85, 247, 0.3) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(168, 85, 247, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(168, 85, 247, 0.5);
        }
      `}</style>
    </aside>
  );
}