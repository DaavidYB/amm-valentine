const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api", require("./routes/matchRoutes"));
app.use("/api", require("./routes/playlist"));
app.use("/api", require("./routes/message"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));
