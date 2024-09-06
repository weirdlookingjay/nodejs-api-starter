import { db } from "../db/db";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";

export async function createProduct(req: Request, res: Response) {
  try {
    // Get the data
    const {
      name,
      Description,
      batchNumber,
      barCode,
      image,
      tax,
      alertQty,
      stockQty,
      price,
      buyingPrice,
      sku,
      productCode,
      slug,
      supplierId,
      unitId,
      brandId,
      categoryId,
      expiryDate,
      unit,
      brand,
      category,
      supplier,
    } = req.body;

    const existingProductBySlug = await db.product.findUnique({
      where: {
        slug,
      },
    });
    if (existingProductBySlug) {
      return res.status(409).json({
        error: `Product (${name}) already exists`,
        data: null,
      });
    }

    const existingProductBySku = await db.product.findUnique({
      where: {
        sku,
      },
    });
    if (existingProductBySku) {
      return res.status(409).json({
        error: `Product SKU (${sku}) already exists`,
        data: null,
      });
    }

    const existingProductByProductCode = await db.product.findUnique({
      where: {
        productCode,
      },
    });
    if (existingProductByProductCode) {
      return res.status(409).json({
        error: `Product Code (${productCode}) already exists`,
        data: null,
      });
    }
    if (barCode) {
      const existingProductByBarCode = await db.product.findUnique({
        where: {
          barCode,
        },
      });
      if (existingProductByBarCode) {
        return res.status(409).json({
          error: `Product Bar Code (${barCode}) already exists`,
          data: null,
        });
      }
    }

    // Create the Product
    const newProduct = await db.product.create({
      data: {
        name,
        Description,
        batchNumber,
        barCode,
        image,
        tax,
        alertQty,
        stockQty,
        price,
        buyingPrice,
        sku,
        productCode,
        slug,
        supplierId,
        unitId,
        brandId,
        categoryId,
        expiryDate,
        unit,
        brand,
        category,
        supplier,
      },
    });
    // Return the Product
    return res.status(201).json({
      data: newProduct,
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

export async function getProducts(req: Request, res: Response) {
  try {
    const products = await db.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return res.status(200).json({
      data: products,
      error: null,
    });
  } catch (error) {
    return res.status(500).json({
      data: null,
      error: "Something went wrong",
    });
  }
}

export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // Validate if `id` is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        data: null,
        error: "Product does not exist",
      });
    }

    const existingProduct = await db.product.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        data: null,
        error: "Product does not exist",
      });
    }

    return res.status(200).json({
      data: existingProduct,
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

export async function updateProductById(req: Request, res: Response) {
  const { id } = req.params;
  const {
    name,
    Description,
    batchNumber,
    barCode,
    image,
    tax,
    alertQty,
    stockQty,
    price,
    buyingPrice,
    sku,
    productCode,
    slug,
    supplierId,
    unitId,
    brandId,
    categoryId,
    expiryDate,
    unit,
    brand,
    category,
    supplier,
  } = req.body;
  try {
    const existingProduct = await db.product.findUnique({
      where: {
        id,
      },
    });
    if (!existingProduct) {
      return res.status(404).json({
        data: null,
        error: "Product not found",
      });
    }

    if (slug !== existingProduct.slug) {
      const existingProductBySlug = await db.product.findUnique({
        where: {
          slug,
        },
      });

      if (existingProductBySlug) {
        return res.status(409).json({
          error: `Product (${name}) already exists`,
          data: null,
        });
      }
    }

    if (sku !== existingProduct.sku) {
      const existingProductBySku = await db.product.findUnique({
        where: {
          sku,
        },
      });

      if (existingProductBySku) {
        return res.status(409).json({
          error: `Product SKU (${sku}) already exists`,
          data: null,
        });
      }
    }

    if (barCode !== existingProduct.barCode) {
      const existingProductByBarCode = await db.product.findUnique({
        where: {
          barCode,
        },
      });

      if (existingProductByBarCode) {
        return res.status(409).json({
          error: `Product BarCode (${barCode}) already exists`,
          data: null,
        });
      }
    }

    if (productCode !== existingProduct.productCode) {
      const existingProductByProductCode = await db.product.findUnique({
        where: {
          productCode,
        },
      });

      if (existingProductByProductCode) {
        return res.status(409).json({
          error: `Product Code (${productCode}) already exists`,
          data: null,
        });
      }
    }

    const updatedProduct = await db.product.update({
      where: {
        id,
      },
      data: {
        name,
        Description,
        batchNumber,
        barCode,
        image,
        tax,
        alertQty,
        stockQty,
        price,
        buyingPrice,
        sku,
        productCode,
        slug,
        supplierId,
        unitId,
        brandId,
        categoryId,
        expiryDate,
        unit,
        brand,
        category,
        supplier,
      },
    });

    return res.status(200).json({
      data: updatedProduct,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong", data: null });
  }
}

export async function deleteProductById(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const product = await db.product.findUnique({
      where: {
        id,
      },
    });
    if (!product) {
      return res.status(404).json({
        data: null,
        error: "Product not found",
      });
    }

    await db.product.delete({
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
