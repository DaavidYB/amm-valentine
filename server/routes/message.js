// routes/messageRoute.js

const express = require('express');
const Message = require('../models/Message'); // Importer ton modèle Message
const router = express.Router();

// Route pour récupérer tous les messages
router.get('/message', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des messages.' });
  }
});

// Route pour ajouter un message
router.post('/message', async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: 'Le message ne peut pas être vide.' });
  }

  try {
    const newMessage = new Message({ content });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message.' });
  }
});

module.exports = router;