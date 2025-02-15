const app = require('../server/server.js');
const connectDB = require('../server/config/db');

// Export a serverless function handler
module.exports = async (req, res) => {
    try {
        // Connexion à MongoDB
        await connectDB();
        
        // Forward the request to our Express app
        return new Promise((resolve, reject) => {
            app(req, res);
            res.on('finish', resolve);
            res.on('error', reject);
        });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ 
            error: 'Internal Server Error',
            message: error.message 
        });
    }
};
