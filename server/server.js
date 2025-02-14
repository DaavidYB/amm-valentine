const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();
connectDB();

app.use(cors({
    origin: process.env.VERCEL_ENV === 'production'
      ? process.env.VERCEL_URL
      : 'http://localhost:5001'
}));
app.use(express.json());

app.use("/api", require("./routes/matchRoutes"));
app.use("/api", require("./routes/playlist"));
app.use("/api", require("./routes/message"));

module.exports = app;
