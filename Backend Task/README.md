# Todo CRUD API

A simple REST API for managing todo items with basic CRUD operations.

## Features

- Create, Read, Update, and Delete todo items
- Data persistence using local JSON file
- Input validation
- RESTful API design
- Proper error handling and status codes

## Requirements

- Node.js 14+ installed
- npm (comes with Node.js)

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on port 3000 by default. You can change this by setting the `PORT` environment variable.

## API Endpoints

### GET /todos
- Gets all todos
- Response: Array of todo items

### POST /todos
- Creates a new todo
- Request body:
  ```json
  {
    "title": "Your todo title",
    "completed": false
  }
  ```
- Response: Created todo item

### PUT /todos/:id
- Updates a todo by ID
- Request body:
  ```json
  {
    "title": "Updated title",
    "completed": true
  }
  ```
- Response: Updated todo item

### DELETE /todos/:id
- Deletes a todo by ID
- Response: 204 No Content

## Error Handling

The API includes proper error handling for:
- Invalid input data
- Not found resources
- Server errors

## Data Structure

Todo items are stored with the following structure:
```json
{
  "id": "1635345624",
  "title": "Example todo",
  "completed": false
}
```