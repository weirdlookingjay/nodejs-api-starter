import {
  createCategory,
  deleteCategoryById,
  getCategories,
  getCategoryById,
  updateCategoryById,
} from "../controllers/categories";
import express from "express";

const categoryRouter = express.Router();

categoryRouter.get("/categories", getCategories);
categoryRouter.get("/categories/:id", getCategoryById);
categoryRouter.put("/categories/:id", updateCategoryById);
categoryRouter.post("/categories", createCategory);
categoryRouter.delete("/categories/:id", deleteCategoryById);

export default categoryRouter;
