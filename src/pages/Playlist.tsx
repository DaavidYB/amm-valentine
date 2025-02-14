"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Plus, Heart, Pause } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Input from "../components/ui/input"
import { fetchSongs, addSong, toggleLikeSong, createPlaylistUser, searchSongs } from "../services/api"
import { useMode } from '@/context/ModeContext';

interface Song {
  _id: string
  title: string
  artist: string
  likes: number
  isLiked: boolean
  url: string // URL de l'aperçu MP3
}

export default function Playlist() {
  const { mode } = useMode();
  const [songs, setSongs] = useState<Song[]>([])
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [playlistUserId, setPlaylistUserId] = useState<string | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const init = async () => {
      let storedUserId = localStorage.getItem("playlistUserId");
  
      if (!storedUserId) {
        const newUserId = await createPlaylistUser();
        if (newUserId) {
          storedUserId = newUserId;
          localStorage.setItem("playlistUserId", storedUserId);
        } else {
          console.error("Erreur: L'ID utilisateur est undefined !");
        }
      }
      
      setPlaylistUserId(storedUserId);

      const songsList = await fetchSongs(mode, storedUserId);
      if (songsList.length > 0) {
        setCurrentSong(songsList[0])
      }

      setSongs(songsList);
    }
    init()
  }, [])

  const playSong = (song: Song) => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setCurrentSong(song)
    setIsPlaying(true)
  }

  useEffect(() => {
    if (currentSong && isPlaying && audioRef.current) {
      audioRef.current.play()
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause()
    }
  }, [currentSong, isPlaying])

  // const handleSearch = async (query: string) => {
  //   setSearchTerm(query)
  //   if (query.length > 2) {
  //     const response = await axios.get(`/api/search/${query}`)
  //     setSearchResults(response.data)
  //   } else {
  //     setSearchResults([])
  //   }
  // }

  const handleSearch = async (query: string) => {
    setSearchTerm(query);
    
    if (query.length > 2) {
      try {
        const results = await searchSongs(query);
        setSearchResults(Array.isArray(results) ? results : []);
      } catch (error) {
        console.error("Erreur lors de la recherche :", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };
  

  const handleAddSong = async (song: any) => {
    const { title, artist, url } = song
    const response = await addSong(title, artist, url, playlistUserId, mode)

    if (response && response.message === "Chanson ajoutée avec succès") {
      setSongs(response.songs)
      setSearchTerm("")
      setSearchResults([])
    } else {
      console.error("Erreur lors de l'ajout de la chanson.")
    }
  }

  const handleToggleLike = async (songId: string) => {
    if (!playlistUserId) return;

    const response = await toggleLikeSong(songId, playlistUserId, mode);

    if (response) {
        // Mettre à jour les chansons et les trier
        const updatedSongs = songs.map(song => 
            song._id === songId ? { ...song, likes: response.likes, isLiked: response.isLiked } : song
        ).sort((a, b) => b.likes - a.likes);

        setSongs(updatedSongs);
    }
};

  return (
    <div className="container max-w-full mx-auto px-6">
      {/* Current Song */}
      {currentSong && (
        <div className="bg-[var(--color-accent)] rounded-xl p-6 mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-white text-xl font-bold">{currentSong.title}</h2>
            <p className="text-white/80 font-regular">{currentSong.artist}</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsPlaying(!isPlaying)} className="w-8 h-8 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isPlaying ? (
                  <motion.div key="pause" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Pause className="w-8 h-8 text-white fill-white" />
                  </motion.div>
                ) : (
                  <motion.div key="play" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                    <Play className="w-8 h-8 text-white fill-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
            <Dialog>
              <DialogTrigger asChild>
                <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <Plus className="w-5 h-5 text-[var(--color-accent)]" />
                </button>
              </DialogTrigger>
              <DialogContent className="bg-[var(--color-background)] backdrop-blur-sm border-none">
                <DialogHeader>
                  <DialogTitle className="text-[var(--color-accent)]">Ajouter une chanson</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Rechercher une chanson..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full bg-[var(--color-primary)] border-none text-[var(--color-accent)] placeholder:text-[var(--color-accent)]/50"
                  />
                  {searchResults.length > 0 && (
                    <div className="mt-2 max-h-[200px] overflow-y-auto space-y-2">
                      {searchResults.map((result: any) => (
                        <button key={result.id} onClick={() => handleAddSong(result)} className="w-full p-3 bg-[var(--color-accent)] rounded-lg text-left hover:bg-[var(--color-primary)] hover:text-white transition-colors">
                          <div className="font-bold">{result.title}</div>
                          <div className="text-sm opacity-80 font-regular">{result.artist}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}

      {/* Song List */}
      <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
        <AnimatePresence>
          {songs.map((song) => (
            <motion.div key={song._id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-[var(--color-background)] backdrop-blur-sm rounded-xl px-6 py-3 flex justify-between items-center">
              <button className="flex-1 text-left" onClick={() => playSong(song)}>
                <div className="text-[var(--color-accent)] font-bold">{song.title}</div>
                <div className="text-[var(--color-accent)]/70 mt-0 font-regular">{song.artist}</div>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-[var(--color-accent)] font-semibold">{song.likes}</span>
                <button onClick={() => handleToggleLike(song._id)} className="group">
                  <Heart className={`w-6 h-6 ${song.isLiked ? "fill-[var(--color-accent)] text-[var(--color-accent)]" : "text-[var(--color-accent)] group-hover:fill-[var(--color-accent)]/20"}`} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Audio Player */}
      {currentSong && (
        <audio ref={audioRef} src={currentSong.url} onEnded={() => setIsPlaying(false)} />
      )}
    </div>
  )
}
