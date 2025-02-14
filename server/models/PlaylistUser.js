const mongoose = require("mongoose");

const playlistUserSchema = new mongoose.Schema({
  // Tu peux laisser le champ userId vide et MongoDB gérera automatiquement l'ID
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PlaylistUser", playlistUserSchema);
