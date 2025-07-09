// server.js - Proxy para OpenAI compatible con TalkingHead

const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const path = require("path");

require("dotenv").config();

const app = express();
const port = 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "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";

// Configurar CORS y headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Headers específicos para módulos ES6
  if (req.path.endsWith('.js') || req.path.endsWith('.mjs')) {
    res.header('Content-Type', 'application/javascript; charset=utf-8');
  }
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
});

app.use(bodyParser.json());

// Servir archivos estáticos del directorio public
app.use(express.static(path.join(__dirname, "public"), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js') || path.endsWith('.mjs')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    } else if (path.endsWith('.ttf')) {
      res.setHeader('Content-Type', 'font/ttf');
    } else if (path.endsWith('.woff') || path.endsWith('.woff2')) {
      res.setHeader('Content-Type', 'font/woff');
    }
  }
}));

// Servir archivos de configuración desde el directorio padre
app.use('/config', express.static(path.join(__dirname, '../config'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js') || path.endsWith('.mjs')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    }
  }
}));

// Servir fuentes desde el directorio fonts del avatar
app.use('/fonts', express.static(path.join(__dirname, 'fonts'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.ttf')) {
      res.setHeader('Content-Type', 'font/ttf');
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 año
    }
  }
}));


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


app.post('/completions', async (req, res) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      req.body,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error('❌ Error en completions:', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});


// GTTS simulado (voz)
app.post("/gtts/", (req, res) => {
  // Retorna una URL de audio simulada o un audio base64
  res.json({
    audio: "data:audio/mp3;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQAAAAA=",
  });
});




// Servir siteconfig.js con headers específicos
app.get("/siteconfig.js", (req, res) => {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(path.join(__dirname, "public", "siteconfig.js"));
});

// Servir archivo de configuración con headers específicos
app.get("/config/config.js", (req, res) => {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.sendFile(path.join(__dirname, "..", "config", "config.js"));
});

// Ruta simulada: /openai/v1/moderations
app.post("/openai/v1/moderations", async (req, res) => {
  try {
    if (!OPENAI_API_KEY || OPENAI_API_KEY === "") {
      return res.status(401).json({ 
        error: "API key de OpenAI no configurada",
        code: "invalid_api_key" 
      });
    }

    const response = await axios.post(
      "https://api.openai.com/v1/moderations",
      req.body,
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 10000
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error("❌ Error en moderación:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ 
      error: err.response?.data?.error?.message || err.message,
      code: err.response?.data?.error?.code || "unknown_error"
    });
  }
});

// Ruta simulada: /openai/v1/chat/completions
app.post("/openai/v1/chat/completions", async (req, res) => {
  try {
    if (!OPENAI_API_KEY || OPENAI_API_KEY === "") {
      return res.status(401).json({ 
        error: "API key de OpenAI no configurada",
        code: "invalid_api_key" 
      });
    }

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      req.body,
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error("❌ Error en completions:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ 
      error: err.response?.data?.error?.message || err.message,
      code: err.response?.data?.error?.code || "unknown_error"
    });
  }
});

// Ruta para transcripciones de audio
app.post("/openai/v1/audio/transcriptions", async (req, res) => {
  try {
    if (!OPENAI_API_KEY || OPENAI_API_KEY === "") {
      return res.status(401).json({ 
        error: "API key de OpenAI no configurada",
        code: "invalid_api_key" 
      });
    }

    const response = await axios.post(
      "https://api.openai.com/v1/audio/transcriptions",
      req.body,
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          ...req.headers,
        },
        timeout: 30000
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error("❌ Error en transcriptions:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ 
      error: err.response?.data?.error?.message || err.message,
      code: err.response?.data?.error?.code || "unknown_error"
    });
  }
});

// Rutas adicionales para evitar errores 404
app.get("/modules/talkinghead.mjs", (req, res) => {
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.sendFile(path.join(__dirname, "modules", "talkinghead.mjs"));
});

app.get("/css/main.css", (req, res) => {
  res.setHeader('Content-Type', 'text/css; charset=utf-8');
  res.sendFile(path.join(__dirname, "public", "css", "main.css"));
});

// Ruta para el favicon
app.get("/favicon.jpg", (req, res) => {
  res.sendFile(path.join(__dirname, "favicon.jpg"));
});

// Manejo de errores 404
app.use((req, res) => {
  console.log(`❌ 404 - Ruta no encontrada: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: "Ruta no encontrada", 
    path: req.path,
    method: req.method 
  });
});

// Manejo de errores del servidor
app.use((err, req, res, next) => {
  console.error('❌ Error del servidor:', err);
  res.status(500).json({ 
    error: "Error interno del servidor", 
    message: err.message 
  });
});

app.listen(port, () => {
  console.log(`🚀 Servidor Orbix OpenAI Proxy activo en http://localhost:${port}`);
});
