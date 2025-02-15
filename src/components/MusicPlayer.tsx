import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause } from "lucide-react"
import { fetchSongs } from "@/services/api"  // Assume that this function fetches the playlist

interface Song {
  _id: string
  title: string
  artist: string
  likes: number
  isLiked: boolean
  url: string // URL de l'aperçu MP3
}

interface MusicPlayerProps {
  mode: "love" | "anti-love"
  userId: string
}

export default function MusicPlayer({ mode, userId }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [songs, setSongs] = React.useState<Song[]>([])
  const [currentSong, setCurrentSong] = React.useState<Song | null>(null)
  const [volume] = React.useState(0.1) // Volume à 10%
  const audioRef = React.useRef<HTMLAudioElement | null>(null)
  const progressInterval = React.useRef<ReturnType<typeof setInterval> | null>(null)

  // Charger la playlist au début
  React.useEffect(() => {
    const loadPlaylist = async () => {
      try {
        const songsData = await fetchSongs(mode, userId) // Récupérer les chansons depuis l'API
        setSongs(songsData)
        if (songsData.length > 0) {
          const randomSong = songsData[Math.floor(Math.random() * songsData.length)] // Sélectionner une chanson au hasard
          setCurrentSong(randomSong)
        }
      } catch (error) {
        console.error('Error loading playlist:', error)
      }
    }
    loadPlaylist()
  }, [mode, userId])

  // Gérer le changement de chanson
  const handleSongEnd = () => {
    if (songs.length > 0) {
      const nextSong = songs[Math.floor(Math.random() * songs.length)]
      setCurrentSong(nextSong)
    }
  }

  // Toggle play/pause
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.volume = volume // S'assurer que le volume est appliqué
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Set up the audio player when the song changes
  React.useEffect(() => {
    if (currentSong) {
      // Create new audio element and set its source
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("ended", handleSongEnd);
      }
      
      audioRef.current = new Audio(currentSong.url);
      audioRef.current.volume = volume; // Appliquer le volume depuis l'état
      audioRef.current.addEventListener("ended", handleSongEnd);
      // console.log('Volume set to:', volume); // Pour débugger

      // Only play if isPlaying is true
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error starting the audio", error);
          setIsPlaying(false); // Reset playing state if autoplay fails
        });
      }
    }

    return () => {
      // Clean up when the song is changed or the component is unmounted
      if (audioRef.current) {
        audioRef.current.removeEventListener("ended", handleSongEnd)
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [currentSong]) // Dependency on `currentSong` to restart the audio when the song changes

  // Track progress
  React.useEffect(() => {
    if (isPlaying && audioRef.current) {
      progressInterval.current = setInterval(() => {
        if (audioRef.current) {
          const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100
          if (progress >= 100) {
            setIsPlaying(false)
            if (progressInterval.current !== null) {
              clearInterval(progressInterval.current)
            }
            // clearInterval(progressInterval.current)
          }
        }
      }, 100)
    } else if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current)
      }
    }
  }, [isPlaying])

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    >
      {currentSong ? (
        <div
          className="relative group cursor-pointer bg-[var(--color-accent)] hover:bg-[var(--color-hover)] transition-colors duration-300 rounded-[16px] pr-4 pl-6 py-3"
          onClick={togglePlay}
          style={{
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <div className="flex items-center justify-between min-w-[184px]">
            <div className="flex flex-col leading-tight">
              <span className="font-bold text-white text-[16px]">{currentSong.title}</span>
              <span className="font-regular text-white/90 text-[16px]">{currentSong.artist}</span>
            </div>

            <div className="h-8 w-8 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isPlaying ? (
                  <motion.div
                    key="pause"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Pause className="w-6 h-6 text-white fill-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="play"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Play className="w-6 h-6 text-white fill-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative group cursor-pointer bg-[var(--color-accent)] hover:bg-[var(--color-hover)] transition-colors duration-300 rounded-[16px] pr-4 pl-6 py-3">
          <div className="flex items-center justify-between min-w-[184px]">
          <span className="font-medium text-white text-[16px]">Chargement..</span>
          </div>
        </div>
      )}
    </motion.div>
  )
}