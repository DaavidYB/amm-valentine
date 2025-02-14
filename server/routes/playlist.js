const express = require("express");
const Playlist = require("../models/Playlist");
const PlaylistUser = require("../models/PlaylistUser");
const router = express.Router();
const axios = require("axios");

// 🎵 Récupérer la playlist (love ou anti-love)
// router.get("/playlist/:mode", async (req, res) => {
//   try {
//     const { mode } = req.params;
//     const playlist = await Playlist.findOne({ mode }) || new Playlist({ mode, songs: [] });
//     res.json(playlist.songs.sort((a, b) => b.likes - a.likes)); // Tri par likes
//   } catch (error) {
//     res.status(500).json({ message: "Erreur serveur", error });
//   }
// });
router.get("/playlist/:mode", async (req, res) => {
    try {
      const { mode } = req.params;
      const { userId } = req.query; // On récupère l'ID utilisateur
  
      const playlist = await Playlist.findOne({ mode }) || new Playlist({ mode, songs: [] });
  
      // Ajouter `isLiked` et trier les chansons
      const sortedSongs = playlist.songs
        .map(song => ({
          ...song.toObject(),
          isLiked: song.likedBy.includes(userId), // Vérification directe dans likedBy
        }))
        .sort((a, b) => b.likes - a.likes); // Trie par likes
  
      res.json(sortedSongs);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur", error });
    }
  });
  
  

// ➕ Ajouter une chanson à la playlist
router.post("/playlist/:mode/add", async (req, res) => {
    try {
        const { mode } = req.params;
        const { title, artist, url, userId } = req.body;

        // Vérification si la chanson existe déjà dans la playlist
        let playlist = await Playlist.findOne({ mode });
        if (!playlist) playlist = new Playlist({ mode, songs: [] });

        // Vérification de la chanson
        const existingSong = playlist.songs.find(song => song.title === title && song.artist === artist);
        if (existingSong) {
            return res.status(400).json({ message: "Cette chanson existe déjà dans la playlist." });
        }

        // Ajout de la nouvelle chanson à la playlist
        playlist.songs.push({ title, artist, url, addedBy: userId });
        await playlist.save();

        res.status(201).json({
            message: "Chanson ajoutée avec succès",
            songs: playlist.songs,
        });          
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});


// ❤️ Liker une chanson (1 seul like par utilisateur)
router.post("/playlist/:mode/like/:songId", async (req, res) => {
    console.log("🔍 Requête reçue:", req.params, req.body);

    try {
      const { mode, songId } = req.params;
      const { userId } = req.body;

    //   console.log("✅ userId:", userId, "songId:", songId);
  
      const playlist = await Playlist.findOne({ mode });
      if (!playlist) return res.status(404).json({ message: "Playlist introuvable" });
  
      const song = playlist.songs.id(songId);
      if (!song) return res.status(404).json({ message: "Chanson introuvable" });
  
      // Vérifier si l'utilisateur a déjà liké
      const hasLiked = song.likedBy.includes(userId);
  
      if (hasLiked) {
        // 🛑 Si déjà liké, on retire le like
        song.likes--;
        song.likedBy = song.likedBy.filter((id) => id.toString() !== userId);
      } else {
        // ✅ Sinon, on ajoute un like
        song.likes++;
        song.likedBy.push(userId);
      }
  
      await playlist.save();
      res.json({ likes: song.likes, isLiked: !hasLiked });
    } catch (error) {
        console.error("❌ Erreur serveur:", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
  });

// 🎵 Créer un utilisateur pour la playlist
router.post("/playlist/user", async (req, res) => {
  try {
    // Créer un nouvel utilisateur dans la base de données
    const newUser = new PlaylistUser();
    await newUser.save();  // Sauvegarder l'utilisateur dans la base de données

    // Renvoyer l'_id de l'utilisateur créé comme userId
    res.status(201).json({ userId: newUser._id });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de l'utilisateur", error });
  }
});

// router.get("/playlist/search/:query", async (req, res) => {
//   try {
//     const { query } = req.params;
//     const response = await axios.get(`https://api.deezer.com/search?q=${query}`);

//     const results = response.data.data.map((track) => ({
//       id: track.id,
//       title: track.title,
//       artist: track.artist.name,
//       url: track.preview, // Lien MP3 de 30 secondes (gratos !)
//     }));

//     res.json(results);
//   } catch (error) {
//     res.status(500).json({ message: "Erreur lors de la recherche", error });
//   }
// });

router.get("/playlist/search/:query", async (req, res) => {
    try {
      const { query } = req.params;
      const response = await axios.get(`https://api.deezer.com/search?q=${query}`);
  
      // Vérifie que response.data.data est bien un tableau
      const results = Array.isArray(response.data.data) ? response.data.data.map((track) => ({
        id: track.id,
        title: track.title,
        artist: track.artist.name,
        url: track.preview,
      })) : [];
  
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la recherche", error });
    }
});
  

module.exports = router;