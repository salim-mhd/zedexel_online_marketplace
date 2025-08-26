import formidable, { IncomingForm, Part } from "formidable";
import { v2 as cloudinary } from "cloudinary";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product";
import { NextApiRequest, NextApiResponse } from "next";

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
  console.log("MongoDB connected");

  const form = new IncomingForm({
    maxFileSize: 5 * 1024 * 1024, // 5MB limit
    filter: ({ mimetype }: Part): boolean => {
      return (
        mimetype !== null && ["image/jpeg", "image/png"].includes(mimetype)
      );
    },
  });

  form.parse(req, async (err, fields, files) => {
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
    const imageFile =
      Array.isArray(files.image) && files.image.length > 0
        ? files.image[0]
        : null;

    if (
      !name ||
      !price ||
      !stockQuantity ||
      !category ||
      !status ||
      !vendor ||
      !imageFile
    ) {
      console.error("Missing fields:", {
        name,
        price,
        stockQuantity,
        category,
        status,
        vendor,
        imageFile,
      });
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
      console.error("Invalid status:", status);
      return res.status(400).json({
        success: false,
        message: "Status must be one of: Active, Inactive, Out of Stock",
      });
    }

    try {
      console.log("Uploading image to Cloudinary:", imageFile.filepath);
      const uploadResult = await cloudinary.uploader.upload(
        imageFile.filepath,
        {
          folder: "products",
          resource_type: "image",
        }
      );
      console.log("Cloudinary upload result:", uploadResult);

      const imageUrl = uploadResult.secure_url || uploadResult.url;
      if (!imageUrl) {
        console.error(
          "Cloudinary upload missing secure_url or url:",
          uploadResult
        );
        return res
          .status(500)
          .json({
            success: false,
            message: "Failed to get image URL from Cloudinary",
          });
      }

      console.log("Image URL to be saved:", imageUrl);

      const newProduct = new Product({
        name: name.trim(),
        price: Number(price),
        stockQuantity: Number(stockQuantity),
        category: category.trim(),
        status,
        vendor: vendor.trim(),
        imageUrl,
      });

      console.log("Product object before save:", newProduct.toObject());
      await newProduct.validate(); // Explicitly validate before saving
      console.log("Product validated successfully");
      const savedProduct = await newProduct.save();
      console.log(
        "Product saved successfully:",
        savedProduct._id,
        "Saved document:",
        savedProduct.toObject()
      );

      res.status(201).json({ success: true, product: savedProduct.toObject() });
    } catch (error: any) {
      console.error("Error creating product:", error);
      if (error.name === "ValidationError") {
        const validationErrors = Object.values(error.errors || {})
          .map((err: any) => err.message)
          .join(", ");
        return res
          .status(400)
          .json({
            success: false,
            message: `Validation error: ${validationErrors}`,
          });
      }
      return res
        .status(500)
        .json({
          success: false,
          message: `Failed to create product: ${error.message}`,
        });
    }
  });
}
