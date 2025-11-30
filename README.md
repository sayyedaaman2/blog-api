# blog-api

Role-based blog backend API built with Node.js, Express, and MongoDB.

Supports three user roles:

- **admin**
- **author**
- **user**

Admins and authors can manage posts; all authenticated users can comment.

---

## 🚀 Features

- JWT-based authentication (`admin`, `author`, `user`)
- Role-based access control:
  - Only **admin** and **author** can create posts
  - Only **admin** or the **resource owner** can update/delete posts
- Public and protected routes
- Blog posts with tags, slug, and published flag
- Comments on posts
- Request validation using Joi schemas
- MongoDB + Mongoose for data persistence

---

## 🧱 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Database:** MongoDB
- **ODM:** Mongoose
- **Auth:** JSON Web Tokens (JWT)
- **Validation:** Joi
- **Config:** dotenv
- **Password hashing:** bcryptjs
- **Dev:** nodemon

From `package.json`:

```json
"dependencies": {
  "bcryptjs": "^3.0.3",
  "dotenv": "^17.2.3",
  "express": "^5.1.0",
  "joi": "^18.0.2",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^9.0.0"
},
"devDependencies": {
  "nodemon": "^3.1.11"
}
```

---

## 📁 Folder Structure

```bash
blog-api/
├── config/              # DB connection, app configuration, etc.
├── controllers/         # Route handlers (auth, posts, comments)
├── middlewares/         # Auth, validation, loadResource, etc.
├── models/              # Mongoose models (User, Post, Comment)
├── routes/              # Express route definitions
├── schema/              # Joi validation schemas (post, comment, etc.)
├── utils/               # Helper utilities
├── .env                 # Environment variables (not committed)
├── .env.example         # Example env file (recommended)
├── server.js            # Application entry point
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

The project uses a `.env` file in the root.

Example configuration:

```env
PORT=9000
MONGO_URI="mongodb://127.0.0.1:27017/blog-api"
JWT_SECRET=some-long-random-string-here
JWT_EXPIRES_IN=7d
```

You should create:

- `.env` for local development  
- `.env.example` for reference in the repo

---

## 🔧 Installation

```bash
# Clone the repository
git clone https://github.com/sayyedaaman2/blog-api.git

cd blog-api

# Install dependencies
npm install
```

---

## ▶️ Running the Project

```bash
# Development
npm run dev   # uses nodemon server.js

# Production
npm start     # node server.js
```

From `package.json`:

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "dev": "nodemon server.js",
  "start": "node server.js"
}
```

---

## 🌐 Base URL

Local base URL (using your `.env`):

```text
http://localhost:9000
```

All API routes are mounted on this base. Examples:

- `GET /` — health/test route
- `POST /auth/login`
- `GET /posts`

---

## 👥 Roles & Access Control

There are three user roles:

- **admin**
- **author**
- **user** (default)

Access rules:

- **Public**
  - `GET /posts`
  - `GET /posts/:id`
  - `GET /posts/:id/comments`

- **Protected (any logged-in user)**
  - `POST /posts/:id/comments`
  - `DELETE /posts/:id/comments/:commentId` (only admin or comment owner)

- **Author/Admin only**
  - `POST /posts` (create post)

- **Admin or Owner**
  - `PATCH /posts/:id` (update post)
  - `DELETE /posts/:id` (delete post)
  - `DELETE /posts/:id/comments/:commentId` (comment owner or admin)

Middlewares involved:

- `protectedRoute` — validates JWT and attaches user to `req`
- `authorOrAdminOnly` — ensures role is `author` or `admin`
- `adminAndOwnerAccess` — ensures user is admin or owner of the resource
- `loadResource(Model, paramKey)` — loads Post/Comment by ID and attaches it to `req.resource`

---

## 🧩 Routing Overview

From the main router:

