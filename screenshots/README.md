# Practical Exam Screenshots Checklist

Save your lab exam screenshots in this folder (`MT1-LABEXAM/screenshots/`) before final submission.

### Screenshot 1: EchoAPI - GET All Books
- **Method:** `GET`
- **URL:** `http://localhost:4000/books`

### Screenshot 2: EchoAPI - GET Book by ID
- **Method:** `GET`
- **URL:** `http://localhost:4000/books/1`

### Screenshot 3: EchoAPI - POST Add New Book
- **Method:** `POST`
- **URL:** `http://localhost:4000/books`
- **Body (raw JSON):**
  ```json
  {
    "id": 4,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "price": 550,
    "category": "Programming"
  }

### Screenshot 4: EchoAPI - PUT Update Book
- **Method:** `PUT`
- **URL:** `http://localhost:4000/books/1`
- **Body (raw JSON):**
  ```json
  {
    "price": 399,
    "category": "Classic Literature"
  }

### Screenshot 5: EchoAPI - DELETE Book
- **Method:** `DELETE`
- **URL:** `http://localhost:4000/books/1`
-
