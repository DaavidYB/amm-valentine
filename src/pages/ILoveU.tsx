"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Button from "../components/ui/button"
import Input from "../components/ui/input"
import { useNavigate } from "react-router-dom"

interface Question {
  id: number
  text: string
  type: "multiple" | "text"
  options?: string[]
  answer: string
}

const questions: Question[] = [
  {
    id: 1,
    text: "Qui suis-je ? L'amour est au cœur de mes écrits. À travers mes mots, j'ai fait vibrer les cœurs et pleurer les âmes. On me lit encore aujourd'hui, et mon nom est indissociable des histoires d'amour tragiques.",
    type: "multiple",
    options: ["Un écrivain", "Un chanteur", "Un acteur", "Un peintre"],
    answer: "Un écrivain",
  },
  {
    id: 2,
    text: 'Un amour éternel. Mes vers sont gravés dans l\'histoire, et ces mots en sont la preuve : "Mon unique amour jaillit de mon unique haine !" À qui doit-on cette citation ?',
    type: "multiple",
    options: ["Victor Hugo", "William Shakespeare", "Pablo Neruda", "Jane Austen"],
    answer: "William Shakespeare",
  },
  {
    id: 3,
    text: "Devine mon origine. Je viens d'un pays où l'on déguste du thé à toute heure, où la brume recouvre les vieilles rues pavées, et où une immense horloge veille sur la ville depuis des siècles.",
    type: "text",
    answer: "Angleterre",
  }, 
  {
    id: 4,
    text: "Mon chef-d'œuvre. Mon histoire la plus célèbre raconte l'amour impossible de deux jeunes amants, unis par le destin mais séparés par leurs familles ennemies.",
    type: "multiple",
    options: ["Orgueil et Préjugés", "Roméo et Juliette", "Les Misérables", "L'Amant"],
    answer: "Roméo et Juliette",
  },
  {
    id: 5,
    text: "Résous ce système d'équations pour découvrir où je t'attends :<br />3x + 2y = 127.86<br />5x - y = 211.18 <br /> Quelle ville correspond à ces coordonnées ?",
    type: "text",
    answer: "Vérone",
  },
]

export default function ILoveU() {
  const navigate = useNavigate()
  const [gameState, setGameState] = useState<"intro" | "playing" | "result">("intro")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<string[]>([])
  const [textAnswer, setTextAnswer] = useState("")
  const [isWrongAnswer, setIsWrongAnswer] = useState(false)

  const handleAnswer = (answer: string) => {
    if (questions[currentQuestion].answer.toLowerCase() === answer.toLowerCase()) {
      const newAnswers = [...userAnswers, answer]
      setUserAnswers(newAnswers)
      setIsWrongAnswer(false)

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
      } else {
        setGameState("result")
      }
    } else {
      setIsWrongAnswer(true)
    }
  }

  const handleTextSubmit = () => {
    handleAnswer(textAnswer)
    setTextAnswer("")
  }

  const startGame = () => {
    setGameState("playing")
  }

  const goToHome = () => {
    navigate("/")
  }

  return (
      <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
        <div className="backdrop-blur-sm rounded-2xl sm:rounded-3xl 
            p-3 sm:p-6
            w-[min(90vw,500px)] max-h-[90vh]
            flex flex-col items-center justify-center
            overflow-y-auto">
            {/* Game Content */}
            <AnimatePresence mode="wait">
                {gameState === "intro" && (
                <motion.div
                    key="intro"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[var(--color-background)] backdrop-blur-sm rounded-3xl p-6 shadow-lg"
                >
                    <h2 className="text-xl font-semibold text-[var(--color-accent)] font-bold mb-4">Scénario</h2>
                    <p className="text-[var(--color-accent)] font-regular mb-6">
                    Une mystérieuse lettre est arrivée chez toi, signée "Ton admirateur secret". Pour découvrir qui t'a
                    écrit et où te rendre pour le rencontrer, tu devras résoudre 5 énigmes. À chaque bonne réponse, tu te
                    rapproches de la vérité… Es-tu prêt(e) à jouer ?
                    </p>
                    <Button onClick={startGame} className="w-full bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent)]/90">
                    Commencer l'enquête
                    </Button>
                </motion.div>
                )}

                {gameState === "playing" && (
                <motion.div
                    key="question"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 sm:p-5 md:p-6"
                >
                    <h2 className="text-xs sm:text-sm md:text-base font-semibold text-[var(--color-accent)] font-bold mb-1 sm:mb-2 md:mb-3">Indice {currentQuestion + 1}</h2>
                    <p className="text-[var(--color-accent)] font-regular mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base" dangerouslySetInnerHTML={{ __html: questions[currentQuestion].text }} />

                    {questions[currentQuestion].type === "multiple" ? (
                    <div className="space-y-1 sm:space-y-2 md:space-y-3">
                        {questions[currentQuestion].options?.map((option, index) => (
                        <Button
                            key={index}
                            onClick={() => handleAnswer(option)}
                            className="w-full bg-[var(--color-primary)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white text-xs sm:text-sm md:text-base"
                        >
                            {option}
                        </Button>
                        ))}
                    </div>
                    ) : (
                    <div className="space-y-1 sm:space-y-2 md:space-y-3">
                        <Input
                        type="text"
                        value={textAnswer}
                        onChange={(e) => setTextAnswer(e.target.value)}
                        placeholder="Votre réponse..."
                        className="bg-[var(--color-primary)] w-full border-none text-[var(--color-accent)] placeholder:text-[var(--color-accent)]/50 text-xs sm:text-sm md:text-base"
                        />
                        <Button onClick={handleTextSubmit} className="w-full bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent)]/90 text-xs sm:text-sm md:text-base">
                        Je tente ^^
                        </Button>
                    </div>
                    )}

                    {isWrongAnswer && <p className="text-[var(--color-accent)] font-bold mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base">Mauvaise réponse. Essayez encore !</p>}
                </motion.div>
                )}

                {gameState === "result" && (
                <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-[var(--color-background)] backdrop-blur-sm rounded-3xl p-6 shadow-lg flex flex-col items-center justify-center"
                >
                    <h2 className="text-2xl font-bold text-[var(--color-accent)] mb-4">Félicitations !</h2>
                    <p className="text-[var(--color-accent)] mb-6">
                    Tu as résolu l'énigme ! Ton expéditeur secret était William Shakespeare, et le lieu de votre rendez-vous
                    est Vérone, en Italie. Peut-être qu'un amour digne des plus belles tragédies t'y attend…
                    </p>
                    <Button onClick={goToHome} className="bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent)]/90">
                    J'y vais quand même :(
                    </Button>
                </motion.div>
                )}
            </AnimatePresence>
        </div>
    </div>
  )
}
