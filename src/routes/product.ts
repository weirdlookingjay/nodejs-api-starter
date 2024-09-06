import {
  createProduct,
  deleteProductById,
  getProducts,
  getProductById,
  updateProductById,
} from "../controllers/products";
import express from "express";

const productRouter = express.Router();

productRouter.get("/products", getProducts);
productRouter.get("/products/:id", getProductById);
productRouter.put("/products/:id", updateProductById);
productRouter.post("/products", createProduct);
productRouter.delete("/products/:id", deleteProductById);

export default productRouter;
