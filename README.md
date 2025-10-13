# COMP3123 Assignment 1 - Employee Management API

**Course:** COMP 3123 – Full Stack Development – I  
**Student:** Lakshay Dhawan  
**Student ID:** 101464867  
**Submission Date:** October 12, 2025

## 📋 Project Overview

A RESTful API built with Node.js, Express, and MongoDB for managing employees and user authentication. This application provides complete CRUD operations for employee management with JWT-based authentication.

## 🚀 Features

- **User Authentication**
  - User registration (signup)
  - User login with JWT token generation
  - Password hashing with bcrypt
  - Login support using email or username

- **Employee Management**
  - Create new employees
  - Retrieve all employees
  - Get employee by ID
  - Update employee details
  - Delete employees
  - Protected routes with JWT authentication

- **Data Validation**
  - Input validation using express-validator
  - Comprehensive error handling
  - MongoDB schema validation

## 🛠️ Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (MongoDB Community Server 6.0)
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **Validation:** express-validator
- **Development Tools:** nodemon, ESLint, Prettier
- **Database UI:** Mongo Express
- **Containerization:** Docker & Docker Compose

## 📁 Project Structure

```
101464867_COMP3123_Assignment1/
├── config/
│   └── db.js                 # Database connection
├── controllers/
│   ├── userController.js     # User authentication logic
│   └── employeeController.js # Employee CRUD operations
├── middleware/
│   ├── authentication.js     # JWT verification middleware
│   ├── validation.js         # Request validation rules
│   └── errorHandling.js      # Error handling middleware
├── models/
│   ├── user.js              # User schema
│   └── employee.js          # Employee schema
├── routes/
│   ├── userRoutes.js        # User authentication routes
│   └── employeeRoutes.js    # Employee management routes
├── utils/
│   └── generateToken.js     # JWT token generation utility
├── docker-compose.yml       # Docker configuration
├── server.js                # Application entry point
├── package.json             # Dependencies
└── .env                     # Environment variables
```

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6.0 or higher)
- Docker & Docker Compose (optional)

### Local Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 101464867_COMP3123_Assignment1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=8000
   MONGODB_URI=mongodb://user:pass@localhost:27018/comp3123_assignment1?authSource=admin
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. **Start MongoDB using Docker**
   ```bash
   docker-compose up -d
   ```

5. **Run the application**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

6. **Access the application**
   - API Server: http://localhost:8000
   - Mongo Express: http://localhost:8081 (admin/admin123)

## 🔌 API Endpoints

### User Management

#### 1. User Signup
- **Endpoint:** `POST /api/v1/user/signup`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "username": "johndoe",
    "email": "johndoe@example.com",
    "password": "password123"
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "message": "User created successfully.",
    "user_id": "64c9e5a3d9f3c1a5c9b4e8a1",
    "username": "johndoe",
    "email": "johndoe@example.com"
  }
  ```

#### 2. User Login
- **Endpoint:** `POST /api/v1/user/login`
- **Access:** Public
- **Request Body:**
  ```json
  {
    "identifier": "johndoe@example.com",
    "password": "password123"
  }
  ```
- **Response:** `200 OK`
  ```json
  {
    "message": "Login successful.",
    "jwt_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

### Employee Management

**Note:** All employee endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### 3. Get All Employees
- **Endpoint:** `GET /api/v1/emp/employees`
- **Access:** Protected
- **Response:** `200 OK`
  ```json
  [
    {
      "employee_id": "64c9e5a3d9f3c1a5c9b4e8a2",
      "first_name": "Jane",
      "last_name": "Doe",
      "email": "jane.doe@example.com",
      "position": "Software Engineer",
      "salary": 90000,
      "date_of_joining": "2023-08-01T00:00:00.000Z",
      "department": "Engineering"
    }
  ]
  ```

#### 4. Create Employee
- **Endpoint:** `POST /api/v1/emp/employees`
- **Access:** Protected
- **Request Body:**
  ```json
  {
    "first_name": "Alice",
    "last_name": "Johnson",
    "email": "alice.johnson@example.com",
    "position": "Designer",
    "salary": 85000,
    "date_of_joining": "2023-08-10T00:00:00.000Z",
    "department": "Design"
  }
  ```
- **Response:** `201 Created`
  ```json
  {
    "message": "Employee created successfully.",
    "employee_id": "64c9e5a3d9f3c1a5c9b4e8a4"
  }
  ```

#### 5. Get Employee by ID
- **Endpoint:** `GET /api/v1/emp/employees/:eid`
- **Access:** Protected
- **Response:** `200 OK`

#### 6. Update Employee
- **Endpoint:** `PUT /api/v1/emp/employees/:eid`
- **Access:** Protected
- **Request Body:** (partial update supported)
  ```json
  {
    "position": "Senior Designer",
    "salary": 95000
  }
  ```
- **Response:** `200 OK`

#### 7. Delete Employee
- **Endpoint:** `DELETE /api/v1/emp/employees?eid=xxx`
- **Access:** Protected
- **Response:** `204 No Content`

## 🗄️ Database Schema

### Users Collection
```javascript
{
  "_id": ObjectId,
  "username": String,
  "email": String,
  "password": String,  // Hashed with bcrypt
  "created_at": Date,
  "updated_at": Date
}
```

### Employees Collection
```javascript
{
  "_id": ObjectId,
  "first_name": String,
  "last_name": String,
  "email": String,
  "position": String,
  "salary": Number,
  "date_of_joining": Date,
  "department": String,
  "created_at": Date,
  "updated_at": Date
}
```

## 🧪 Testing

### Postman Collection
A complete Postman collection is included in the repository:
- File: `COMP3123 Assignment 1 - Employee Management API.postman_collection.json`
- Import this collection into Postman to test all endpoints
- Environment variables are configured for easy testing

### Test User Credentials
For testing purposes, you can use:
- **Username:** johndoe
- **Email:** johndoe@example.com
- **Password:** password123

### Running Tests
1. Import the Postman collection
2. Set the `base_url` variable to `http://localhost:8000/api/v1`
3. Run the "User Signup" request
4. Run the "User Login" request (JWT token will be saved automatically)
5. Test all employee endpoints (authentication will be handled automatically)

## 🔒 Security Features

- Password hashing using bcrypt (salt rounds: 10)
- JWT token-based authentication
- Token expiration (30 days)
- Protected routes requiring authentication
- Input validation and sanitization
- MongoDB injection prevention

## ⚠️ Error Handling

The API returns appropriate HTTP status codes and error messages:

```json
{
  "status": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Valid email is required"
    }
  ]
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## 📸 Screenshots

Screenshots of all API endpoints and MongoDB collections are included in the `screenshots/` directory.

## 🐳 Docker Configuration

The project includes Docker Compose configuration for easy setup:

```bash
# Start MongoDB and Mongo Express
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

Services:
- **MongoDB:** Port 27018
- **Mongo Express:** Port 8081

## 📝 Development Scripts

```bash
npm run dev      # Run with nodemon (auto-reload)
npm start        # Run in production mode
```

## 🤝 Contributing

This is a student assignment project. For any questions or issues, please contact:
- **Email:** pritesh.patel2@georgebrown.ca
- **Course:** COMP 3123 - Full Stack Development I

## 📄 License

This project is created for educational purposes as part of the COMP 3123 course at George Brown College.

## 👨‍💻 Author

**Lakshay Dhawan**  
Student ID: 101464867  
George Brown College

---

**Last Updated:** October 12, 2025
