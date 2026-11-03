# MT1-LABEXAM: Library Book Management Web Application

AKTU B.Tech 2nd Year Full Stack Development Practical Examination Project.

## Tech Stack
- Node.js (Runtime Environment)
- JavaScript ES6+ (ES Modules with `"type": "module"`)
- Built-in `http` Module (Part A Server)
- Built-in `fs` Module (Static File Serving)
- Express.js (Part B REST API)
- HTML5, CSS3, Vanilla JavaScript
- In-memory JavaScript Arrays for Data Storage

---

## Project Structure
```
MT1-LABEXAM/
├── package.json
├── package-lock.json
├── .gitignore
├── httpServer.js
├── expressApp.js
├── README.md
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
└── screenshots/
    └── README.md
```

---

## Server Architecture & Port Allocation

| Server | File | Port | Purpose |
| :--- | :--- | :--- | :--- |
| **HTTP Server (Part A)** | `httpServer.js` | `3000` | Demonstrates built-in `http` and `fs` modules, static HTML serving, basic routing, and POST body streaming. |
| **Express API (Part B)** | `expressApp.js` | `4000` | High-performance RESTful API powering full CRUD operations, route parameters, and JSON middleware. |

Both servers run independently without database dependencies.

---

## Execution Guide

### 1. Start Part A (HTTP Server)
Open a terminal and run:
```bash
node httpServer.js
```
Expected output:
```
HTTP Server running at http://localhost:3000
```

Available URLs:
- `http://localhost:3000/` &mdash; Welcome HTML page
- `http://localhost:3000/books` &mdash; View all books (JSON format)
- `http://localhost:3000/about` &mdash; Application metadata and specs
- `http://localhost:3000/home` &mdash; Serves `public/index.html` using the built-in `fs` module

---

### 2. Start Part B (Express REST API)
Open a second terminal and run:
```bash
node expressApp.js
```
Expected output:
```
Express Server running at http://localhost:4000
```

---

## REST API Specification (Port 4000)

### 1. GET All Books
- **Endpoint:** `GET http://localhost:4000/books`
- **Status:** `200 OK`
- **Response:** Array of all book objects

### 2. GET Book by ID
- **Endpoint:** `GET http://localhost:4000/books/:id`
- **Status:** `200 OK` (or `404 Not Found`)
- **Example:** `GET http://localhost:4000/books/1`

### 3. POST Add New Book
- **Endpoint:** `POST http://localhost:4000/books`
- **Status:** `201 Created`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "id": 4,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "price": 550,
  "category": "Programming"
}
```
- **Response Body:**
```json
{
  "message": "Book added successfully",
  "book": {
    "id": 4,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "price": 550,
    "category": "Programming"
  }
}
```

### 4. PUT Update Book
- **Endpoint:** `PUT http://localhost:4000/books/:id`
- **Status:** `200 OK` (or `404 Not Found`)
- **Example Request:**
```json
{
  "price": 499,
  "category": "Software Engineering"
}
```

### 5. DELETE Book
- **Endpoint:** `DELETE http://localhost:4000/books/:id`
- **Status:** `200 OK` (or `404 Not Found`)
- **Example:** `DELETE http://localhost:4000/books/1`

---

## Frontend Integration
The frontend in `public/index.html` features a Dragon Ball Z / Capsule Corp dark anime aesthetic and communicates with `http://localhost:4000` for dynamic data fetching, search, filtering, and live CRUD operations.
