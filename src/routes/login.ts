import express from "express";
import {} from "../controllers/users";
import {
  auhtorizeUser,
  forgotPassword,
  verifyToken,
  changePassword,
} from "../controllers/login";

const loginRouter = express.Router();

loginRouter.post("/auth/login", auhtorizeUser);
loginRouter.put("/auth/forgot-password", forgotPassword);
loginRouter.put("/auth/change-password", changePassword);
loginRouter.get("/auth/verify-token", verifyToken);

export default loginRouter;
