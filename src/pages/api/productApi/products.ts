import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    await dbConnect();

    const { category, status, search, sort } = req.query;
    console.log('status',status);
    

    const filter: any = {};

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
    let sortOption: any = { createdAt: -1 }; // default: latest first
    if (sort === "oldest") sortOption = { createdAt: 1 }; // oldest first

    const products = await Product.find(filter).sort(sortOption).lean();

    return res.status(200).json({ success: true, products });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
}
