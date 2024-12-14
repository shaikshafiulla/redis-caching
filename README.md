# Redis Node.js Product API

## Table of Contents
* [Overview](#overview)
* [Features](#features)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [API Reference](#api-reference)
* [Redis Commands](#redis-commands)
* [Project Structure](#project-structure)

## Overview
A simple Node.js Express API with Redis caching for product management. This application demonstrates basic CRUD operations with Redis caching implementation.

## Features
* **Redis Caching**: Efficient data retrieval with TTL
* **Express API**: RESTful endpoints for product management
* **Docker Integration**: Easy Redis setup with Docker
* **Error Handling**: Comprehensive error management
* **Cache Invalidation**: Automatic cache clearing on updates

## Prerequisites
* Node.js (v14 or higher)
* Docker
* npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd redis-node-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start Redis container
```bash
docker run --name my-redis -p 6379:6379 -d redis
```

### 4. Run the application
```bash
node app.js
```

## API Reference

### Get All Products
```http
GET /products
```

#### Response
```json
{
    "1": { "id": 1, "name": "Laptop", "price": 999.99 },
    "2": { "id": 2, "name": "Smartphone", "price": 499.99 }
}
```

### Get Single Product
```http
GET /products/:id
```

#### Parameters
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `id` | `string` | Product ID |

#### Response
```json
{
    "id": 1,
    "name": "Laptop",
    "price": 999.99
}
```

### Create Product
```http
POST /products
```

#### Request Body
```json
{
    "name": "New Product",
    "price": 199.99
}
```

### Clear Product Cache
```http
DELETE /products/:id/cache
```

## Redis Commands

### Check Container Status
```bash
# View logs
docker logs my-redis

# Access Redis CLI
docker exec -it my-redis redis-cli

# List all keys
docker exec -it my-redis redis-cli KEYS *
```

### Container Management
```bash
# Stop container
docker stop my-redis

# Remove container
docker rm my-redis
```

## Project Structure
```
redis-node-app/
├── index.js          # Main application file
├── package.json    # Dependencies
└── README.md      # Documentation
```

## Error Handling
The application handles various error scenarios:

* Redis connection errors
* Server errors (500)
* Not found errors (404)
* Invalid request errors

## Cache Details
| Cache Type | TTL | Key Pattern |
| :--- | :--- | :--- |
| Single Product | 1 hour | `product:{id}` |
| All Products | 1 hour | `all_products` |

## License
[MIT](https://choosealicense.com/licenses/mit/)

---
**Note**: Make sure to replace `<repository-url>` with your actual repository URL.