```ts
router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.use("/auth", authRoutes);

// POSTS
router.get("/posts", fetchPost);
router.get("/posts/:id", fetchPostById);

router.post(
  "/posts",
  Validate(postCreateValidationSchema),
  protectedRoute,
  authorOrAdminOnly,
  createPost
);

router.patch(
  "/posts/:id",
  Validate(postUpdateValidationSchema),
  protectedRoute,
  loadResource(Post, "id"),
  adminAndOwnerAccess,
  updatePost
);

router.delete(
  "/posts/:id",
  protectedRoute,
  loadResource(Post, "id"),
  adminAndOwnerAccess,
  deletePost
);

// COMMENTS
router.get("/posts/:id/comments", fetchComments);

router.post(
  "/posts/:id/comments",
  Validate(commentCreateValidationSchema),
  protectedRoute,
  createComment
);

router.delete(
  "/posts/:id/comments/:commentId",
  protectedRoute,
  loadResource(Comment, "commentId"),
  adminAndOwnerAccess,
  deleteComment
);
```

---

## 🔐 Authentication API

Base path for auth routes:

```text
/auth
```

> Note: Exact auth route names (`/signup`, `/login`, etc.) come from `auth.route.js`.

### Signup (Admin / Author / User)

**Endpoint**

```http
POST /auth/signup
Content-Type: application/json
```

**Request Body (Admin)**

```json
{
  "name": "admin",
  "email": "admin@gmail.com",
  "password": "Admin000",
  "role": "admin"
}
```

**Request Body (Author)**

```json
{
  "name": "author",
  "email": "author@gmail.com",
  "password": "Author000",
  "role": "author"
}
```

**Request Body (User)**

```json
{
  "name": "user",
  "email": "user@gmail.com",
  "password": "User00001"
}
```

If `role` is omitted, it defaults to `user`.
**Success Response (example)**

```json
{
"success": true,
"message": "User created successfully.",
  "user": {
    "id": "user_id_here",
    "name": "user_name",
    "email": "user_email",
    "role": "user_role",
    "createdAt" : "<user_created_at>", // creation time
    "updatedAt" : "<user_updated_at>", // last updated time
  }
}
---

### Login

**Endpoint**

```http
POST /auth/login
Content-Type: application/json
```

**Request Body (example)**

```json
{
  "email": "admin@gmail.com",
  "password": "Admin000"
}
```

**Success Response (example)**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "<jwt_token_here>",
  "user": {
    "id": "<user_id_here>",
    "name": "admin",
    "email": "admin@gmail.com",
    "role": "admin",
    "createdAt" : "<user_created_at>", // creation time
    "updatedAt" : "<user_updated_at>", // last updated time
  }
}
```

Use the token in protected routes:

```http
Authorization: Bearer <jwt_token_here>
```

**Error Response (example)**

```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## 📝 Posts API

Base path:

```text
/posts
```

### 1. Create Post (Author/Admin only)

**Endpoint**

```http
POST /posts
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**

```json
{
  "title": "postman api",
  "slug": "postman-api-flow-system",
  "content": "nodejs is backend library",
  "tags": ["test", "next.js", "node.js"],
  "published": true
}
```

This route pipeline:

- `Validate(postCreateValidationSchema)`
- `protectedRoute`
- `authorOrAdminOnly`

---

### 2. Fetch Posts (Public, with optional filters)

**Endpoint**

```http
GET /posts
```

**Optional Query Parameters**

- `tags` – filter by tag (e.g. `tags=next.js`)
- `search` – text search in title/content
- `limit` – number of items per page
- `page` – page number
- `author` – filter by author id

Example:

```http
GET /posts?limit=2&page=1
```

**Response (example)**

```json
{
  "message": "Posts fetched successfully",
   "meta": {
        "page": 1,
        "limit": 10,
        "total": 4,
        "totalPages": 1,
        "hasNext": false,
        "hasPrev": false
    },
  "data": [
    {
      "id": "post_id",
      "title": "postman api",
      "slug": "postman-api-flow-system",
      "content": "nodejs is backend library",
      "tags": ["test", "next.js", "node.js"],
      "author": {
        "id": "author_id",
        "name": "author"
      },
      "published": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ],
  
}
```

