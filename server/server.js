const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Initialisation de l'app Express
const app = express();

// Configuration CORS
app.use(cors());
app.use(express.json());

// Connexion MongoDB une seule fois
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) {
        console.log('Using cached database connection');
        return cachedDb;
    }
    console.log('Creating new database connection');
    try {
        const db = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        cachedDb = db;
        return db;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

// Middleware pour s'assurer que la connexion est établie
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        console.error('Erreur de connexion MongoDB:', error);
        res.status(500).json({ error: 'Database connection failed' });
    }
});

// app.use(cors({
//     origin: process.env.VERCEL_ENV === 'production'
//       ? process.env.VERCEL_URL
//       : 'http://localhost:5001'
// }));
// app.use(express.json());

// Routes
app.use("/api", require("./routes/matchRoutes"));
app.use("/api", require("./routes/playlist"));
app.use("/api", require("./routes/message"));

// Gestion d'erreur globale
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        message: 'Server error',
        error: err.message
    });
});

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = app;
