import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000;

let books = [
  {
    id: 1,
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    price: 350,
    category: 'Fiction'
  },
  {
    id: 2,
    title: 'Clean Code',
    author: 'Robert C. Martin',
    price: 550,
    category: 'Programming'
  },
  {
    id: 3,
    title: 'Atomic Habits',
    author: 'James Clear',
    price: 450,
    category: 'Self-Help'
  }
];

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  if (method === 'GET' && pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<!DOCTYPE html><html><head><title>Library Management</title></head><body><h1>Welcome to Library Book Management Web Application</h1><p>Visit <a href="/home">/home</a> to open the application.</p><p>Visit <a href="/books">/books</a> to view books JSON.</p><p>Visit <a href="/about">/about</a> to read about the application.</p></body></html>');
    return;
  }

  if (method === 'GET' && pathname === '/books') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(books));
    return;
  }

  if (method === 'GET' && pathname === '/about') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      application: 'Library Book Management Web Application',
      version: '1.0.0',
      description: 'Node.js Full Stack Development Lab Examination Project',
      features: ['HTTP Server with built-in modules', 'Static file serving with FS module', 'Express REST API with full CRUD']
    }));
    return;
  }

  if (method === 'GET' && pathname === '/home') {
    const filePath = path.join(__dirname, 'public', 'index.html');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error loading index.html');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
    return;
  }

  if (method === 'GET' && (pathname === '/style.css' || pathname === '/public/style.css')) {
    const filePath = path.join(__dirname, 'public', 'style.css');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('CSS Not Found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(data);
    });
    return;
  }

  if (method === 'GET' && (pathname === '/script.js' || pathname === '/public/script.js')) {
    const filePath = path.join(__dirname, 'public', 'script.js');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('JavaScript Not Found');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'application/javascript' });
      res.end(data);
    });
    return;
  }

  if (method === 'POST' && pathname === '/add-book') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const parsedBody = JSON.parse(body);
        const { id, title, author, price, category } = parsedBody;

        if (id === undefined || !title || !author || price === undefined) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing required fields: id, title, author, price' }));
          return;
        }

        const numericId = Number(id);
        const numericPrice = Number(price);

        if (isNaN(numericId) || isNaN(numericPrice)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'id and price must be valid numbers' }));
          return;
        }

        const existingBook = books.find(b => b.id === numericId);
        if (existingBook) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Book with this ID already exists' }));
          return;
        }

        const newBook = {
          id: numericId,
          title: String(title).trim(),
          author: String(author).trim(),
          price: numericPrice,
          category: category ? String(category).trim() : 'General'
        };

        books.push(newBook);
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Book added successfully', book: newBook }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON request format' }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Route not found' }));
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
