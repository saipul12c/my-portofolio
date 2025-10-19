import express from "express";
import {
  getAllPosts,
  getPostById,
  getPostBySlug,
  getPostsByCategory,
  searchPosts,
  addPost,
  updatePost,
  deletePost,
  deleteAllPosts,
  getStats
} from "../controllers/postsController.js";
import { validatePost } from "../middlewares/validatePost.js";

const router = express.Router();

// Routes
router.get("/", getAllPosts);
router.get("/stats", getStats);
router.get("/slug/:slug", getPostBySlug);
router.get("/category/:category", getPostsByCategory);
router.get("/search", searchPosts);
router.get("/:id", getPostById);
router.post("/", validatePost, addPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);
router.delete("/", deleteAllPosts);

export default router;
