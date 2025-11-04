import { usePlayerStore } from "../store/playerStore";
import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Plus, Trash2, Play } from "lucide-react";

//
export default function Playlists() {
  const { playlists, createPlaylist, deletePlaylist } = usePlayerStore();
  const [showModal, setShowModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistToDelete, setPlaylistToDelete] = useState(null);

  const handleCreate = () => {
    if (!playlistName.trim()) return;
    createPlaylist(playlistName);
    setPlaylistName("");
    setShowModal(false);
  };

  const executeDelete = () => {
    if (playlistToDelete) {
      deletePlaylist(playlistToDelete.id);
      setPlaylistToDelete(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0f2a] to-[#0a0a0a] text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Glavni deo */}
      <div className="flex-1 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-black mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 bg-clip-text text-transparent">
            YOUR PLAYLISTS
          </h1>
          <p className="text-gray-300 text-lg font-light">
            Create and manage your music collections • Premium experience
          </p>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-gray-400">
              {playlists.length} playlist{playlists.length !== 1 ? 's' : ''} created
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20"
          >
            <Plus size={20} />
            New Playlist
          </button>
        </div>

        {playlists.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/30">
              <Play size={32} className="text-purple-400" />
            </div>
            <p className="text-gray-400 text-xl mb-6">No playlists yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/20"
            >
              Create your first playlist
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {playlists.map((pl) => (
              <div
                key={pl.id}
                className="bg-gradient-to-br from-[#1a1025] to-[#2d1a3a] rounded-2xl p-6 hover:from-[#2a1a3a] hover:to-[#3d1a4a] transition-all duration-300 group border border-purple-500/10 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/20 relative"
              >
                <div className="flex justify-between items-center">
                  <Link 
                    to={`/playlists/${pl.id}`} 
                    className="flex-1 flex items-center gap-4"
                  >
                    {/* Playlist Cover */}
                    <div className="relative">
                      {pl.tracks.length > 0 ? (
                        <img
                          src={pl.tracks[0].cover}
                          alt={pl.name}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl flex items-center justify-center border border-purple-500/30">
                          <Play size={20} className="text-purple-400" />
                        </div>
                      )}
                      
                      {/* Play Overlay */}
                      <div className="absolute inset-0 bg-black/60 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-purple-500 rounded-full p-2 transform group-hover:scale-110 transition-transform">
                          <Play size={14} fill="white" />
                        </div>
                      </div>
                    </div>

                    {/* Playlist Info */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-white group-hover:text-purple-300 transition-colors">
                        {pl.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {pl.tracks.length} song{pl.tracks.length !== 1 && "s"}
                      </p>
                    </div>
                  </Link>

                  {/* Open Indicator */}
                  <div className="flex items-center gap-4">
                  
                    
                    {/* Delete button */}
                    <button
                      onClick={() => setPlaylistToDelete(pl)}
                      className="p-2 bg-black/60 rounded-full text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                      title="Delete playlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Hover Gradient Border Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:via-pink-500/10 group-hover:to-purple-500/10 transition-all duration-500 pointer-events-none" />
              </div>
            ))}
          </div>
        )}

        {/* Modal za kreiranje */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-[#1a1025] to-[#2d1a3a] p-8 rounded-2xl w-96 border border-purple-500/20 shadow-2xl shadow-purple-500/20">
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Create Playlist
              </h2>
              <input
                type="text"
                placeholder="Enter playlist name..."
                className="w-full p-4 rounded-xl bg-[#0a0a0a] border border-purple-500/30 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
                autoFocus
              />
              <div className="flex justify-end gap-3 mt-6">
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

        {/* Modal za brisanje */}
        {playlistToDelete && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-[#1a1025] to-[#2d1a3a] p-8 rounded-2xl w-96 border border-purple-500/20 shadow-2xl shadow-purple-500/20">
              <h2 className="text-2xl font-bold mb-4 text-red-400">
                Delete Playlist
              </h2>
              <p className="mb-6 text-gray-300">
                Are you sure you want to delete <span className="font-semibold text-white">"{playlistToDelete.name}"</span>?
                {playlistToDelete.tracks.length > 0 && (
                  <span className="block text-sm text-gray-400 mt-2">
                    This will remove {playlistToDelete.tracks.length} song{playlistToDelete.tracks.length !== 1 && 's'} from the playlist.
                  </span>
                )}
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setPlaylistToDelete(null)}
                  className="px-6 py-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors border border-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-lg shadow-red-500/20"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}