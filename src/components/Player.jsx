import { useEffect, useRef, useState } from 'react';
import { usePlayerStore } from '../store/playerStore';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

export default function Player() {
  const audioRef = useRef(null);
  const { currentTrack, isPlaying, togglePlay, nextTrack, prevTrack, playlist, currentTrackIndex } = usePlayerStore();
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => nextTrack();

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [nextTrack]);

  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.src = currentTrack.src;
      audioRef.current.volume = volume;
      if (isPlaying) audioRef.current.play();
      setCurrentTime(0);
    }
  }, [currentTrack]);

  // Play/Pause kontrola
  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Volume kontrola
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Klik na progress bar
  const handleProgressClick = (e) => {
    if (!audioRef.current || !duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="h-28 bg-gradient-to-t from-[#0a0a0a] to-[#151515] border-t border-gray-800 px-8 py-4">
      {/* Glavni player kontent */}
      <div className="flex items-center justify-between h-full">
        
        {/* Levo - Trenutna pesma */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-16 h-16 bg-gray-800 rounded-xl overflow-hidden flex-shrink-0 shadow-lg">
            {currentTrack && (
              <img
                src={currentTrack.cover}
                alt={currentTrack.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white truncate text-lg">
              {currentTrack ? currentTrack.title : "No track selected"}
            </p>
            <p className="text-sm text-gray-400 truncate">
              {currentTrack ? currentTrack.artist : "Select a song to play"}
            </p>
          </div>
        </div>

        {/* Sredina - Kontrole i progress bar */}
        <div className="flex flex-col items-center gap-3 flex-1 max-w-2xl">
          {/* Kontrole */}
          <div className="flex items-center gap-6">
            <button 
              onClick={prevTrack}
              disabled={!currentTrack || currentTrackIndex <= 0}
              className={`p-2 rounded-lg transition-all ${
                !currentTrack || currentTrackIndex <= 0 
                  ? 'text-gray-600 cursor-not-allowed' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <SkipBack size={22} />
            </button>
            
            <button 
              onClick={togglePlay}
              disabled={!currentTrack}
              className={`p-4 rounded-full transition-all shadow-lg ${
                !currentTrack 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-white hover:scale-105 hover:shadow-xl'
              }`}
            >
              {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" />}
            </button>
            
            <button 
              onClick={nextTrack}
              disabled={!currentTrack || !playlist || currentTrackIndex >= playlist.length - 1}
              className={`p-2 rounded-lg transition-all ${
                !currentTrack || !playlist || currentTrackIndex >= playlist.length - 1
                  ? 'text-gray-600 cursor-not-allowed' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <SkipForward size={22} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-4 w-full max-w-md">
            <span className="text-sm text-gray-400 w-12 text-right font-medium">
              {formatTime(currentTime)}
            </span>
            
            <div 
              className="flex-1 h-2 bg-gray-800 rounded-full cursor-pointer group"
              onClick={handleProgressClick}
            >
              <div 
                className="h-full bg-gray-400 rounded-full relative group-hover:bg-white transition-all"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg" />
              </div>
            </div>
            
            <span className="text-sm text-gray-400 w-12 font-medium">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Desno - Volume kontrola */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          <Volume2 size={20} className="text-gray-400" />
          <div 
            className="w-32 h-2 bg-gray-800 rounded-full cursor-pointer group"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const percent = (e.clientX - rect.left) / rect.width;
              setVolume(percent);
            }}
          >
            <div 
              className="h-full bg-gray-400 rounded-full relative group-hover:bg-white transition-all"
              style={{ width: `${volume * 100}%` }}
            >
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg" />
            </div>
          </div>
        </div>
      </div>

      {/* Audio element */}
      <audio ref={audioRef} />
    </div>
  );
}