import express from "express";
import {
  createShop,
  getShopAttendants,
  getShopById,
  getShops,
} from "../controllers/shops";

const shopRouter = express.Router();

shopRouter.post("/shops", createShop);
shopRouter.get("/shops", getShops);
shopRouter.get("/shops/:id", getShopById);
shopRouter.get("/attendants/shop/:id", getShopAttendants);

export default shopRouter;
