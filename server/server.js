const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

console.log('Démarrage du serveur...');

const app = express();

// Middleware pour logger toutes les requêtes
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

// Connexion à MongoDB
const dbConnected = await connectDB();

app.use(cors({
    origin: process.env.VERCEL_ENV === 'production'
      ? process.env.VERCEL_URL
      : 'http://localhost:5001'
}));
app.use(express.json());

app.use("/api", require("./routes/matchRoutes"));
app.use("/api", require("./routes/playlist"));
app.use("/api", require("./routes/message"));

// Middleware de gestion d'erreur global
app.use((err, req, res, next) => {
    console.error('Erreur serveur:', err);
    res.status(500).json({
        message: 'Erreur serveur',
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

module.exports = app;
