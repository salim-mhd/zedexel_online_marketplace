import { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm, File, Fields, Files, Part } from "formidable";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = { api: { bodyParser: false } };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    return res
      .status(500)
      .json({ success: false, message: "Cloudinary configuration is missing" });
  }

  await dbConnect();

  const form = new IncomingForm({
    maxFileSize: 5 * 1024 * 1024,
    filter: ({ mimetype }: Part): boolean =>
      mimetype !== null && ["image/jpeg", "image/png"].includes(mimetype),
  });

  form.parse(req, async (err: Error | null, fields: Fields, files: Files) => {
    if (err) {
      console.error("Form parsing error:", err);
      return res
        .status(500)
        .json({
          success: false,
          message: `Failed to parse form data: ${err.message}`,
        });
    }

    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
    const price = Array.isArray(fields.price) ? fields.price[0] : fields.price;
    const stockQuantity = Array.isArray(fields.stockQuantity)
      ? fields.stockQuantity[0]
      : fields.stockQuantity;
    const category = Array.isArray(fields.category)
      ? fields.category[0]
      : fields.category;
    const status = Array.isArray(fields.status)
      ? fields.status[0]
      : fields.status;
    const vendor = Array.isArray(fields.vendor)
      ? fields.vendor[0]
      : fields.vendor;
    const imageFile = Array.isArray(files.image)
      ? (files.image[0] as File)
      : (files.image as File | undefined);

    if (
      !name ||
      !price ||
      !stockQuantity ||
      !category ||
      !status ||
      !vendor ||
      !imageFile
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message: "All fields including image are required",
        });
    }

    if (isNaN(Number(price)) || Number(price) < 0) {
      return res.status(400).json({ success: false, message: "Invalid price" });
    }

    if (isNaN(Number(stockQuantity)) || Number(stockQuantity) < 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid stock quantity" });
    }

    if (!["Active", "Inactive", "Out of Stock"].includes(status)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Status must be one of: Active, Inactive, Out of Stock",
        });
    }

    try {
      const uploadResult = await cloudinary.uploader.upload(
        imageFile.filepath,
        { folder: "products", resource_type: "image" }
      );
      const imageUrl = uploadResult.secure_url || uploadResult.url;
      if (!imageUrl) {
        return res
          .status(500)
          .json({
            success: false,
            message: "Failed to get image URL from Cloudinary",
          });
      }

      const newProduct = new Product({
        name: String(name).trim(),
        price: Number(price),
        stockQuantity: Number(stockQuantity),
        category: String(category).trim(),
        status,
        vendor: String(vendor).trim(),
        imageUrl,
      });

      await newProduct.validate();
      const savedProduct = await newProduct.save();

      res.status(201).json({ success: true, product: savedProduct.toObject() });
    } catch (error: unknown) {
      console.error("Error creating product:", error);
      if (error instanceof Error) {
        return res
          .status(500)
          .json({
            success: false,
            message: `Failed to create product: ${error.message}`,
          });
      }
      return res
        .status(500)
        .json({ success: false, message: "Unknown error occurred" });
    }
  });
}
