import express from "express";
import {} from "../controllers/users";
import { auhtorizeUser } from "../controllers/login";

const loginRouter = express.Router();

loginRouter.post("/auth/login", auhtorizeUser);

export default loginRouter;
