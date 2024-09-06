import express from "express";
import {
  createUser,
  deleteUserById,
  getAttendants,
  getUserById,
  getUsers,
  updateUserById,
  updateUserPasswordById,
} from "../controllers/users";

const userRouter = express.Router();

userRouter.get("/users", getUsers);
userRouter.get("/users/:id", getUserById);
userRouter.post("/users", createUser);
userRouter.put("/users/:id", updateUserById);
userRouter.put("/users/update-password/:id", updateUserPasswordById);
userRouter.delete("/users/:id", deleteUserById);

userRouter.get("/attendants", getAttendants);

export default userRouter;
