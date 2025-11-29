import express from "express";
import authRoutes from "./auth.route.js";
import { postCreateValidationSchema, postUpdateValidationSchema } from "../schema/post.schema.js";
import Validate from "../middlewares/validate.js";
import {loadResource} from '../middlewares/loadResource.js'
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
import { adminAndOwnerAccess, authorOrAdminOnly, protectedRoute } from "../middlewares/auth.middleware.js";
import Post from "../models/post.model.js";
import { commentCreateValidationSchema } from "../schema/comment.schema.js";
import Comment from "../models/comment.model.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.use("/auth", authRoutes);

// ============= POSTS =============

// Public
router.get("/posts", fetchPost);
router.get("/posts/:id", fetchPostById);

// Protected + admin/owner
router.post("/posts",
  Validate(postCreateValidationSchema),
  protectedRoute,
  authorOrAdminOnly,
  createPost);

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

// ============= COMMENTS =============

// Public
router.get("/posts/:id/comments", fetchComments);

// Protected
router.post("/posts/:id/comments",
  Validate(commentCreateValidationSchema),
  protectedRoute,
   createComment);

router.delete(
  "/posts/:id/comments/:commentId",
  protectedRoute,
  loadResource(Comment,"commentId"),
  adminAndOwnerAccess,
  deleteComment
);

export default router;
