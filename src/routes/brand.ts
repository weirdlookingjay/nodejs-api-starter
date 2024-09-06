import {
  createBrand,
  deleteBrandById,
  getBrandById,
  getBrands,
  updateBrandById,
} from "@/controllers/brands";
import express from "express";

const brandRouter = express.Router();

brandRouter.get("/brands", getBrands);
brandRouter.get("/brands/:id", getBrandById);
brandRouter.put("/brands/:id", updateBrandById);
brandRouter.post("/brands", createBrand);
brandRouter.delete("/brands/:id", deleteBrandById);

export default brandRouter;
