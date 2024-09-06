import { db } from "@/db/db";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";

export async function createCategory(req: Request, res: Response) {
  try {
    // Get the data
    const { name, slug } = req.body;

    // Check if shop already exists
    const existingCategory = await db.category.findUnique({
      where: {
        slug,
      },
    });
    if (existingCategory) {
      return res.status(409).json({
        error: `Category (${name}) already exists`,
        data: null,
      });
    }
    // Create the Brand
    const newCategory = await db.category.create({
      data: {
        name,
        slug,
      },
    });
    // Return the Brand
    return res.status(201).json({
      data: newCategory,
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

export async function getCategories(req: Request, res: Response) {
  try {
    const categories = await db.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json({
      data: categories,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      data: null,
      error: "Something went wrong",
    });
  }
}

export async function getCategoryById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Validate if `id` is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        data: null,
        error: "Category does not exist",
      });
    }

    const existingCategory = await db.category.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingCategory) {
      return res.status(404).json({
        data: null,
        error: "Category does not exist",
      });
    }

    return res.status(200).json({
      data: existingCategory,
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

export async function updateCategoryById(req: Request, res: Response) {
  const { id } = req.params;
  const { name, slug } = req.body;
  try {
    const existingCategory = await db.category.findUnique({
      where: {
        id,
      },
    });
    if (!existingCategory) {
      return res.status(404).json({
        data: null,
        error: "Category not found",
      });
    }

    if (slug !== existingCategory.slug) {
      const existingCategoryBySlug = await db.category.findUnique({
        where: {
          slug,
        },
      });

      if (existingCategoryBySlug) {
        return res.status(409).json({
          error: `Category (${name}) already exists`,
          data: null,
        });
      }
    }

    const updatedCategory = await db.category.update({
      where: {
        id,
      },
      data: {
        name,
        slug,
      },
    });

    return res.status(200).json({
      data: updatedCategory,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong", data: null });
  }
}

export async function deleteCategoryById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const category = await db.category.findUnique({
      where: {
        id,
      },
    });
    if (!category) {
      return res.status(404).json({
        data: null,
        error: "Category not found",
      });
    }

    await db.category.delete({
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
