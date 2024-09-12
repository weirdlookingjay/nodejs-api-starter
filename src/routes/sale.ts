import express from "express";
import { createSale, createSaleItem, getSales } from "src/controllers/sales";

const saleRouter = express.Router();

saleRouter.post("/sales", createSale);
saleRouter.post("/sales/item", createSaleItem);
saleRouter.get("/sales", getSales);

export default saleRouter;
