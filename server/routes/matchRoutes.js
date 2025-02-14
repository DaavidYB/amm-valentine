const express = require("express");
const { submitQuiz, getMatch } = require("../controllers/matchController");

const router = express.Router();

router.post("/submit", submitQuiz); // Enregistre un utilisateur
router.get("/match/:userId/:mode", getMatch); // Récupère le match en fonction du mode

module.exports = router;
