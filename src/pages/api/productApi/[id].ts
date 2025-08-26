import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const {
    method,
    query: { id },
  } = req;

  switch (method) {
    case "GET":
      try {
        const product = await Product.findById(id);
        if (!product) {
          return res
            .status(404)
            .json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, product });
      } catch (error) {
        res.status(400).json({ success: false, message: "Server Error" });
      }
      break;

    case "PUT":
      try {
        console.log("PUT request body:", req.body);

        const updateData = {
          ...req.body,
          price: Number(req.body.price),
          stockQuantity: Number(req.body.stockQuantity),
        };

        const product = await Product.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        });

        if (!product) {
          return res
            .status(404)
            .json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, product });
      } catch (error) {
        console.error("Update error:", error);
        res.status(400).json({ success: false, message: "Server Error" });
      }
      break;

    case "DELETE":
      try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
          return res
            .status(404)
            .json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, data: {} });
      } catch (error) {
        res.status(400).json({ success: false, message: "Server Error" });
      }
      break;

    default:
      res.status(400).json({ success: false, message: "Method not allowed" });
      break;
  }
}
