import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Input from "../components/ui/input";
import Button from "../components/ui/button";
import { submitQuiz, getMatch } from "../services/api";
import { questions } from "../constants/questions";
import { useMode } from '@/context/ModeContext';

function Match() {
    const { mode } = useMode();
    const [step, setStep] = useState<"welcome" | "quiz" | "result">("welcome");
    const [name, setName] = useState("");
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [matchResult, setMatchResult] = useState<{ name: string; compatibility: string } | null>(null);

    // 🔹 Vérifie si l'utilisateur a déjà joué
    useEffect(() => {
        const storedUserId = localStorage.getItem("miage_match_user");
        if (storedUserId) {
            fetchMatch(storedUserId, mode); // Mode dépendant du choix de l'utilisateur
            setStep("result");
        }
    }, [mode]); // Si l'utilisateur change de mode, il récupère un match correspondant

    const handleStart = () => {
        if (name.trim()) {
            setStep("quiz");
        }
    };

    const handleAnswer = (answerIndex: number) => {
        const newAnswers = [...answers, answerIndex];
        setAnswers(newAnswers);

        if (currentQuestion === questions.length - 1) {
            // 🔹 Envoie des réponses au backend
            submitQuiz(name, newAnswers).then((response) => {
                if (response.userId) {
                    localStorage.setItem("miage_match_user", response.userId);
                    fetchMatch(response.userId, mode);
                }
            });
            setStep("result");
        } else {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const fetchMatch = async (userId: string, mode: "love" | "anti-love") => {
        const result = await getMatch(userId, mode);
        if (result.match) {
            setMatchResult(result.match);
        } else {
            setMatchResult({ name: "Aucun match trouvé, réessaye plus tard ! :(", compatibility: "Aucune" });
        }
    };

    return (
        <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
            <div className="bg-[var(--color-background)] backdrop-blur-sm rounded-2xl sm:rounded-3xl 
                p-3 sm:p-6
                w-[min(90vw,500px)] h-[min(90vw,500px)]
                flex flex-col items-center justify-center
                overflow-y-auto">
                <AnimatePresence mode="wait">
                    {step === "welcome" && (
                        <motion.div
                            key="welcome"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full text-center"
                        >
                            <div className="flex justify-center">
                                <Input
                                    type="text"
                                    placeholder="Entre ton prénom"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="min-w-50 mb-4 bg-[var(--color-primary)] border-0 placeholder:text-[var(--color-accent)]/50 text-[var(--color-accent)]"
                                />
                            </div>
                            <Button onClick={handleStart} className="min-w-50 bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90">
                                Commencer
                            </Button>
                        </motion.div>
                    )}

                    {step === "quiz" && (
                        <motion.div
                            key="quiz"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full px-2 sm:px-4"
                        >
                            <div className="text-center mb-2 sm:mb-4">
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--color-accent)] mb-1">
                                    {questions[currentQuestion].text}
                                </h2>
                                <p className="text-xs sm:text-sm text-[var(--color-accent)]/60">
                                    {currentQuestion + 1}/{questions.length}
                                </p>
                            </div>
                            <div className="space-y-2 sm:space-y-3 flex flex-col items-center">
                                {questions[currentQuestion].options.map((option, index) => (
                                    <button
                                        key={option}
                                        onClick={() => handleAnswer(index)}
                                        className="w-[95%] sm:w-[85%] p-2 sm:p-3 md:p-4 
                                            rounded-xl sm:rounded-2xl 
                                            bg-[var(--color-primary)] text-[var(--color-accent)]
                                            hover:bg-[var(--color-accent)] hover:text-white 
                                            text-sm sm:text-base font-bold 
                                            transition-colors duration-200"
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === "result" && matchResult && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="text-center px-2 sm:px-4"
                        >
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--color-accent)] mb-2 sm:mb-4">
                                Ton match est
                            </h2>
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-accent)] mb-2">
                                {matchResult.name}
                            </div>
                            <p className="text-sm sm:text-base text-[var(--color-accent)]/70">
                                Compatibilité : {matchResult.compatibility}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default Match;
