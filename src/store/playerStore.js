import { create } from 'zustand';
import { mutative } from 'zustand-mutative';
import { persist } from "zustand/middleware";

export const usePlayerStore = create(
  persist(
    mutative((set, get) => ({
      // State
      currentTrack: null,
      isPlaying: false,
      playlist: [],
      currentTrackIndex: -1,
      likedTracks: [],
      playlists: [],

      // Actions
      setPlaylist: (tracks) => {
        set((state) => {
          state.playlist = tracks;
          state.currentTrackIndex = tracks.length > 0 ? 0 : -1;
          state.currentTrack = tracks.length > 0 ? tracks[0] : null;
        });
      },

      playTrack: (track) => {
        set((state) => {
          const trackIndex = state.playlist.findIndex(t => t.id === track.id);
          if (trackIndex !== -1) {
            state.currentTrackIndex = trackIndex;
          }
          state.currentTrack = track;
          state.isPlaying = true;
        });
      },

      setTrack: (track) => {
        set((state) => {
          state.currentTrack = track;
          state.isPlaying = true;
        });
      },

      playTrackById: (trackId) => {
        set((state) => {
          const trackIndex = state.playlist.findIndex(t => t.id === trackId);
          if (trackIndex !== -1) {
            state.currentTrackIndex = trackIndex;
            state.currentTrack = state.playlist[trackIndex];
            state.isPlaying = true;
          }
        });
      },

      togglePlay: () => {
        set((state) => {
          state.isPlaying = !state.isPlaying;
        });
      },

      play: () => {
        set((state) => {
          state.isPlaying = true;
        });
      },

      pause: () => {
        set((state) => {
          state.isPlaying = false;
        });
      },

      nextTrack: () => {
        set((state) => {
          if (state.playlist.length === 0) return;

          const nextIndex = (state.currentTrackIndex + 1) % state.playlist.length;
          state.currentTrackIndex = nextIndex;
          state.currentTrack = state.playlist[nextIndex];
          state.isPlaying = true;
        });
      },

      prevTrack: () => {
        set((state) => {
          if (state.playlist.length === 0) return;

          const prevIndex = 
            (state.currentTrackIndex - 1 + state.playlist.length) % state.playlist.length;
          state.currentTrackIndex = prevIndex;
          state.currentTrack = state.playlist[prevIndex];
          state.isPlaying = true;
        });
      },

      addToPlaylist: (track) => {
        set((state) => {
          state.playlist.push(track);
        });
      },
      removeFromPlaylist: (trackId) => {
        set((state) => {
          const trackIndex = state.playlist.findIndex(t => t.id === trackId);
          if (trackIndex !== -1) {
            state.playlist.splice(trackIndex, 1);
            
            if (state.currentTrack?.id === trackId) {
              if (state.playlist.length > 0) {
                const newIndex = Math.min(trackIndex, state.playlist.length - 1);
                state.currentTrackIndex = newIndex;
                state.currentTrack = state.playlist[newIndex];
              } else {
                state.currentTrackIndex = -1;
                state.currentTrack = null;
                state.isPlaying = false;
              }
            }
          }
        });
      },
      clearPlaylist: () => {
        set((state) => {
          state.playlist = [];
          state.currentTrackIndex = -1;
          state.currentTrack = null;
          state.isPlaying = false;
        });
      },
      shufflePlaylist: () => {
        set((state) => {
          if (state.playlist.length === 0) return;

          const shuffled = [...state.playlist];
          for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
          }

          const currentTrackId = state.currentTrack?.id;
          const newIndex = shuffled.findIndex(t => t.id === currentTrackId);
          
          state.playlist = shuffled;
          state.currentTrackIndex = newIndex !== -1 ? newIndex : 0;
          state.currentTrack = state.playlist[state.currentTrackIndex];
        });
      },
      toggleLike: (track) => {
        set((state) => {
          const exists = state.likedTracks.find((t) => t.id === track.id);
          if (exists) {
            state.likedTracks = state.likedTracks.filter((t) => t.id !== track.id);
          } else {
            state.likedTracks.push(track);
          }
        });
      },

      isLiked: (trackId) => {
        return get().likedTracks.some((t) => t.id === trackId);
      },
    createPlaylist: (name) => {
  const newPlaylist = { id: Date.now(), name, tracks: [] };
  set((state) => ({
    playlists: [...state.playlists, newPlaylist],
  }));
  return newPlaylist;
},

      addToPlaylist: (playlistId, track) => {
        set((state) => {
          const playlist = state.playlists.find(pl => pl.id === playlistId);
          if (playlist && !playlist.tracks.some(t => t.id === track.id)) {
            playlist.tracks.push(track);
          }
        });
      },

      removeFromPlaylist: (playlistId, trackId) => {
        set((state) => {
          const playlist = state.playlists.find(pl => pl.id === playlistId);
          if (playlist) {
            playlist.tracks = playlist.tracks.filter(t => t.id !== trackId);
          }
        });
      },

      // Dodatne helper funkcije
      getPlaylistById: (playlistId) => {
        return get().playlists.find(pl => pl.id === playlistId);
      },

      deletePlaylist: (playlistId) => {
        set((state) => {
          state.playlists = state.playlists.filter(pl => pl.id !== playlistId);
        });
      },

      renamePlaylist: (playlistId, newName) => {
        set((state) => {
          const playlist = state.playlists.find(pl => pl.id === playlistId);
          if (playlist) {
            playlist.name = newName;
          }
        });
      },
      deletePlaylist: (playlistId) => {
  set((state) => {
    state.playlists = state.playlists.filter(pl => pl.id !== playlistId);
  });
},
    })),
    { 
      name: "player-storage",
      
    }
  )
);