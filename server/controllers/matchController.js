const User = require("../models/User");

// 🔹 Enregistrement des réponses d'un utilisateur
exports.submitQuiz = async (req, res) => {
    try {
        const { name, answers } = req.body;

        // 🔥 Pas de blocage si un autre utilisateur a le même nom → un nouvel ID est généré
        const user = new User({ name, answers });
        await user.save();

        res.json({ userId: user._id });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// 🔹 Calcul de la distance entre deux vecteurs de réponses
const calculateDistance = (answers1, answers2) => {
    return Math.sqrt(answers1.reduce((acc, answer, index) => acc + Math.pow(answer - answers2[index], 2), 0));
};

const MAX_DISTANCE = Math.sqrt(10 * Math.pow(3, 2)); // ≈ 9.49

// Fonction pour calculer la compatibilité en pourcentage
const calculateCompatibility = (distance) => {
    return Math.max(0, (1 - distance / MAX_DISTANCE) * 100).toFixed(1); // Pourcentage entre 0 et 100
};

// 🔹 Trouver un match basé sur le mode
exports.getMatch = async (req, res) => {
    try {
        const { userId, mode } = req.params;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        // Récupérer tous les autres utilisateurs
        const users = await User.find({ _id: { $ne: userId } });

        if (users.length === 0) return res.json({ match: null });

        let bestMatch = null;
        let bestDistance = mode === "love" ? Infinity : -Infinity; // Distance min pour love, max pour anti-love

        users.forEach((otherUser) => {
            const distance = calculateDistance(user.answers, otherUser.answers);

            if (
                (mode === "love" && distance < bestDistance) ||
                (mode === "anti-love" && distance > bestDistance)
            ) {
                bestMatch = otherUser;
                bestDistance = distance;
            }
        });

        res.json({
            match: bestMatch ? { name: bestMatch.name, compatibility: calculateCompatibility(bestDistance) + "%" } : null,
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};
