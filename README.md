# URL Shortener API

URL Shortener is a RESTful API built with **Node.js** and **NestJS** to shorten URLs. The system allows both authenticated and unauthenticated users to shorten URLs and provides advanced features for authenticated users, such as listing, editing, and deleting shortened URLs.

---

## 🚀 Tech Stack of the project

![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge)
![NestJS](https://img.shields.io/badge/-NestJS-E0234E?logo=nestjs&logoColor=white&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge)
![MySQL](https://img.shields.io/badge/-MySQL-4479A1?logo=mysql&logoColor=white&style=for-the-badge)
![Docker](https://img.shields.io/badge/-Docker-2496ED?logo=docker&logoColor=white&style=for-the-badge)
![Jest](https://img.shields.io/badge/-Jest-C21325?logo=jest&logoColor=white&style=for-the-badge)
![Swagger](https://img.shields.io/badge/-Swagger-85EA2D?logo=swagger&logoColor=black&style=for-the-badge)

---

## 🌐 API Available on Google Cloud Platform

The URL Shortener API is hosted on **Google Cloud Platform** and can be accessed via the following link:

- **API URL**: [http://34.127.107.109:3000](http://34.127.107.109:3000)

### 📄 Swagger Documentation

The API documentation, which includes all routes and usage details, is available via Swagger at the following link:

- **Swagger UI**: [http://34.127.107.109:3000/api/docs](http://34.127.107.109:3000/api/docs)

Use the documentation to explore all functionalities of the API and test the routes directly through the Swagger interface.

---

## **Features**

- **URL Shortening:**
  - Allows URLs to be shortened to 6 characters.
  - Example:
    - Input: `https://example.com/long-url`
    - Output: `http://localhost/aZbKq7`

- **User Authentication:**
  - New user registration.
  - Login with Bearer Token (JWT) authentication.

- **URL Management:**
  - List shortened URLs for authenticated users, including click counts.
  - Edit the original URL of shortened links.
  - Soft delete shortened URLs.

- **Redirection and Click Counting:**
  - Redirects to the original URL when accessing the shortened link.
  - Tracks the number of accesses.

---

## **How to Run the Project**

### **Prerequisites**

- **Node.js:** Latest LTS version (>= 18.x).
- **Docker and Docker Compose:** To run the complete environment locally.
- **Git:** To clone the repository.

### **Installation**

1. Clone the repository:

   ```bash
   git clone https://github.com/gabrielpereira3/url-shortener.git
   cd url-shortener
   ```

2. Configure the environment variables:

   - Create a `.env` file in the root directory.
   - Add the following variables:

     ```env
     API_PORT=3000
     BASE_URL=http://localhost
     JWT_SECRET=your_jwt_secret
     JWT_EXPIRES_IN=1d
     DATABASE_HOST=db
     DATABASE_PORT=3306
     DATABASE_USER=root
     DATABASE_PASSWORD=your_database_password
     DATABASE_NAME=url-shortener
     ```

3. Start the environment with Docker Compose:

   ```bash
   docker-compose up --build
   ```

4. Access the API at: `http://localhost:3000`

---

## **API Documentation**

The API is documented with **Swagger**. To access the documentation:

1. Start the local environment.
2. Open your browser and go to: `http://localhost:3000/api`.

---

## **Endpoints**

### **Authentication**

- **POST /auth/login**: Logs in and returns a JWT token.
  - **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - **Response:**
    ```json
    {
      "accessToken": "jwt_token"
    }
    ```

### **Users**

- **POST /users/create**: Creates a new user.
  - **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```
  - **Response:**
    ```json
    {
      "userId": "uuid",
      "email": "user@example.com",
      "createdAt": "2025-01-19T20:00:00.000Z"
    }
    ```

### **URLs**

- **POST /urls/shorten**: Shortens a URL.
  - **Request Body:**
    ```json
    {
      "longUrl": "https://example.com/long-url"
    }
    ```
  - **Response:**
    ```json
    {
      "urlId": "uuid",
      "longUrl": "https://example.com/long-url",
      "shortUrl": "http://localhost/aZbKq7",
      "createdAt": "2025-01-19T20:00:00.000Z"
    }
    ```

- **GET /urls/listByUser**: Lists shortened URLs of the authenticated user.
  - **Header:**
    ```json
    {
      "Authorization": "Bearer jwt_token"
    }
    ```
  - **Response:**
    ```json
    [
      {
        "urlId": "uuid",
        "longUrl": "https://example.com",
        "shortUrl": "http://localhost/aZbKq7",
        "clicks": 10
      }
    ]
    ```

- **PATCH /urls/update/:token**: Updates the original URL of a shortened link.
  - **Request Body:**
    ```json
    {
      "newLongUrl": "https://newexample.com"
    }
    ```

- **DELETE /urls/delete/:token**: Soft deletes a shortened URL.

- **GET /:token**: Redirects to the original URL and tracks the access.

---

## **Testing**

Run unit tests with:

```bash
npm run test
```

---

## **Improvement Points**

1. **Distributed Database:**
   - Use a distributed database for high availability and scalability.

2. **Cache:**
   - Implement a caching system (Redis) to improve performance for frequently accessed URLs.

3. **Load Balancing:**
   - Add a load balancer (NGINX or AWS ELB) to distribute requests across multiple instances.

4. **Asynchronous Queues:**
   - Process tasks like click counting asynchronously using RabbitMQ or Kafka.

---

## **Author**

[Gabriel Pereira Soares](https://github.com/gabrielpereira3)

---

## **License**

This project is licensed under the [MIT License](https://github.com/gabrielpereira3/url-shortener/?tab=MIT-1-ov-file).
