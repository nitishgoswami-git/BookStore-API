## BookStore-API – API Endpoint Overview

This project is a RESTful API for managing books, users, and orders in a bookstore system.

### Example Endpoint Structure

Assuming the API base URL is:
```
http://:/api
```

---

### 1. **Book Endpoints**

| Method | Endpoint             | Description                       |
|--------|----------------------|-----------------------------------|
| GET    | `/api/books`         | Get all books                     |
| GET    | `/api/books/:id`     | Get a specific book by ID         |
| POST   | `/api/books`         | Add a new book                    |
| PUT    | `/api/books/:id`     | Update a book by ID               |
| DELETE | `/api/books/:id`     | Delete a book by ID               |

---

### 2. **User Endpoints**

| Method | Endpoint              | Description                       |
|--------|-----------------------|-----------------------------------|
| POST   | `/api/users/register` | Register a new user               |
| POST   | `/api/users/login`    | User login                        |
| GET    | `/api/users/profile`  | Get current user profile          |
| PUT    | `/api/users/profile`  | Update user profile               |

---

### 3. **Order Endpoints**

| Method | Endpoint             | Description                       |
|--------|----------------------|-----------------------------------|
| POST   | `/api/orders`        | Place a new order                 |
| GET    | `/api/orders`        | Get all orders for current user   |
| GET    | `/api/orders/:id`    | Get order details by ID           |

---

### 4. **(Optional) Review Endpoints**

If book reviews are supported:

| Method | Endpoint                               | Description                       |
|--------|----------------------------------------|-----------------------------------|
| POST   | `/api/books/:bookId/reviews`           | Add a review to a book            |
| GET    | `/api/books/:bookId/reviews`           | Get all reviews for a book        |

---

### How to Find the Exact Endpoints

- **Check the `src/routes` folder** in the repository for route definitions.
- **Look for Swagger/OpenAPI docs** or README documentation if available.
- **Review the `app.js` or `server.js` file** for how routes are mounted.

---

## Example Usage

Suppose your API runs at `http://localhost:3000`:

- Get all books:  
  `GET http://localhost:3000/api/books`
- Register a user:  
  `POST http://localhost:3000/api/users/register`
- Place an order:  
  `POST http://localhost:3000/api/orders`
