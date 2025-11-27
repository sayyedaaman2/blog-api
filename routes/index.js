import express from "express";
import { adminAndOwnerAccess,authorOrAdminOnly,protectedRoute } from "../middlewares/auth.middleware.js";
import { loadResource } from "../middlewares/loadResource.js";
import authRoutes from "./auth.route.js";
import Post from "../models/post.model.js";
import Comment from "../models/comment.model.js";

import {
  createPost,
  fetchPost,
  fetchPostById,
  updatePost,
  deletePost,
} from "../controllers/post.controller.js";

import {
  createComment,
  deleteComment,
  fetchComments,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.use("/auth", authRoutes);

// ============= POSTS =============

// Public
router.get("/posts", fetchPost);
router.get("/posts/:postId", fetchPostById);

// Protected + admin/owner
router.post("/posts", protectedRoute,authorOrAdminOnly, createPost);

router.patch(
  "/posts/:postId",
  protectedRoute,
  loadResource(Post, "postId"),
  adminAndOwnerAccess,
  updatePost
);

router.delete(
  "/posts/:postId",
  protectedRoute,
  loadResource(Post, "postId"),
  adminAndOwnerAccess,
  deletePost
);

// ============= COMMENTS =============

// Public
router.get("/posts/:postId/comments", fetchComments);

// Protected
router.post(
  "/posts/:postId/comments",
  protectedRoute,
  createComment
);

router.delete(
  "/posts/:postId/comments/:commentId",
  protectedRoute,
  loadResource(Comment, "commentId"),
  adminAndOwnerAccess,
  deleteComment
);

export default router;
