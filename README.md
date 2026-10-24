
# Task API

A RESTful CRUD API built with Node.js, Express, and SQLite for managing tasks.

## Features

- Create a task
- Read all tasks
- Read a single task by ID
- Update a task
- Delete a task
- Input validation and error handling
- Health check endpoint
- Interactive Swagger UI documentation
- SQLite database for persistent storage
- Automatic database and table creation
- Sample tasks inserted when the table is empty

## Technologies

- Node.js
- Express.js
- SQLite
- better-sqlite3
- Swagger UI Express
- OpenAPI

## Installation

Clone the repository:

```bash
git clone https://github.com/sonukp245-dotcom/task-api.git
cd task-api
```

Install dependencies:

```bash
npm install
```

## Run the API

Start the server:

```bash
node server.js
```

The API runs at:

http://localhost:3000

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API information |
| GET | `/health` | Check API status |
| GET | `/tasks` | Get all tasks |
| GET | `/tasks/:id` | Get a task by ID |
| POST | `/tasks` | Create a task |
| PUT | `/tasks/:id` | Update a task |
| DELETE | `/tasks/:id` | Delete a task |

## Example Requests

### Create a task

```json
{
  "title": "Learn SQLite"
}
```

Send a POST request to `/tasks` with the JSON body above.

### Update a task

```json
{
  "title": "Learn SQLite",
  "done": true
}
```

Send a PUT request to `/tasks/:id`.

## Database

This project uses SQLite with the `better-sqlite3` package.

- The database file is `tasks.db`.
- The `db.js` file creates the database and the `tasks` table if they do not exist.
- Sample tasks are inserted only when the table is empty.
- Task records are stored in SQLite and remain available after the server restarts.
- The `done` field is stored as an integer: `0` for false and `1` for true.

## Swagger Documentation

Start the server and open:

http://localhost:3000/docs

## Health Check

Open:

http://localhost:3000/health

Expected response:

```json
{
  "status": "ok"
}
```

## GitHub Repository

https://github.com/sonukp245-dotcom/task-api
