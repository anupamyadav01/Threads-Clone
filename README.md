# Social Media App

This project is a full-stack social media application built using the MERN (MongoDB, Express, React, Node.js) stack. The application features user authentication, the ability to post, like, and comment, as well as real-time chat functionality.

## Live Demo

You can visit the deployed application here:

## [Click here to visit the live app](https://threads-bro.vercel.app/)

---

## Table of Contents

- [Getting Started](#getting-started)
- [Features](#features)
- [API Routes](#api-routes)
  - [User Routes](#user-routes)
  - [Post Routes](#post-routes)
  - [Message Routes](#message-routes)
- [Frontend Routes](#frontend-routes)
- [Environment Variables](#environment-variables)
- [Screenshots](#screenshots)
- [License](#license)

---

## Features

- 🔐 Authentication & Authorization: Signup, login, and JWT-based session management.

- 📝 Create Posts: Users can create posts with images uploaded to Cloudinary.

- ❤️ Like/Unlike Posts: Users can like/unlike posts.

- 👥 Follow/Unfollow Users: Follow and unfollow other users.

- 💬 Real-Time Chat: Users can send and receive real-time messages.

- 🔍 Search Users: Search functionality for finding users by username or name.

- 👤 Profile Management: Update profile information and view other users' profiles.

- 📰 Feeds: A personalized feed showing posts from followed users.

- 🌐 Responsive UI: Mobile-friendly design using Chakra UI.

## Screenshots

Below are some screenshots of the application:

### 1. Homepage

![Homepage Screenshot](./frontend/src/assets/screensorts/feeds.png)

### 2. User Profile Page

![User Profile Page Screenshot](./frontend/src/assets/screensorts/profile.png)

### 3. Post Details Page

![Post Details Page Screenshot](./frontend/src/assets/screensorts/postdetails.png)

### 4. Chat Page

![Chat Page Screenshot](./frontend/src/assets/screensorts/chat.png)

### 5. Search Page

![Search Page Screenshot](./frontend/src/assets/screensorts/search.png)

### 6. Sign In Profile Page

![Sign In Profile Page Screenshot](./frontend/src/assets/screensorts/signup.png)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following tools installed:

- React.js
- Chakra UI
- React Router Dom
- Framer-motion
- React-icons
- Node.js
- Express.js
- Socket.io
- MongoDB
- Git
- Cloudinary account for image uploads

### Installing

1. **Clone the repository:**

   ```bash
   git clone https://github.com/anupamyadav01/Threads-Clone.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd Threads-Clone
   ```

3. **Install backend dependencies:**

   ```bash
   cd backend
   npm install
   ```

4. **Install frontend dependencies:**

   ```bash
   cd ../frontend
   npm install
   ```

5. **Create a `.env` file in the `backend` directory with the following:**

   ```plaintext
   PORT=10000
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.mongodb.net
   DB_NAME=socialmedia
   JWT_SECRET=your-secret-key
   MAIL_PASSWORD=your-mail-password
   MAIL_USERNAME=your-email@gmail.com
   CLOUDINARY_NAME=your-cloudinary-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   CLOUDINARY_URL=cloudinary://your-cloudinary-api-key:your-cloudinary-api-secret@your-cloudinary-name
   ```

6. **Run the backend:**

   ```bash
   npm run dev
   ```

7. **Run the frontend:**

   ```bash
   cd frontend
   npm run dev
   ```

---

## API Routes

### User Routes

| HTTP Method | Endpoint           | Description                           |
| ----------- | ------------------ | ------------------------------------- |
| `POST`      | `/signup`          | Register a new user                   |
| `POST`      | `/login`           | Log in an existing user               |
| `POST`      | `/logout`          | Log out a user                        |
| `POST`      | `/isLoggedIn`      | Check if a user is logged in          |
| `POST`      | `/forgot-password` | Request password reset via email      |
| `POST`      | `/verify-otp`      | Verify OTP for password reset         |
| `POST`      | `/reset-password`  | Reset user password                   |
| `GET`       | `/profile/:query`  | Get user profile details              |
| `POST`      | `/follow/:queryId` | Follow/unfollow a user                |
| `PUT`       | `/update/:userId`  | Update user profile (with Cloudinary) |
| `GET`       | `/search`          | Search for users by username or name  |

### Post Routes

| HTTP Method | Endpoint          | Description                         |
| ----------- | ----------------- | ----------------------------------- |
| `GET`       | `/feeds`          | Get posts from followed users       |
| `GET`       | `/:postId`        | Get a specific post by its ID       |
| `GET`       | `/user/:username` | Get posts by a specific user        |
| `POST`      | `/create`         | Create a new post (with Cloudinary) |
| `DELETE`    | `/:postId`        | Delete a post by ID                 |
| `PUT`       | `/like/:postId`   | Like or unlike a post               |
| `PUT`       | `/reply/:postId`  | Add a reply (comment) to a post     |

### Message Routes

| HTTP Method | Endpoint         | Description                       |
| ----------- | ---------------- | --------------------------------- |
| `GET`       | `/conversations` | Get all conversations of the user |
| `GET`       | `/:otherUserId`  | Get messages between users        |
| `POST`      | `/`              | Send a message to another user    |

---

## Frontend Routes

The frontend is built using **React** and **React Router**. Here are the main routes:

| Route                 | Component           | Description                        |
| --------------------- | ------------------- | ---------------------------------- |
| `/`                   | `HomePage`          | Home feed showing posts            |
| `/auth`               | `AuthPage`          | Authentication page (login/signup) |
| `/update`             | `UpdateProfilePage` | Update user profile                |
| `/search`             | `SearchPage`        | Search for users                   |
| `/create`             | `CreatePost`        | Create a new post                  |
| `/:username`          | `UserPage`          | View a user's profile and posts    |
| `/:username/post/:id` | `PostDetails`       | View a specific post               |
| `/activity`           | `Activity`          | User activity (likes, follows)     |
| `/chat`               | `ChatPage`          | Real-time chat with users          |

---

## Environment Variables

The following environment variables are required for the backend:

```plaintext
PORT: The port number where the backend server will run.
MONGODB_URI: MongoDB connection string.
DB_NAME: The name of the MongoDB database.
JWT_SECRET: Secret key for JWT token generation.
MAIL_PASSWORD: Password for the email service (e.g., Gmail).
MAIL_USERNAME: Email account used for sending OTPs.
CLOUDINARY_NAME: Cloudinary cloud name for image uploads.
CLOUDINARY_API_KEY: Cloudinary API key.
CLOUDINARY_API_SECRET: Cloudinary API secret.
CLOUDINARY_URL: Complete Cloudinary URL.
```
