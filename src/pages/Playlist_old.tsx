"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Plus, Heart, Info, Pause } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Input from "../components/ui/input"
import Button from "../components/ui/button"

interface Song {
  id: string
  title: string
  artist: string
  likes: number
  isLiked: boolean
  youtubeId?: string
}

export default function Playlist() {
  const [songs, setSongs] = useState<Song[]>([
    { id: "1", title: "Kongolese sous BBL", artist: "Theodora", likes: 3, isLiked: true },
    { id: "2", title: "Kongolese sous BBL", artist: "Theodora", likes: 3, isLiked: true },
    { id: "3", title: "Kongolese sous BBL", artist: "Theodora", likes: 3, isLiked: false },
  ])
  const [currentSong, setCurrentSong] = useState<Song>(songs[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isPlaying, setIsPlaying] = useState(false)

  const handleSearch = async () => {
    // Ici, vous devrez implémenter l'appel à l'API YouTube
    // Pour l'exemple, nous utilisons des résultats fictifs
    setSearchResults([
      { id: "yt1", title: "Chanson 1", artist: "Artiste 1" },
      { id: "yt2", title: "Chanson 2", artist: "Artiste 2" },
    ])
  }

  const addSong = (result: any) => {
    const newSong = {
      id: result.id,
      title: result.title,
      artist: result.artist,
      likes: 0,
      isLiked: false,
      youtubeId: result.id,
    }
    setSongs([...songs, newSong])
  }

  const toggleLike = (songId: string) => {
    setSongs(
      songs.map((song) => {
        if (song.id === songId) {
          return {
            ...song,
            likes: song.isLiked ? song.likes - 1 : song.likes + 1,
            isLiked: !song.isLiked,
          }
        }
        return song
      }),
    )
  }

  const playSong = (song: Song) => {
    setCurrentSong(song)
    setIsPlaying(true)
  }

  // Trier les chansons par nombre de likes
  const sortedSongs = [...songs].sort((a, b) => b.likes - a.likes)

  return (
      <div className="container max-w-full mx-auto px-6">
        {/* Current Song */}
        <div className="bg-[var(--color-accent)] rounded-xl p-6 mb-4 flex justify-between items-center">
          <div>
            <h2 className="text-white text-xl font-semibold">{currentSong.title}</h2>
            <p className="text-white/80">{currentSong.artist}</p>
          </div>
          <div className="flex items-center gap-4">
          <button onClick={() => setIsPlaying(!isPlaying)} className="w-8 h-8 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {isPlaying ? (
                  <motion.div
                    key="pause"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Pause className="w-8 h-8 text-white fill-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="play"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[var(--color-primary)] border-none text-[var(--color-accent)] placeholder:text-[var(--color-accent)]/50"
                  />
                  <Button onClick={handleSearch} className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white">
                    Rechercher
                  </Button>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => addSong(result)}
                        className="w-full p-3 bg-[var(--color-primary)] rounded-lg text-left hover:bg-[var(--color-accent)] hover:text-white transition-colors"
                      >
                        <div className="font-semibold">{result.title}</div>
                        <div className="text-sm opacity-80">{result.artist}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Song List */}
        <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
          <AnimatePresence>
            {sortedSongs.map((song) => (
              <motion.div
                key={song.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-[var(--color-background)] backdrop-blur-sm rounded-xl px-6 py-3 flex justify-between items-center"
              >
                <button className="flex-1 text-left" onClick={() => playSong(song)}>
                  <div className="text-[var(--color-accent)] font-semibold mb-0">{song.title}</div>
                  <div className="text-[var(--color-accent)]/70 mt-0">{song.artist}</div>
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--color-accent)] font-semibold">{song.likes}</span>
                  <button onClick={() => toggleLike(song.id)} className="group">
                    <Heart
                      className={`w-6 h-6 ${
                        song.isLiked ? "fill-[var(--color-accent)] text-[var(--color-accent)]" : "text-[var(--color-accent)] group-hover:fill-[var(--color-accent)]/20"
                      }`}
                    />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
  )
}