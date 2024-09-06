import { db } from "@/db/db";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";

export async function createShop(req: Request, res: Response) {
  try {
    // Get the data
    const { name, slug, location, adminId, attendantIds } = req.body;

    // Check if shop already exists
    const existingShop = await db.shop.findUnique({
      where: {
        slug,
      },
    });
    if (existingShop) {
      return res.status(409).json({
        error: `Shop  (${name}) already exists`,
        data: null,
      });
    }
    // Create the Shop
    const newShop = await db.shop.create({
      data: {
        name,
        slug,
        location,
        adminId,
        attendantIds,
      },
    });
    // Return the shop
    return res.status(201).json({
      data: newShop,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      data: null,
      error: "Something went wrong",
    });
    console.log(error);
  }
}

export async function getShops(req: Request, res: Response) {
  try {
    const shops = await db.shop.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json({
      data: shops,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      data: null,
      error: "Something went wrong",
    });
  }
}

export async function getShopById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Validate if `id` is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        data: null,
        error: "Shop does not exist",
      });
    }

    const existingShop = await db.shop.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingShop) {
      return res.status(404).json({
        data: null,
        error: "Shop does not exist",
      });
    }

    return res.status(200).json({
      data: existingShop,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      data: null,
      error: "Something went wrong",
    });
    console.log(error);
  }
}

export async function getShopAttendants(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const existingShop = await db.shop.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingShop) {
      return res.status(404).json({
        data: null,
        error: "Shop does not exist",
      });
    }

    // Get the Users whose Ids are equal to the shop attendant ids
    const attendants = await db.user.findMany({
      where: {
        id: {
          in: existingShop.attendantIds,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        image: true,
        phone: true,
        email: true,
      },
    });
    return res.status(200).json({
      data: attendants,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      data: null,
      error: "Something went wrong",
    });
  }
}
