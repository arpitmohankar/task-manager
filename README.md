# Task Management System

A simple task management application built with MERN stack for job assessment.

## Features

- **Task Creation** - Create tasks with title, description, due date and assign to priority lists
- **Task List Display** - View all tasks with pagination and Ajax, showing title, due date, and status (pending/completed)
- **Task Details View** - Dedicated page to view individual task details including description and due date
- **Task Editing** - Edit existing task details including title, description, and due date
- **Task Deletion** - Delete tasks with confirmation dialog
- **Task Status Update** - Mark tasks as completed or change their status between pending/completed
- **User Authentication System**
  - User login and registration
  - Only authorized users can perform CRUD operations on tasks
  - Admin can add/remove users
  - Users can view their assigned tasks
- **Priority Management** - Move tasks between priority lists (High, Medium, Low)
- **Visual Representation** - Color-coded priority lists for quick identification
  - High Priority - Red
  - Medium Priority - Yellow  
  - Low Priority - Green

## Tech Stack

- MongoDB - Database
- Express.js - Backend framework
- React.js - Frontend library
- Node.js - Runtime environment

## Installation & Setup

### Prerequisites
- Node.js installed
- MongoDB installed and running

### Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file and add:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/taskmanager
# JWT_SECRET=mysecretkey123

# Start backend server
npm run dev
```

### Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start React app
npm start
```

## Running the Application

1. Make sure MongoDB is running on your system
2. Start backend server: `http://localhost:5000`
3. Start frontend app: `http://localhost:3000`
4. Register as admin/user and start managing tasks

## Default Login

You can register a new account with:
- Email: any valid email
- Password: minimum 6 characters
- Role: Admin or User

## Project Structure

```
└── task-manager
    ├── README.md
    ├── backend
    │   ├── .env
    │   ├── config.js
    │   ├── middleware
    │   │   └── auth.js
    │   ├── models
    │   │   ├── Task.js
    │   │   └── User.js
    │   ├── node_modules
    │   │   ... (skipped)
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── routes
    │   │   ├── auth.js
    │   │   └── tasks.js
    │   └── server.js
    └── frontend
        ├── node_modules
        │   ... (skipped)
        ├── package-lock.json
        ├── package.json
        ├── public
        │   └── index.html
        └── src
            ├── App.css
            ├── App.js
            ├── components
            │   ├── Login.js
            │   ├── Navbar.js
            │   ├── Register.js
            │   ├── TaskForm.js
            │   ├── TaskItem.js
            │   └── TaskList.js
            ├── index.js
            └── pages
                ├── Dashboard.js
                ├── Home.js
                └── TaskDetail.js

```
## Thank You