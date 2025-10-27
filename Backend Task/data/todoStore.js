const fs = require('fs').promises;
const path = require('path');

const dataFile = path.join(__dirname, 'todos.json');

// Initialize todos.json if it doesn't exist
async function initializeDataFile() {
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify([], null, 2));
  }
}

// Get all todos
async function getTodos() {
  await initializeDataFile();
  const data = await fs.readFile(dataFile, 'utf8');
  return JSON.parse(data);
}

// Save todos
async function saveTodos(todos) {
  await fs.writeFile(dataFile, JSON.stringify(todos, null, 2));
}

// Add a new todo
async function addTodo(todo) {
  const todos = await getTodos();
  const newTodo = {
    id: Date.now().toString(),
    title: todo.title,
    completed: false,
    ...todo
  };
  todos.push(newTodo);
  await saveTodos(todos);
  return newTodo;
}

// Update a todo
async function updateTodo(id, updates) {
  const todos = await getTodos();
  const index = todos.findIndex(todo => todo.id === id);
  if (index === -1) return null;
  
  todos[index] = { ...todos[index], ...updates };
  await saveTodos(todos);
  return todos[index];
}

// Delete a todo
async function deleteTodo(id) {
  const todos = await getTodos();
  const index = todos.findIndex(todo => todo.id === id);
  if (index === -1) return false;
  
  todos.splice(index, 1);
  await saveTodos(todos);
  return true;
}

module.exports = {
  getTodos,
  addTodo,
  updateTodo,
  deleteTodo
};