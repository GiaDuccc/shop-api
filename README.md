# <span style="color: #f39c12">NICE STORE - Backend API</span>

# Table of Contents

* [**Introduction**](#introduction)
* [**Technologies**](#technologies)
* [**Features**](#features)
  * [**1. User Features**](#1-user-features)
    * [1.1. User Registration and Login](#11-user-registration-and-login)
    * [1.2. Product Listing and Filtering](#12-product-listing-and-filtering)
    * [1.3. Product Search](#13-product-search)
    * [1.4. Shopping Cart Management](#14-shopping-cart-management)
    * [1.5. Order Processing and Payment](#15-order-processing-and-payment)
    * [1.6. User Profile and Order History](#16-user-profile-and-order-history)
    * [1.7. Customer Support Chatbot Integration](#17-customer-support-chatbot-integration)
  * [**2. Admin Features**](#2-admin-features)
      * [2.1. Dashboard Analytics](#21-dashboard-analytics)
      * [2.2. Customer Management](#22-customer-management)
      * [2.3. Product Management](#23-product-management)
      * [2.4. Order Management](#24-order-management)

* [**Authentication & Security**](#authentication--security)
* [**Database**](#database)

* [**Installation**](#installation)
* [**API Documentation**](#api-documentation)
* [**Project Structure**](#project-structure)

# Introduction

### This is the backend API for the NICE STORE online shoe store. It provides a robust and secure API for handling user authentication, product management, order processing, and admin functionalities. The API is built with Node.js and Express.js, using MongoDB as the database.

# Technologies

### Back-end:
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Multer](https://img.shields.io/badge/Multer-ff4444?style=for-the-badge&logo=npm&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Bcrypt](https://img.shields.io/badge/Bcrypt-003A70?style=for-the-badge&logo=letsencrypt&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Yarn](https://img.shields.io/badge/Yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white)

### Database and Cloud
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

# Features

## 1. User Features

### 1.1. User Registration and Login
- Secure user registration with email validation
- JWT-based authentication
- Password hashing for security
- Role-based access control

### 1.2. Product Listing and Filtering
- RESTful API endpoints for product listing
- Advanced filtering and sorting capabilities
- Pagination support
- Category-based product organization

### 1.3. Product Search
- Full-text search functionality
- Search history tracking
- Real-time search suggestions
- Category-based search filtering

### 1.4. Shopping Cart Management
- Cart creation and management
- Product quantity updates
- Cart persistence across sessions
- Price calculations and validations

### 1.5. Order Processing and Payment
- Order creation and management
- Payment processing integration
- Order status tracking
- Email notifications for order updates

### 1.6. User Profile and Order History
- User profile management
- Order history tracking
- Address management
- Personal information updates

### 1.7. Customer Support Chatbot Integration
- Integration with AI chatbot
- Real-time customer support
- Product availability checking
- Order status inquiries

## 2. Admin Features

### 2.1. Dashboard Analytics
- Sales analytics and reporting
- User statistics
- Product performance metrics
- Revenue tracking

### 2.2. Customer Management
- User account management
- Role assignment
- User activity tracking
- Account status management

### 2.3. Employee Management
- Employee account creation and management
- Role and permission assignment
- Employee activity tracking
- Access control management

### 2.4. Product Management
- CRUD operations for products
- Inventory management
- Product categorization
- Image upload and management

### 2.5. Order Management
- Order status updates
- Order tracking
- Customer communication
- Payment verification

# Authentication & Security

### JWT (JSON Web Tokens)
The API uses JWT for secure authentication and authorization:

- **Token Generation**: Upon successful login, the server generates a JWT containing user information (user ID, role, email)
- **Token Structure**: Tokens include payload data and are signed with a secret key
- **Token Expiration**: Configurable expiration time for security
- **Token Storage**: Tokens are stored in HTTP-only cookies for enhanced security

### Security Features

**Password Hashing**
- User passwords are hashed using bcrypt before storage
- Salt rounds are configured for optimal security
- Passwords are never stored or transmitted in plain text

**Role-Based Access Control (RBAC)**
- Three user roles: Client, Admin, Manager
- Route protection based on user roles
- Separate admin and client API endpoints
- Middleware validation for protected routes

**API Security**
- CORS configuration for controlled access
- Rate limiting to prevent abuse
- Input validation using Joi
- Error handling middleware for consistent responses
- Soft delete mechanism to preserve data integrity

**Authentication Flow**
1. User sends credentials (email/password) to `/auth/login`
2. Server validates credentials and checks user status
3. If valid, server generates JWT token
4. Token is sent to client via HTTP-only cookie
5. Client includes token in subsequent requests
6. Middleware verifies token on protected routes
7. User data is extracted from valid tokens for authorization

# Database

Below are the main collections in MongoDB:

## 1. Customers
```
------------------------------------------------------------------------------------------
| Field        | Type      | Description                                                 |
|--------------|-----------|-------------------------------------------------------------|
| _id          | ObjectId  | Primary key                                                 |
| lastName     | String    | Customer's last name                                        |
| firstName    | String    | Customer's first name                                       |
| country      | String    | Country code (e.g., 'VN')                                   |
| dob          | Date      | Date of birth                                               |
| email        | String    | Email address                                               |
| phone        | String    | Phone number                                                |
| password     | String    | Hashed password                                             |
| slug         | String    | Slug for customer                                           |
| role         | String    | User role (user/admin/manager)                              |
| address      | String    | Address                                                     |
| isActive     | Boolean   | Account active status                                       |
| createdAt    | Date      | Creation timestamp                                          |
| updatedAt    | Date      | Last update timestamp                                       |
| _destroy     | Boolean   | Soft delete flag                                            |
| orders       | Array     | List of orders:                                             |
|  └─ orderId  | ObjectId  | Reference to order                                          |
|  └─ status   | String    | Order status ('cart', 'pending', 'completed', 'canceled')   |
------------------------------------------------------------------------------------------
```

## 2. employees
```
------------------------------------------------------------------------------------------
| Field        | Type      | Description                                                 |
|--------------|-----------| ------------------------------------------------------------|
| _id          | ObjectId  | Primary key                                                 |
| lastName     | String    | Employee's last name                                        |
| firstName    | String    | Employee's first name                                       |
| email        | String    | Email address                                               |
| phone        | String    | Phone number                                                |
| password     | String    | Hashed password                                             |
| role         | String    | Employee role (admin/manager)                               |
| isActive     | Boolean   | Account active status                                       |
| createdAt    | Date      | Creation timestamp                                          |
| updatedAt    | Date      | Last update timestamp                                       |
| _destroy     | Boolean   | Soft delete flag                                            |
------------------------------------------------------------------------------------------
```

## 3. carts
```
------------------------------------------------------------------------------------------
| Field        | Type      | Description                                                 |
|--------------|-----------| ------------------------------------------------------------|
| _id          | ObjectId  | Primary key                                                 |
| customerId   | ObjectId  | Reference to customer                                       |
| items        | Array     | List of cart items:                                         |
|  └─ productId| ObjectId  | Reference to product                                        |
|  └─ color    | String    | Color of the product                                        |
|  └─ size     | Number    | Size of the product                                         |
|  └─ quantity | Number    | Quantity in cart                                            |
|  └─ price    | Number    | Price per item                                              |
|  └─ name     | String    | Product name                                                |
|  └─ image    | String    | Product image URL                                           |
| createdAt    | Date      | Creation timestamp                                          |
| updatedAt    | Date      | Last update timestamp                                       |
| _destroy     | Boolean   | Soft delete flag                                            |
------------------------------------------------------------------------------------------
```

## 4. products
```
-----------------------------------------------------------------------------
| Field           | Type      | Description                                 |
|---------------  |-----------|---------------------------------------------|
| _id             | ObjectId  | Primary key                                 |
| name            | String    | Product name                                |
| type            | String    | Product type (e.g., sneaker)                |
| brand           | String    | Product brand                               |
| price           | Number    | Product price                               |
| stock           | Number    | Stock quantity                              |
| colors          | Array     | List of color objects:                      |
|  └─ color       | String    | Color name                                  |
|  └─ imageDetail | Array     | Array of image URLs for this color          |
|  └─ sizes       | Array     | List of size objects:                       |
|     └─ size     | Number    | Size value                                  |
|     └─ quantity | Number    | Quantity for this size                      |
|     └─ colorHex | String    | Color hex code                              |
| slug            | String    | Product slug                                |
| importAt        | Number    | Import timestamp (Unix)                     |
| exportAt        | Null/Date | Export timestamp                            |
| updateAt        | Date      | Last update timestamp                       |
| _destroy        | Boolean   | Soft delete flag                            |
| desc            | String    | Product description                         |
| highLight       | String    | Highlight/feature text                      |
| adImage         | String    | Advertisement image URL                     |
| navbarImage     | String    | Navbar image URL                            |
| quantitySold    | Number    | Number of products sold                     |
-----------------------------------------------------------------------------
```

## 5. orders
```
--------------------------------------------------------------------------
| Field        | Type      | Description                                 |
|--------------|-----------|---------------------------------------------|
| _id          | ObjectId  | Primary key                                 |
| items        | Array     | List of order items:                        |
|  └─ productId| ObjectId  | Reference to product                        |
|  └─ color    | String    | Color of the product                        |
|  └─ size     | String    | Size of the product                         |
|  └─ price    | Number    | Price per item                              |
|  └─ name     | String    | Product name                                |
|  └─ image    | String    | Product image URL                           |
|  └─ quantity | Number    | Quantity ordered                            |
| totalPrice   | Number    | Total order price                           |
| status       | String    | Order status (e.g., completed, pending)     |
| createdAt    | Date      | Creation timestamp                          |
| _destroy     | Boolean   | Soft delete flag                            |
| address      | String    | Shipping address                            |
| name         | String    | Customer name                               |
| phone        | String    | Customer phone number                       |
| payment      | String    | Payment method                              |
| updatedAt    | Date      | Last update timestamp                       |
--------------------------------------------------------------------------
```

# Installation

Make sure you have the following installed on your machine:

- Node.js (version 18 or above)
- Yarn
- MongoDB (local or cloud, e.g. MongoDB Atlas)
- VS Code

### # 1. Clone the repository
```
git clone https://github.com/GiaDuccc/shop-api.git
```

### # 2. Navigate to the project folder
```cd shop-api```

### # 3. Install dependencies
```yarn install```

### # 4. Create .env file
```
type nul > .env
code .env

#.env - "Fill in the empty fields"

APP_HOST= 
APP_PORT= 
MONGODB_URI= 
DATABASE_NAME=
AUTHOR=
GEMINI_KEY=
CLOUDINARY_NAME=
CLOUDINARY_API_KEY =
CLOUDINARY_API_SECRET =
CLOUDINARY_URL =
```

### # 5. Run the project
```yarn dev```

# API Documentation

The API documentation is available at `/api-docs` when running the server locally.

# Project Structure

```
shop-api/
├── node_modules/
│
├── src/
│   ├── config/
│   │   ├── cors.js
│   │   ├── environment.js
│   │   └── mongodb.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── cartController.js
│   │   ├── chatbotController.js
│   │   ├── customerController.js
│   │   ├── employeeController.js
│   │   ├── orderController.js
│   │   └── productController.js
│   │
│   ├── middlewares/
│   │   └── errorHandlingMiddleware.js
│   │
│   ├── models/
│   │   ├── cartModel.js
│   │   ├── chatbotModel.js
│   │   ├── customerModel.js
│   │   ├── employeeModel.js
│   │   ├── orderModel.js
│   │   └── productModel.js
│   │
│   ├── routes/
│   │   ├── v1/
│   │   │   ├── Admin/
│   │   │   │   ├── authRouterAdmin.js
│   │   │   │   ├── customerRouterAdmin.js
│   │   │   │   ├── employeeRouterAdmin.js
│   │   │   │   ├── orderRouterAdmin.js
│   │   │   │   └── productRouterAdmin.js
│   │   │   │
│   │   │   ├── Client/
│   │   │   │   ├── authRouter.js
│   │   │   │   ├── cartRouter.js
│   │   │   │   ├── chatbotRouter.js
│   │   │   │   ├── customerRouter.js
│   │   │   │   ├── orderRouter.js
│   │   │   │   └── productRouter.js
│   │   │   │
│   │   │   └── index.js
│   │   │
│   │   └── v2/
│   │       └── (Future API versions)
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── cartService.js
│   │   ├── chatbotService.js
│   │   ├── customerService.js
│   │   ├── employeeService.js
│   │   ├── orderService.js
│   │   └── productService.js
│   │
│   ├── utils/
│   │   ├── algorithms.js
│   │   ├── ApiError.js
│   │   ├── cloudinary.js
│   │   ├── constants.js
│   │   ├── formatters.js
│   │   ├── sorts.js
│   │   ├── token.js
│   │   └── validators.js
│   │
│   ├── validations/
│   │   ├── cartValidation.js
│   │   ├── customerValidation.js
│   │   ├── employeeValidation.js
│   │   ├── orderValidation.js
│   │   └── productValidation.js
│   │
│   └── server.js
│
├── .babelrc
├── .env
├── .eslintrc.cjs
├── .gitignore
├── jsconfig.json
├── package.json
├── README.md
└── yarn.lock
```
