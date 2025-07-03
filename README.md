
# Stream Vibe Backend

A robust RESTful backend API for a movie streaming/review platform. This service handles user authentication, profile management, movie reviews, favorites, watch-later lists, and profile image uploads. Built with Node.js, Express, TypeScript, and MongoDB.

---

## 🚀 Features

- **User Authentication**
  - Register new users
  - Login and logout with JWT (stored in HTTP-only cookies)
- **User Profile**
  - Retrieve user profile and their reviews
  - Upload and update profile picture (Cloudinary integration)
- **Favorites & Watch Later**
  - Add/remove movies to/from favorites
  - Add/remove movies to/from watch-later list
- **Movie Reviews**
  - Add or update a review for a movie
  - Fetch all reviews for a specific movie
- **Security**
  - Passwords hashed with bcrypt
  - Protected routes with JWT authentication
- **Other**
  - CORS and cookie handling
  - Clean error handling and async middleware

---

## 🧰 Technologies Used

- **Node.js** & **Express** (API server)
- **TypeScript** (type safety)
- **MongoDB** & **Mongoose** (database & ODM)
- **JWT** (authentication)
- **bcryptjs** (password hashing)
- **Cloudinary** (profile image uploads)
- **Multer** (file uploads)
- **dotenv** (environment variables)
- **cookie-parser**, **cors** (middleware)

---

## 📦 Project Structure

```
src/
├── controllers/     # Route logic (auth, user, review)
├── middlewares/     # Custom middleware (auth, upload, error handling)
├── models/          # Mongoose models (User, Review)
├── routes/          # Express route handlers
├── app.ts           # App setup
└── server.ts        # Entry point
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- MongoDB instance (local or cloud e.g. MongoDB Atlas)
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/Stream_Vibe_backend.git
   cd Stream_Vibe_backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   NODE_ENV=development
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret

   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. **Run the server in development:**
   ```bash
   npm run dev
   ```
   Or build and start for production:
   ```bash
   npm run build
   npm start
   ```

   The server will run on `http://localhost:5000` by default.

---

## 📡 API Endpoints

### Auth

- `POST /api/auth/register` — Register a new user  
- `POST /api/auth/login` — Login user  
- `POST /api/auth/logout` — Logout user  

### User

- `GET /api/user/profile` — Get user profile and reviews (protected)  
- `POST /api/user/favorites` — Add movie to favorites (protected)  
- `DELETE /api/user/favorites/:movieId` — Remove movie from favorites (protected)  
- `POST /api/user/watchlater` — Add movie to watch later (protected)  
- `DELETE /api/user/watchlater/:movieId` — Remove movie from watch later (protected)  
- `POST /api/user/upload-profilePic` — Upload profile picture (protected, multipart/form-data)  

### Reviews

- `POST /api/reviews/` — Add or update a review for a movie (protected)  
- `GET /api/reviews/:movieId` — Get all reviews for a movie  

---

## 📥 Example Usage

### 🔐 Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "password": "securepassword"
}
```

### 🔑 Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "securepassword"
}
```

### ❤️ Add to Favorites

```http
POST /api/user/favorites
Cookie: token=your_jwt_token
Content-Type: application/json

{
  "movieId": 123,
  "title": "Inception",
  "thumbnail": "https://image.url",
  "IMDB_Rating": 8.8
}
```

### ✍️ Add a Review

```http
POST /api/reviews/
Cookie: token=your_jwt_token
Content-Type: application/json

{
  "movieId": 123,
  "rating": 5,
  "review": "Amazing movie!"
}
```

---

## 🐳 Run with Docker

Make sure you have a `.env` file in the root directory.

### Build the image:

```bash
docker build -t stream-vibe-backend .
```

### Run the container:

```bash
docker run -p 5000:5000 --env-file .env stream-vibe-backend
```

The API will be available at `http://localhost:5000/api`

---

## 💻 Frontend

This backend powers the [Stream Vibe Frontend](https://github.com/yourusername/stream-vibe-frontend), built with Next.js 15.

Make sure to set:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

in the frontend's `.env` file when running locally or with Docker.

---

## 🪪 License

This project is licensed under the ISC License.

---

Feel free to open issues or contribute to the project!
