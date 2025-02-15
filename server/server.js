const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware pour logger toutes les requêtes
app.use(async (req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    
    // Connexion à MongoDB pour chaque requête
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Erreur de connexion MongoDB:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

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