import { db } from "@/db/db";
import { Request, Response } from "express";

export async function createSupplier(req: Request, res: Response) {
  const {
    supplierType,
    name,
    contactPerson,
    phone,
    email,
    location,
    country,
    website,
    taxPin,
    registrationNumber,
    bankAccountNumber,
    paymentTerms,
    logo,
    rating,
    notes,
  } = req.body;
  try {
    const existingSupplierByPhone = await db.supplier.findUnique({
      where: {
        phone,
      },
    });
    if (existingSupplierByPhone) {
      return res.status(409).json({
        error: `Phone Number (${phone}) is already in use`,
      });
    }

    if (email) {
      const existingSupplierByEmail = await db.supplier.findUnique({
        where: {
          email,
        },
      });
      if (existingSupplierByEmail) {
        return res.status(409).json({
          error: `Email Address (${email}) is already in use`,
        });
      }
    }

    if (registrationNumber) {
      const existingSupplierByRegNumber = await db.supplier.findUnique({
        where: {
          registrationNumber,
        },
      });
      if (existingSupplierByRegNumber) {
        return res.status(409).json({
          error: `Registration Number (${registrationNumber}) is already in use`,
        });
      }
    }

    const newSupplier = await db.supplier.create({
      data: {
        supplierType,
        name,
        contactPerson,
        phone,
        email,
        location,
        country,
        website,
        taxPin,
        registrationNumber,
        bankAccountNumber,
        paymentTerms,
        logo,
        rating,
        notes,
      },
    });
    return res.status(201).json(newSupplier);
  } catch (error) {
    console.log(error);
  }
}

export async function getSuppliers(req: Request, res: Response) {
  try {
    const suppliers = await db.supplier.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json(suppliers);
  } catch (error) {
    console.log(error);
  }
}

export async function getSupplierById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const supplier = await db.supplier.findUnique({
      where: {
        id,
      },
    });
    if (!supplier) {
      return res.status(404).json({
        error: "Supplier not found",
        data: null,
      });
    }
    return res.status(200).json(supplier);
  } catch (error) {
    console.log(error);
  }
}
