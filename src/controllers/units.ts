import { db } from "../db/db";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";

export async function createUnite(req: Request, res: Response) {
  try {
    // Get the data
    const { name, abbreviation, slug } = req.body;

    // Check if shop already exists
    const existingUnit = await db.unit.findUnique({
      where: {
        slug,
      },
    });
    if (existingUnit) {
      return res.status(409).json({
        error: `Unit  (${name}) already exists`,
        data: null,
      });
    }
    // Create the Unit
    const newUnit = await db.unit.create({
      data: {
        name,
        abbreviation,
        slug,
      },
    });
    // Return the unit
    return res.status(201).json({
      data: newUnit,
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

export async function getUnits(req: Request, res: Response) {
  try {
    const units = await db.unit.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json({
      data: units,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      data: null,
      error: "Something went wrong",
    });
  }
}

export async function getUnitById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Validate if `id` is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        data: null,
        error: "Unit does not exist",
      });
    }

    const existingUnit = await db.unit.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingUnit) {
      return res.status(404).json({
        data: null,
        error: "Unit does not exist",
      });
    }

    return res.status(200).json({
      data: existingUnit,
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

export async function updateUnitById(req: Request, res: Response) {
  const { id } = req.params;
  const { name, abbreviation, slug } = req.body;
  try {
    const existingUnit = await db.unit.findUnique({
      where: {
        id,
      },
    });
    if (!existingUnit) {
      return res.status(404).json({
        data: null,
        error: "Unit not found",
      });
    }

    if (slug !== existingUnit.slug) {
      const existingUnitBySlug = await db.unit.findUnique({
        where: {
          slug,
        },
      });

      if (existingUnitBySlug) {
        return res.status(409).json({
          error: `Unit (${name}) already exists`,
          data: null,
        });
      }
    }

    const updatedUnit = await db.unit.update({
      where: {
        id,
      },
      data: {
        name,
        abbreviation,
        slug,
      },
    });

    return res.status(200).json({
      data: updatedUnit,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong", data: null });
  }
}

export async function deleteUnitById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const unit = await db.unit.findUnique({
      where: {
        id,
      },
    });
    if (!unit) {
      return res.status(404).json({
        data: null,
        error: "Unit not found",
      });
    }

    await db.unit.delete({
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
