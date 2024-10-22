# To Do List API
## Overview
This project aims to create a robust and efficient RESTful API for managing to-do lists. It provides users with the ability to create, read, update, and delete tasks, as well as manage their user accounts.
## Key Features:
- User authentication: Secure user registration and login mechanisms using JSON Web Tokens (JWT).
- Task management: Create, read, update, and delete tasks.
- Data storage: Store user and task data in a MongoDB database.
- Error handling: Provide informative error messages and handle exceptions gracefully.
- Security: Implement measures to protect the API and user data.
- Swagger integration: Use Swagger to provide comprehensive API documentation, making it easy for developers to understand and interact with the API.
- Unit testing: Ensure individual components and functions, such as task management operations, work as expected using Jest for robust testing coverage.
- Integration testing: Validate the correct interaction between components, including database and API layers, ensuring the system functions as a whole with tools like Jest and Supertest.

## How to run this project
### 1. Clone this repository
### 2. Run `npm install`
### 3. env
- For development, create a .env.development file and add the following variables:
    ```
    PORT=3000
    MONGO_URI=your_mongodb_uri_development
    DB_NAME=dev-to-do-list
    JWT_SECRET=your_jwt_secret
    JWT_LIFETIME=60d
    ```
- For production, create a .env.production file and add the following variables:
    ```
    PORT=your_production_port
    DB_NAME=to-do-list
    MONGO_URI=your_mongodb_uri_production
    JWT_SECRET=your_jwt_secret
    JWT_LIFETIME=60d
    ```
### 4. Available npm scripts:
- Start the app in production:
```bash
npm run start
```
- Run the app in development:
```bash
npm run dev
```
- Run integration tests:
```bash
npm run test-i
```
- Run unit tests:
```bash
npm run test-u
```
- Fix linting issues:
```bash
npm run lint:fix
```
### 5. Test the API 
- using Postman or any API testing tool
- or just use swagger docs

## API Endpoints
### Authentication
- **POST** `/api/user/register`: Register a new user.
- **POST** `/api/user/login`: Log in an existing user.

### Tasks
- **POST** `/api/tasks`: Create a new task.
- **GET** `/api/tasks`: Retrieve a list of tasks.
- **GET** `/api/tasks/:id`: Get details of a specific task by ID.
- **PUT** `/api/tasks/:id`: Update a specific task by ID.
- **DELETE** `/api/tasks/:id`: Delete a specific task by ID.
## Project Url
https://roadmap.sh/projects/todo-list-api