---

### 3. Fetch Post by ID (Public)

**Endpoint**

```http
GET /posts/:id
```

Example:

```http
GET /posts/692897b0d7d0ec8fed3264be
```

**Response (example)**

```json
{
"message": "Post fetched successfully",
  "data": {
    "id": "692897b0d7d0ec8fed3264be",
    "title": "some post",
    "slug": "some-post",
    "content": "content here",
    "tags": ["tag1", "tag2"],
    "author": {
      "id": "author_id",
      "name": "author"
    },
    "published": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### 4. Update Post (Admin / Post Owner)

**Endpoint**

```http
PATCH /posts/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body (example)**

```json
{
  "slug": "next-js-problem-solving-updated",
  "tags": ["node.js", "next-js-problem-solving-updated"]
}
```

Pipeline:

- `Validate(postUpdateValidationSchema)`
- `protectedRoute`
- `loadResource(Post, "id")`
- `adminAndOwnerAccess`

If the authenticated user is **not** the owner and **not** an admin, the request is rejected.
**Response (example)**

```json
{
"message": "Post updated successfully",
  "data": {
    "id": "692897b0d7d0ec8fed3264be",
    "title": "some post",
    "slug": "some-post",
    "content": "content here",
    "tags": ["tag1", "tag2"],
    "author": {
      "id": "author_id",
      "name": "author"
    },
    "published": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

### 5. Delete Post (Admin / Post Owner)

**Endpoint**

```http
DELETE /posts/:id
Authorization: Bearer <token>
```

Pipeline:

- `protectedRoute`
- `loadResource(Post, "id")`
- `adminAndOwnerAccess`

**Response (example)**

```json
"message": "Post updated successfully",
  "data": {
    "id": "692897b0d7d0ec8fed3264be",
    "title": "some post",
    "slug": "some-post",
    "content": "content here",
    "tags": ["tag1", "tag2"],
    "author": {
      "id": "author_id",
      "name": "author"
    },
    "published": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

---

## 💬 Comments API

Comments are nested under posts:

```text
/posts/:id/comments
```

### 1. Fetch Comments (Public)

**Endpoint**

```http
GET /posts/:id/comments
```

Example:

```http
GET /posts/692af9dac4eb5950524e11ad/comments
```

**Response (example)**

```json
{
  "success": true,
  "data": [
    {
      "id": "comment_id",
      "content": "testing",
      "author": "user_id",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"

    }
  ]
}
```

---

### 2. Create Comment (Any Authenticated User)

**Endpoint**

```http
POST /posts/:id/comments
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**

```json
{
  "content": "testing comment"
}
```

Validated by `commentCreateValidationSchema`.

---

### 3. Delete Comment (Admin / Comment Owner)

**Endpoint**

```http
DELETE /posts/:id/comments/:commentId
Authorization: Bearer <token>
```

Pipeline:

- `protectedRoute`
- `loadResource(Comment, "commentId")`
- `adminAndOwnerAccess`

**Response (example)**

```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

---

## ⚠️ Error Handling

The project uses centralized error handling via middleware (and validation middleware).

A typical error response shape can be:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

Exact format depends on the implementation, but it should be consistent across controllers.

---

## 📬 Postman Collection

This project includes a Postman collection (`blog-api.postman_collection.json`) that contains:

- Auth flows (signup/login for admin, author, user)
- Posts (create, fetch, update, delete)
- Comments (fetch, create, delete)

You can import the collection into Postman and configure:

- `base_url` = `http://localhost:9000`
- `token` = JWT from `/auth/login`

---

## 📄 License

This project uses the **ISC** license (as defined in `package.json`).

You can change this to MIT or another license if needed.

---

## ✅ Notes

- Default user role is `user` if `role` is not passed on signup.
- Use `admin` or `author` roles to test post creation and management.
- Make sure MongoDB is running locally on:

```text
mongodb://127.0.0.1:27017/blog-api