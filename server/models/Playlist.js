const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  title: String,
  artist: String,
  url: String,
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // ✅ Qui a ajouté la musique
});

const playlistSchema = new mongoose.Schema({
  mode: { type: String, enum: ["love", "anti-love"], required: true },
  songs: [songSchema],
});

module.exports = mongoose.model("Playlist", playlistSchema);
