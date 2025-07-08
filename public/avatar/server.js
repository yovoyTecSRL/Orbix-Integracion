// server.js - Proxy para OpenAI compatible con TalkingHead

const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const path = require("path");

require("dotenv").config();

const app = express();
const port = 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // sirve archivos desde el directorio public


// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
// JWT GET simulada
app.get("/jwt/get", (req, res) => {
  res.json({ token: "" });
});

app.get("/app/jwt/get", (req, res) => {
  res.json({ token: "token_orbix_2025" }); // o un JWT real si lo usás
});

// GTTS simulado (voz)
app.post("/gtts/", (req, res) => {
  // Retorna una URL de audio simulada o un audio base64
  res.json({
    audio: "data:audio/mp3;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=",
  });
});




app.get("/siteconfig.js", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "siteconfig.js")); // archivo en el directorio public
});

// Servir archivo de configuración
app.get("/config/config.js", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "config", "config.js"));
});

// Ruta simulada: /openai/v1/moderations
app.post("/openai/v1/moderations", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/moderations",
      req.body,
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error("❌ Error en moderación:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Ruta simulada: /openai/v1/chat/completions
app.post("/openai/v1/chat/completions", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      req.body,
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error("❌ Error en completions:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor Orbix OpenAI Proxy activo en http://localhost:${port}`);
});
