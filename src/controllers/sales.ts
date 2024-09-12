import { db } from "../db/db";
import { Request, Response } from "express";
import { SaleRequestBody } from "src/types/types";
import { generateSaleNumber } from "src/utils/generateSaleNumber";

export async function createSale(req: Request, res: Response) {
  // Get the data
  const {
    customerId,
    customerName,
    customerEmail,
    saleAmount,
    balanceAmount,
    paidAmount,
    saleType,
    paymentMethod,
    shopId,
    transactionCode,
    salesItems,
  }: SaleRequestBody = req.body;

  try {
    const saleId = await db.$transaction(async (transaction) => {
      if (balanceAmount > 0) {
        // Is the customer allowed to take credit
        const existingCustomer = await transaction.customer.findUnique({
          where: { id: customerId },
        });

        if (!existingCustomer) {
          return res
            .json({
              error: "Customer not found",
              data: null,
            })
            .status(404);
        }
        if (balanceAmount > existingCustomer.maxCreditLimit) {
          return res
            .status(403)
            .json({ error: "Insufficient credit limit", data: null });
        }
        // Update the customer unpaid amount
        // Update the customer MaxCredit amount
        const updatedCustomer = await transaction.customer.update({
          where: { id: customerId },
          data: {
            unpaidCreditAmount:
              existingCustomer!.unpaidCreditAmount! + balanceAmount,
            maxCreditLimit: {
              decrement: balanceAmount,
            },
          },
        });
        if (!updatedCustomer) {
          return res
            .json({
              error: "Failed to update the customercredit details",
              data: null,
            })
            .status(500);
        }
      }
      // Create the Sale
      const sale = await transaction.sale.create({
        data: {
          customerId,
          customerName,
          customerEmail,
          saleAmount,
          balanceAmount,
          paidAmount,
          paymentMethod,
          shopId,
          transactionCode,
          saleNumber: generateSaleNumber(),
          saleType,
        },
      });
      if (salesItems && salesItems.length > 0) {
        for (const item of salesItems) {
          // Update Product stock qty
          const updatedProduct = await transaction.product.update({
            where: { id: item.productId },
            data: {
              stockQty: {
                decrement: item.qty,
              },
            },
          });

          if (!updatedProduct) {
            return res
              .json({
                error: "Failed to Update Product Quantity",
                data: null,
              })
              .status(500);
          }

          // Create the Sale Item
          const saleItem = await transaction.saleItem.create({
            data: {
              saleId: sale.id,
              productId: item.productId,
              qty: item.qty,
              productPrice: item.productPrice,
              productName: item.productName,
              productImage: item.productImage,
            },
          });

          if (!saleItem) {
            return res
              .json({
                error: "Failed to Create Sale Item",
                data: null,
              })
              .status(500);
          }
        }
      }
      return sale.id;
    });

    const sale = await db.sale.findUnique({
      where: {
        id: saleId as string,
      },
      include: {
        salesItems: true,
      },
    });
    return res.json(sale).status(201);
  } catch (error) {
    console.log(error);
    return res
      .json({
        error: "Something went wrong",
        data: null,
      })
      .status(500);
  }
}
export async function getSales(req: Request, res: Response) {
  try {
    const sales = await db.sale.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        salesItems: true,
      },
    });
    return res.status(200).json({
      data: sales,
      error: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      data: null,
      error: "Something went wrong",
    });
  }
}

export async function createSaleItem(req: Request, res: Response) {
  // Get the data
  const { saleId, productId, qty, productPrice, productName, productImage } =
    req.body;

  try {
    // Update Product stock qty
    const updatedProduct = await db.product.update({
      where: { id: productId },
      data: {
        stockQty: {
          decrement: qty,
        },
      },
    });

    // Create the Sale Item
    const saleItem = await db.saleItem.create({
      data: {
        saleId,
        productId,
        qty,
        productPrice,
        productName,
        productImage,
      },
    });

    return res.json(saleItem).status(201);
  } catch (error) {
    console.log(error);
    return res
      .json({
        error: "Something went wrong",
        data: null,
      })
      .status(500);
  }
}
