# Practical Exam Screenshots Checklist

Save your lab exam screenshots in this folder (`MT1-LABEXAM/screenshots/`) before final submission.

## Required Screenshots (According to Practical Exam PDF)

### Screenshot 1: HTTP Server Running on Port 3000
- **What to capture:** Terminal / command prompt window showing:
  ```
  node httpServer.js
  HTTP Server running at http://localhost:3000
  ```
- **Recommended filename:** `01_http_server_terminal.png`

### Screenshot 2: HTTP Server Static File Serving Using FS Module
- **What to capture:** Browser window open at `http://localhost:3000/home` showing the Dragon Ball Z-themed Library Web Application successfully loaded and rendered via `fs.readFile()`.
- **Recommended filename:** `02_fs_module_home_page.png`

### Screenshot 3: EchoAPI - GET All Books
- **Method:** `GET`
- **URL:** `http://localhost:4000/books`
- **What to capture:** EchoAPI / Postman window showing HTTP Status 200 OK and JSON array of books.
- **Recommended filename:** `03_echoapi_get_all_books.png`

### Screenshot 4: EchoAPI - GET Book by ID
- **Method:** `GET`
- **URL:** `http://localhost:4000/books/1`
- **What to capture:** EchoAPI / Postman window showing HTTP Status 200 OK and single book object for ID 1.
- **Recommended filename:** `04_echoapi_get_book_by_id.png`

### Screenshot 5: EchoAPI - POST Add New Book
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
  ```
- **What to capture:** EchoAPI / Postman showing HTTP Status 201 Created and JSON response containing `"message": "Book added successfully"`.
- **Recommended filename:** `05_echoapi_post_add_book.png`

### Screenshot 6: EchoAPI - PUT Update Book
- **Method:** `PUT`
- **URL:** `http://localhost:4000/books/1`
- **Body (raw JSON):**
  ```json
  {
    "price": 399,
    "category": "Classic Literature"
  }
  ```
- **What to capture:** EchoAPI / Postman showing HTTP Status 200 OK and updated book object.
- **Recommended filename:** `06_echoapi_put_update_book.png`

### Screenshot 7: EchoAPI - DELETE Book
- **Method:** `DELETE`
- **URL:** `http://localhost:4000/books/1`
- **What to capture:** EchoAPI / Postman showing HTTP Status 200 OK and JSON response containing `"message": "Book deleted successfully"`.
- **Recommended filename:** `07_echoapi_delete_book.png`

### Screenshot 8: GitHub Commit History
- **What to capture:** GitHub repository webpage on your browser at `https://github.com/<your-username>/MT1-LABEXAM/commits/main` or terminal running `git log --oneline`.
- **Recommended filename:** `08_github_commit_history.png`
