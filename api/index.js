const app = require('../server/server.js');

// Export a serverless function handler
module.exports = async (req, res) => {
    // Forward the request to our Express app
    return app(req, res);
};
