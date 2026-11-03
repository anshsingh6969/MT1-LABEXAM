import express from 'express';

const app = express();
const PORT = 4000;

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

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

app.get('/books', (req, res) => {
  res.json(books);
});

app.get('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid book ID' });
  }

  const book = books.find(b => b.id === id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }

  res.json(book);
});

app.post('/books', (req, res) => {
  const { id, title, author, price, category } = req.body;

  if (id === undefined || !title || !author || price === undefined) {
    return res.status(400).json({ error: 'Missing required fields: id, title, author, price' });
  }

  const numericId = Number(id);
  const numericPrice = Number(price);

  if (isNaN(numericId) || isNaN(numericPrice)) {
    return res.status(400).json({ error: 'id and price must be valid numbers' });
  }

  const exists = books.some(b => b.id === numericId);
  if (exists) {
    return res.status(400).json({ error: 'Book with this ID already exists' });
  }

  const newBook = {
    id: numericId,
    title: String(title).trim(),
    author: String(author).trim(),
    price: numericPrice,
    category: category ? String(category).trim() : 'General'
  };

  books.push(newBook);
  res.status(201).json({
    message: 'Book added successfully',
    book: newBook
  });
});

app.put('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid book ID' });
  }

  const index = books.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }

  const { title, author, price, category } = req.body;

  if (title !== undefined) {
    books[index].title = String(title).trim();
  }
  if (author !== undefined) {
    books[index].author = String(author).trim();
  }
  if (price !== undefined) {
    const numericPrice = Number(price);
    if (isNaN(numericPrice)) {
      return res.status(400).json({ error: 'price must be a valid number' });
    }
    books[index].price = numericPrice;
  }
  if (category !== undefined) {
    books[index].category = String(category).trim();
  }

  res.json({
    message: 'Book updated successfully',
    book: books[index]
  });
});

app.delete('/books/:id', (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid book ID' });
  }

  const index = books.findIndex(b => b.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Book not found' });
  }

  const deletedBook = books.splice(index, 1)[0];
  res.json({
    message: 'Book deleted successfully',
    book: deletedBook
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
