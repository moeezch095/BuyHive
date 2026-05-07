import express from "express";

import {
  getAllCategoriesController,
  getCategoryByIdController,
  getProductByIdController,
  getProducts,
} from "../controllers/category.controller.js";

const router = express.Router();

router.get("/", getAllCategoriesController);
router.get("/products", getProducts);
router.get("/products/:id", getProductByIdController);
router.get("/:id", getCategoryByIdController);

export default router;
