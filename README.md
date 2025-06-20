# Library Management API

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)

A robust REST API for library management systems with features for book inventory, borrowing, and user management.

## Features

- **Book Management**: CRUD operations for books with ISBN validation
- **Borrowing System**: Track book loans with due dates
- **Inventory Control**: Automatic availability updates
- **Validation**: Comprehensive request validation
- **Error Handling**: Detailed error responses
- **Transactions**: Atomic database operations
- **Type Safety**: Full TypeScript support

## API Endpoints

### Books

| Method | Endpoint         | Description             | Auth Required |
| ------ | ---------------- | ----------------------- | ------------- |
| POST   | `/api/books`     | Add a new book          | Yes           |
| GET    | `/api/books`     | List all books          | No            |
| GET    | `/api/books/:id` | Get book details        | No            |
| PUT    | `/api/books/:id` | Update book information | Yes           |
| DELETE | `/api/books/:id` | Remove a book           | Yes           |

### Borrowing

| Method | Endpoint              | Description             | Auth Required |
| ------ | --------------------- | ----------------------- | ------------- |
| POST   | `/api/borrow`         | Borrow a book           | Yes           |
| GET    | `/api/borrow`         | List all borrowed books | Yes           |
| GET    | `/api/borrow/summary` | Borrowing summary       | Yes           |

## Request/Response Examples

### Create Book

**Request:**

```json
POST /api/books
{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "isbn": "9780553380163",
  "copies": 5
}
```

**Response:**

```json
201 Created
{
  "success": true,
  "data": {
    "_id": "64ab3f9e2a4b5c6d7e8f9012",
    "title": "The Theory of Everything",
    "isbn": "9780553380163",
    "copies": 5,
    "available": true
  }
}
```

### Borrow Book

**Request:**

```json
POST /api/borrow
{
  "book": "64ab3f9e2a4b5c6d7e8f9012",
  "quantity": 1,
  "dueDate": "2025-07-18T00:00:00.000Z"
}
```

**Response:**

```json
201 Created
{
  "success": true,
  "data": {
    "_id": "64bc4a0f9e1c2d3f4b5a6789",
    "book": "64ab3f9e2a4b5c6d7e8f9012",
    "quantity": 1,
    "dueDate": "2025-07-18T00:00:00.000Z"
  }
}
```

## Error Handling

### The API returns consistent error responses:

```json
{
  "message": "Error description",
  "success": false,
  "error": {
    "name": "ErrorType",
    "details": {
      "field": "fieldName",
      "message": "Specific error message"
    }
  }
}
```

**Common Error Codes:**

- 400 Bad Request - Validation errors
- 401 Unauthorized - Missing/invalid auth token
- 404 Not Found - Resource not found
- 409 Conflict - Duplicate resource (e.g., existing ISBN)
- 500 Internal Server Error - Unexpected errors

## Local Development Setup

### Prerequisites

- Node.js 18+
- MongoDB 6.0+
- npm 9+

#### Installation

1. Clone The repository

```bash
git clone https://github.com/yourusername/library-management-api.git
cd library-management-api
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Configure environment variables in .env:

```text
PORT=3000
MONGODB_URI=mongodb://localhost:27017/library_db
JWT_SECRET=your_jwt_secret_here
```

### Running the Application

**Development mode:**

```bash
npm run dev
```

**Production mode:**

```bash
npm run build
npm start
```

### Testing

**Run unit tests:**

```bash
npm test
```

## Database Schema

### Books Collection

```typescript
{
  title: string,
  author: string,
  isbn: string,  // unique
  copies: number,
  available: boolean
}
```

### Borrow Records

```typescript
{
  book: ObjectId,  // ref: 'Book'
  user: ObjectId,  // ref: 'User'
  quantity: number,
  dueDate: Date,
  returned: boolean
}
```

## Contributing

1. Fork the repository

2. Create your feature branch (git checkout -b feature/AmazingFeature)

3. Commit your changes (git commit -m 'Add some AmazingFeature')

4. Push to the branch (git push origin feature/AmazingFeature)

5. Open a Pull Request
