# TaskPlanet - Mini Social Post Application

TaskPlanet is a full-stack mini social media application where users can create accounts, share text and images, view posts from the community, like posts, and add comments.

The project is built using React.js for the frontend, Node.js + Express.js for the backend, and MongoDB for database storage.

##  Live Demo

Frontend:
https://mini-social-web-gilt.vercel.app

Backend:
https://mini-social-web.onrender.com

GitHub:
https://github.com/raghunathr1/Mini-Social-Web


##  Project Overview

TaskPlanet is designed as a simple social posting platform.

Users can:

- Create an account
- Login securely
- Create text posts
- Upload image posts
- Create posts containing both text and images
- View all public posts
- Like and unlike posts
- Add comments to posts
- View like and comment counts
- Logout securely

The application uses JWT authentication to protect user-specific actions.


##  Features

##  Authentication

- User signup with email and password
- User login with email and password
- Password hashing using bcryptjs
- JWT-based authentication
- Protected routes
- Token stored in browser localStorage
- Logout functionality
- Duplicate email validation


## Create Posts

Users can create posts containing:

- Text
- Image
- Text + Image


Additional features:

- Image preview before uploading
- Remove selected image
- Maximum 500 characters for text
- Character counter
- Loading state while posting
- Form validation
- Error and success messages

---

## Public Feed

The feed displays all posts.

Each post contains:

- Username
- Post text
- Post image
- Like count
- Comment count
- Like button
- Comment input
- Comments
- Post creation date

Posts are displayed with the newest posts first.

## Like / Unlike

Authenticated users can:

- Like a post
- Unlike a post
- See the total number of likes

The backend stores the users who liked each post.

---

## Comments

Authenticated users can add comments to posts.

Each comment stores:

- User ID
- Username
- Comment text
- Creation date

The total comment count is displayed with every post.

---

## Responsive UI

The application is designed to work on:

- Desktop
- Laptop
- Tablet
- Mobile devices

The UI includes:

- Responsive navigation
- Responsive authentication cards
- Responsive post cards
- Responsive images
- Mobile-friendly feed
- Clean modern styling


## Frontend

- React.js
- Vite
- React Router DOM
- JavaScript
- HTML5
- CSS3
- Fetch API

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- CORS
- dotenv

## Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Databases Structures
users
posts
