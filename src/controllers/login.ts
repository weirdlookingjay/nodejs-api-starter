import { db } from "../db/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateAccessToken } from "../utils/generateJWT";
import { generateToken } from "src/utils/generateToken";
import { addMinutes } from "date-fns";
import { Resend } from "resend";
import { generateEmailHTML } from "src/utils/generateEmailHTML";

const resend = new Resend(process.env.RESEND_API_KEY);

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

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const existingUser = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    const resetToken = generateToken().toString();
    const resetTokenExpiry = addMinutes(new Date(), 10);
    const currentTime = new Date();

    // Update the User with teh Token and expiry date
    const updatedUser = await db.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    const emailHtml = generateEmailHTML(resetToken);

    // Send the Email with the Token
    const { data, error } = await resend.emails.send({
      from: "Admin <info@weirdlookingjay.com>",
      to: email,
      subject: "Password Reset Request",
      html: emailHtml,
    });

    if (error) {
      return res.status(400).json({ error });
    }

    const result = {
      userId: updatedUser.id,
      emailId: data?.id,
    };

    return res.status(200).json({
      message: `Password reset email sent to ${email}`,
      data: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      data: null,
    });
  }
}

export async function verifyToken(req: Request, res: Response) {
  try {
    const { token } = req.params;
    const existingUser = await db.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gte: new Date() },
      },
    });

    if (!existingUser) {
      return res.status(400).json({
        error: "Invalid or expired token",
      });
    }

    res.status(200).json({ message: "Token is valid" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      data: null,
    });
  }
}

export async function changePassword(req: Request, res: Response) {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await db.user.findFirst({
      select: {
        id: true,
      },
      where: {
        resetToken: token,
        resetTokenExpiry: { gte: new Date() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
