const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        console.log('Tentative de connexion à MongoDB...');
        console.log('MONGO_URI est défini:', !!process.env.MONGO_URI);
        
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        console.log("✅ MongoDB connecté !");
        return true;
    } catch (error) {
        console.error("❌ Erreur de connexion MongoDB :", error.message);
        console.error('Stack trace:', error.stack);
        return false;
    }
};

module.exports = connectDB;