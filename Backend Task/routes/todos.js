const express = require('express');
const { body, validationResult } = require('express-validator');
const todoStore = require('../data/todoStore');

const router = express.Router();

// Validation middleware
const todoValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('completed').optional().isBoolean().withMessage('Completed must be a boolean')
];

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// GET /todos - Get all todos
router.get('/', async (req, res) => {
  try {
    const todos = await todoStore.getTodos();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// POST /todos - Create a new todo
router.post('/', todoValidation, handleValidationErrors, async (req, res) => {
  try {
    const newTodo = await todoStore.addTodo(req.body);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// PUT /todos/:id - Update a todo
router.put('/:id', todoValidation, handleValidationErrors, async (req, res) => {
  try {
    const updatedTodo = await todoStore.updateTodo(req.params.id, req.body);
    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// DELETE /todos/:id - Delete a todo
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await todoStore.deleteTodo(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

module.exports = router;