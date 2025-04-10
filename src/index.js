const express = require('express');
const connectDB = require('./db');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Conectar a la base de datos
connectDB();

// Rutas
app.get('/api', (req, res) => {
  res.json({ message: 'Bienvenido al backend de Signia' });
});

app.post('/api/translate', (req, res) => {
  const { signData } = req.body;
  if (!signData) {
    return res.status(400).json({ error: 'Faltan datos de señas' });
  }
  const translatedText = `Traducción simulada de: ${signData}`;
  res.json({ text: translatedText });
});

const lessonsRouter = require('./routes/lessons');
app.use('/api/lessons', lessonsRouter);

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});