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
        <div className="px-6 w-full flex justify-center">
            <div className="bg-[var(--color-background)] backdrop-blur-sm rounded-3xl p-8 max-w-[500px] w-full sm:w-[90%] md:w-[500px] h-[500px] flex flex-col items-center justify-center">
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
                            className="w-full"
                        >
                            <div className="text-center mb-4">
                                <h2 className="text-2xl font-bold text-[var(--color-accent)] mb-1">{questions[currentQuestion].text}</h2>
                                <p className="text-sm text-[var(--color-accent)]/60">
                                    {currentQuestion + 1}/{questions.length}
                                </p>
                            </div>
                            <div className="space-y-3 flex flex-col items-center">
                                {questions[currentQuestion].options.map((option, index) => (
                                    <button
                                        key={option}
                                        onClick={() => handleAnswer(index)}
                                        className="w-full sm:w-[70%] md:w-[80%] h-17 p-4 rounded-2xl bg-[var(--color-primary)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white font-bold transition-colors duration-200"
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
                            className="text-center"
                        >
                            <h2 className="text-2xl font-bold text-[var(--color-accent)] mb-4">Ton match est</h2>
                            <div className="text-4xl font-bold text-[var(--color-accent)] mb-2">{matchResult.name}</div>
                            <p className="text-md text-[var(--color-accent)]/70">Compatibilité : {matchResult.compatibility}</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default Match;
