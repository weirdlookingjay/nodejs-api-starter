import { db } from "../db/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../utils/generateJWT";

export async function auhtorizeUser(req: Request, res: Response) {
  const { email, username, password } = req.body;

  try {
    let existingUser = null;
    if (email) {
      existingUser = await db.user.findUnique({
        where: {
          email,
        },
      });
    }
    if (username) {
      existingUser = await db.user.findUnique({
        where: {
          username,
        },
      });
    }
    if (!existingUser) {
      return res.status(404).json({
        error: "User not found",
        data: null,
      });
    }
    // Check if the Password is Correct
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res
        .status(404)
        .json({
          error: "Incorrect Credentials",
          data: null,
        })
        .status(403);
    }
    // Desctructure out the password from the existing user
    const { password: userPass, ...userWithoutPassword } = existingUser;
    const accessToken = generateAccessToken(userWithoutPassword);
    const result = {
      ...userWithoutPassword,
      accessToken,
    };
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong", data: null });
  }
}
