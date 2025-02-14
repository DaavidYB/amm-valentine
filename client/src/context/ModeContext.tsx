import React, { createContext, useContext, useState, useEffect } from "react"

type Mode = "love" | "anti-love"

interface ModeContextType {
  mode: Mode
  toggleMode: () => void
}

const ModeContext = createContext<ModeContextType | undefined>(undefined)

export const ModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<Mode>(() => {
    return (localStorage.getItem("mode") as Mode) || "love"
  })

  const toggleMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "love" ? "anti-love" : "love"
      localStorage.setItem("mode", newMode) // Sauvegarde dans le localStorage
      return newMode
    })
  }

  useEffect(() => {
    localStorage.setItem("mode", mode) // Mise à jour du localStorage
    document.body.classList.toggle("anti-love-mode", mode === "anti-love");
  }, [mode])

  return (
    <ModeContext.Provider value={{ mode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  )
}

export const useMode = (): ModeContextType => {
  const context = useContext(ModeContext)
  if (!context) {
    throw new Error("useMode must be used within a ModeProvider")
  }
  return context
}
