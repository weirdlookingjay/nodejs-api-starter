import { db } from "../db/db";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export async function getUsers(req: Request, res: Response) {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    const filteredUsers = users.map((user) => {
      const { password, ...others } = user;
      return others;
    });
    return res.status(200).json({
      data: filteredUsers,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong", data: null });
  }
}

export async function getUserById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return res.status(404).json({
        data: null,
        error: "User not found",
      });
    }
    const { password, ...others } = user;
    return res.status(200).json({
      data: others,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong", data: null });
  }
}

export async function createUser(req: Request, res: Response) {
  const {
    email,
    username,
    password,
    firstName,
    lastName,
    phone,
    dob,
    gender,
    image,
    role,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const existingUserByEmail = await db.user.findUnique({
      where: {
        email,
      },
    });
    const existingUserByUsername = await db.user.findUnique({
      where: {
        username,
      },
    });
    const existingUserByPhone = await db.user.findUnique({
      where: {
        phone,
      },
    });
    if (existingUserByEmail) {
      res
        .status(409)
        .json({ error: `Email Address (${email}) already in use`, data: null });
      return;
    }
    if (existingUserByUsername) {
      res
        .status(409)
        .json({ error: `Username (${username}) already in use`, data: null });
      return;
    }
    if (existingUserByPhone) {
      res
        .status(409)
        .json({ error: `Phone Number (${phone}) already in use`, data: null });
      return;
    }

    const newUser = await db.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        dob,
        gender,
        role,
        image: image ? image : "https://placehold.co/100x100",
      },
    });

    const { password, ...others } = newUser;
    res.status(201).json({
      data: others,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong", data: null });
  }
}

export async function updateUserById(req: Request, res: Response) {
  const { id } = req.params;
  const {
    email,
    username,
    firstName,
    lastName,
    phone,
    dob,
    gender,
    image,
    password,
  } = req.body;
  try {
    const existingUser = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!existingUser) {
      return res.status(404).json({
        data: null,
        error: "User not found",
      });
    }

    if (email && email !== existingUser.email) {
      const existingUserByEmail = await db.user.findUnique({
        where: {
          email,
        },
      });
      if (existingUserByEmail) {
        return res.status(409).json({
          error: `Email (${email}) is Already taken`,
          data: null,
        });
      }
    }

    if (phone && phone !== existingUser.phone) {
      const existingUserByPhone = await db.user.findUnique({
        where: {
          phone,
        },
      });
      if (existingUserByPhone) {
        return res.status(409).json({
          error: `Phone Number (${phone}) is Already taken`,
          data: null,
        });
      }
    }

    if (username && username !== existingUser.username) {
      const existingUserByUsername = await db.user.findUnique({
        where: {
          username,
        },
      });
      if (existingUserByUsername) {
        return res.status(409).json({
          error: `Username (${username}) is Already taken`,
          data: null,
        });
      }
    }

    let hashedPassword = existingUser.password;

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data: {
        email,
        username,
        firstName,
        lastName,
        phone,
        dob,
        gender,
        image,
        password: hashedPassword,
      },
    });
    const { password: userPassword, ...others } = updatedUser;
    return res.status(200).json({
      data: others,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong", data: null });
  }
}

export async function updateUserPasswordById(req: Request, res: Response) {
  const { id } = req.params;
  const { password } = req.body;
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return res.status(404).json({
        data: null,
        error: "User not found",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data: {
        password: hashedPassword,
      },
    });
    const { password: savedPassword, ...others } = updatedUser;
    return res.status(200).json({
      data: others,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong", data: null });
  }
}

export async function deleteUserById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });
    if (!user) {
      return res.status(404).json({
        data: null,
        error: "User not found",
      });
    }

    await db.user.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong", data: null });
  }
}

export async function getAttendants(req: Request, res: Response) {
  try {
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        role: "ATTENDANT",
      },
    });
    const filteredUsers = users.map((user) => {
      const { password, ...others } = user;
      return others;
    });
    return res.status(200).json({
      data: filteredUsers,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong", data: null });
  }
}
