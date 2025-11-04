export const musicSlice = (set, get) => ({
  songs: [
    { id: 1, title: "Rap God", artist: "Eminem", src: "/music/rapgod.mp3", cover: "/covers/rapgod.jpg" },
    { id: 2, title: "Still D.R.E.", artist: "Dr. Dre", src: "/music/stilldre.mp3", cover: "/covers/stilldre.jpg" },
    { id: 3, title: "HUMBLE.", artist: "Kendrick Lamar", src: "/music/humble.mp3", cover: "/covers/humble.jpg" },
  ],
  currentSong: null,
  isPlaying: false,

  // Akcije
  playSong: (song) => set({ currentSong: song, isPlaying: true }),
  pauseSong: () => set({ isPlaying: false }),
  togglePlay: () => set({ isPlaying: !get().isPlaying }),

  nextSong: () => {
    const { songs, currentSong } = get();
    if (!currentSong) return;
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    set({ currentSong: songs[nextIndex], isPlaying: true });
  },

  prevSong: () => {
    const { songs, currentSong } = get();
    if (!currentSong) return;
    const currentIndex = songs.findIndex((s) => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    set({ currentSong: songs[prevIndex], isPlaying: true });
  },
});