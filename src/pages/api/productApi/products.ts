import { IProduct } from "@/interfaces";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product";
import { SortOrder } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    await dbConnect();

    const { category, status, search, sort } = req.query;

    const filter: Partial<Record<keyof IProduct, unknown>> = {};

    if (category) {
      const categories = (category as string).split(",");
      if (!categories.includes("All")) filter.category = { $in: categories };
    }

    if (status) {
      const statuses = (status as string).split(",");
      if (!statuses.includes("All")) filter.status = { $in: statuses };
    }

    if (search) {
      filter.name = { $regex: search as string, $options: "i" };
    }

    // Determine sort order
    const sortOption: { [key: string]: SortOrder } =
      sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };

    const products = await Product.find(filter)
      .sort(sortOption)
      .lean<IProduct[]>();

    return res.status(200).json({ success: true, products });
  } catch (error: unknown) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error,
    });
  }
}
