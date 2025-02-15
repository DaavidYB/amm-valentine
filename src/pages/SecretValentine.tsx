"use client"

import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Button from "../components/ui/button"
import Input from "../components/ui/input"
import { fetchMessages, addMessage } from '../services/api'

interface Message {
  _id: string
  content: string
  position: {
    x: number
    y: number
  }
  velocity: {
    x: number
    y: number
  }
}

export default function SecretValentine() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  // Récupérer les messages au démarrage du composant
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const fetchedMessages = await fetchMessages()
        setMessages(fetchedMessages.map((msg) => ({
          ...msg,
          position: getRandomPosition(),
          velocity: getRandomVelocity(),
        })))
      } catch (error) {
        console.error('Erreur lors de la récupération des messages:', error)
      }
    }

    loadMessages()
  }, [])

  const getRandomPosition = useMemo(() => {
    return () => {
      if (!containerRef.current) return { x: 50, y: 50 }
      const { width, height } = containerRef.current.getBoundingClientRect()
  
      const safeMargin = 120 // Évite d'apparaître en dehors de l'écran
      return {
        x: Math.random() * (width - safeMargin * 2) + safeMargin,
        y: Math.random() * (height - safeMargin * 2) + safeMargin,
      }
    }
  }, [])

  const getRandomVelocity = useCallback(
    () => ({
      x: (Math.random() - 0.5) * 0.5,
      y: (Math.random() - 0.5) * 0.5,
    }),
    [],
  )

  const addNewMessage = useCallback(async () => {
    if (newMessage.trim()) {
      try {
        // Envoi du message via l'API
        const newMsg = await addMessage(newMessage)

        // Ajout du message avec la position et la vélocité
        setMessages((prev) => [
          ...prev,
          {
            ...newMsg,
            position: getRandomPosition(),
            velocity: getRandomVelocity(),
          },
        ])
        setNewMessage("")  // Réinitialiser le champ du message
      } catch (error) {
        console.error('Erreur lors de l\'ajout du message:', error)
      }
    }
  }, [newMessage, getRandomPosition, getRandomVelocity])

  useEffect(() => {
    let animationFrameId: number

    const animate = () => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => {
          if (!containerRef.current) return msg

          const { width, height } = containerRef.current.getBoundingClientRect()
          const newX = msg.position.x + msg.velocity.x
          const newY = msg.position.y + msg.velocity.y
          let newVelocityX = msg.velocity.x
          let newVelocityY = msg.velocity.y

          // Permettre aux bulles de sortir partiellement (la moitié de leur taille)
          if (newX <= -100 || newX >= width - 100) {
            newVelocityX = -newVelocityX
          }
          if (newY <= -100 || newY >= height - 100) {
            newVelocityY = -newVelocityY
          }

          return {
            ...msg,
            position: { x: newX, y: newY },
            velocity: { x: newVelocityX, y: newVelocityY },
          }
        }),
      )

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div>
      {/* Messages Container */}
      <div ref={containerRef} className="fixed inset-0 overflow-hidden">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message._id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: message.position.x,
                y: message.position.y,
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 10,
              }}
              className="absolute w-48 h-48 bg-[var(--color-background)]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-center p-4 cursor-pointer hover:bg-white/90 transition-colors"
            >
              <span className="text-[var(--color-accent)] font-medium">{message.content}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-28 z-50">
        <div className="container max-w-2xl mx-auto flex flex-col items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <button className="w-12 h-12 z-51 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-white hover:bg-[var(--color-accent)]/90 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <Plus className="w-6 h-6" />
              </button>
            </DialogTrigger>

            <DialogContent className="bg-[var(--color-background)] backdrop-blur-sm border-none">

              <DialogHeader>
                <DialogTitle className="text-[var(--color-accent)]">Ajouter un message secret</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <Input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrivez votre message..."
                  className="bg-[var(--color-primary)] w-full border-none text-[var(--color-accent)] placeholder:text-[var(--color-accent)]/50"
                />

                <Button onClick={addNewMessage} className="w-full bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90 text-white">
                  Envoyer
                </Button>

              </div>

            </DialogContent>

          </Dialog>
        </div>
      </div>
    </div>
  )
}