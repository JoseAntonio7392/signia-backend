const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');

// Obtener todas las lecciones
router.get('/', async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener lecciones' });
  }
});

// Obtener una lección por ID
router.get('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ error: 'Lección no encontrada' });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar lección' });
  }
});

// Agregar una lección
router.post('/', async (req, res) => {
  try {
    const lesson = new Lesson(req.body);
    await lesson.save();
    res.status(201).json(lesson);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear lección' });
  }
});

module.exports = router;