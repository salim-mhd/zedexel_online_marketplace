import { IProduct } from "@/interfaces";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product";
import { FilterQuery, SortOrder } from "mongoose";
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

    const filter: FilterQuery<IProduct> = {};

    if (typeof category === "string" && category !== "") {
      const categories = category.split(",");
      if (categories.length > 0 && !categories.includes("All")) {
        filter.category = { $in: categories };
      }
    }

    if (typeof status === "string" && status !== "") {
      const statuses = status.split(",");
      if (statuses.length > 0 && !statuses.includes("All")) {
        filter.status = { $in: statuses };
      }
    }

    if (typeof search === "string" && search !== "") {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.name = { $regex: escapedSearch, $options: "i" };
    }

    const validSorts = ["oldest", "newest"];
    const sortOption: { [key: string]: SortOrder } =
      typeof sort === "string" && sort === "oldest"
        ? { createdAt: 1 }
        : { createdAt: -1 };

    const products = await Product.find(filter)
      .sort(sortOption)
      .lean<IProduct[]>();

    return res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (error: unknown) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
