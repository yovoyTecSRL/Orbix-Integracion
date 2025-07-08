const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos para avatares
app.use('/avatars', express.static(path.join(__dirname, 'public/avatars')));

// Configuración de multer para subida de avatares
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, 'public/avatars');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Solo se permiten archivos de imagen (jpeg, jpg, png, gif, webp)'));
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Basic route
app.get('/', (req, res) => {
	res.json({ message: 'Server is running successfully!' });
});

// Ruta para subir avatar
app.post('/upload-avatar', upload.single('avatar'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se subió ningún archivo' });
    }
    
    const avatarUrl = `/avatars/${req.file.filename}`;
    res.json({ 
      message: 'Avatar subido exitosamente',
      avatarUrl: avatarUrl,
      filename: req.file.filename
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al subir el avatar' });
  }
});

// Ruta para obtener avatar por defecto
app.get('/api/avatar/default', (req, res) => {
  // Generar avatar por defecto usando iniciales o imagen genérica
  const defaultAvatarSvg = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="50" fill="#4F46E5"/>
      <text x="50" y="50" text-anchor="middle" dominant-baseline="central" 
            font-family="Arial" font-size="36" fill="white">U</text>
    </svg>
  `;
  
  res.set('Content-Type', 'image/svg+xml');
  res.send(defaultAvatarSvg);
});

// Ruta para obtener información del avatar
app.get('/api/avatar/:filename', (req, res) => {
  const filename = req.params.filename;
  const avatarPath = path.join(__dirname, 'public/avatars', filename);
  
  if (fs.existsSync(avatarPath)) {
    res.json({
      exists: true,
      url: `/avatars/${filename}`,
      path: avatarPath
    });
  } else {
    res.status(404).json({
      exists: false,
      message: 'Avatar no encontrado'
    });
  }
});

// Start server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
