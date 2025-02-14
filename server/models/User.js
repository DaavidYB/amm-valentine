const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    answers: { type: [Number], required: true }, // Stocke les réponses sous forme de tableau de nombres
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
