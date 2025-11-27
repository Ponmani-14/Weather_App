const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
require("dotenv").config(); // Must be at the top

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.static(path.join(__dirname, ".."))); // Serve frontend

// Debug: Make sure API_KEY is loaded
console.log("Loaded API_KEY:", process.env.API_KEY);

// Home route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html"));
});

// Weather API route
app.get("/weather/:city", async (req, res) => {
    const city = req.params.city;
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
        return res.status(500).json({ message: "API_KEY is missing in server environment" });
    }

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather`,
            {
                params: {
                    q: city,
                    appid: apiKey,
                    units: "metric",
                },
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error("OpenWeatherMap API error:", error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            message: error.response?.data?.message || error.message,
        });
    }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
