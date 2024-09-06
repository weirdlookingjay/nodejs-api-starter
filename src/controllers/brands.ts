import { db } from "../db/db";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";

export async function createBrand(req: Request, res: Response) {
  try {
    // Get the data
    const { name, slug } = req.body;

    // Check if shop already exists
    const existingBrand = await db.brand.findUnique({
      where: {
        slug,
      },
    });
    if (existingBrand) {
      return res.status(409).json({
        error: `Brand (${name}) already exists`,
        data: null,
      });
    }
    // Create the Brand
    const newBrand = await db.brand.create({
      data: {
        name,
        slug,
      },
    });
    // Return the Brand
    return res.status(201).json({
      data: newBrand,
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

export async function getBrands(req: Request, res: Response) {
  try {
    const brands = await db.brand.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json({
      data: brands,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      data: null,
      error: "Something went wrong",
    });
  }
}

export async function getBrandById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Validate if `id` is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        data: null,
        error: "Brand does not exist",
      });
    }

    const existingBrand = await db.brand.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingBrand) {
      return res.status(404).json({
        data: null,
        error: "Brand does not exist",
      });
    }

    return res.status(200).json({
      data: existingBrand,
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

export async function updateBrandById(req: Request, res: Response) {
  const { id } = req.params;
  const { name, slug } = req.body;
  try {
    const existingBrand = await db.brand.findUnique({
      where: {
        id,
      },
    });
    if (!existingBrand) {
      return res.status(404).json({
        data: null,
        error: "Brand not found",
      });
    }

    if (slug !== existingBrand.slug) {
      const existingBrandBySlug = await db.brand.findUnique({
        where: {
          slug,
        },
      });

      if (existingBrandBySlug) {
        return res.status(409).json({
          error: `Name (${name}) already exists`,
          data: null,
        });
      }
    }

    const updatedBrand = await db.brand.update({
      where: {
        id,
      },
      data: {
        name,
        slug,
      },
    });

    return res.status(200).json({
      data: updatedBrand,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong", data: null });
  }
}

export async function deleteBrandById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const brand = await db.brand.findUnique({
      where: {
        id,
      },
    });
    if (!brand) {
      return res.status(404).json({
        data: null,
        error: "Brand not found",
      });
    }

    await db.brand.delete({
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
