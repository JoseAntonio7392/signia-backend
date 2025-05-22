const express = require('express');
const router = express.Router();
./index
router.get('/signs', (req, res) => {
  const signs = [
    'Hola', 'No', 'Sí', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes',
    'Adiós', 'Buenas noches', 'Buenos días', 'Nos vemos', 'Cómo estás',
    'Cómo te llamas', 'Mucho gusto', 'Amarillo', 'Azul', 'Rojo', 'Verde',
    'Rosa', 'Negro', 'Morado', 'Gris', 'Café', 'Naranja', 'Blanco',
    'Papá', 'Mamá', 'Hermano', 'Hermana', 'Abuelo', 'Abuela'
  ];
  res.json({ message: 'Lista de gestos disponibles', signs });
});

router.post('/predict', (req, res) => {
  const imageData = req.body.image; // Imagen desde la cámara
  // Placeholder hasta que implementemos el modelo
  const prediction = 'Hola';
  res.json({ prediction });
});

module.exports = router;