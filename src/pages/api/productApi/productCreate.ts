import { NextApiRequest, NextApiResponse } from "next";
import formidable, { File, Fields, Files, Part } from "formidable";
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product";
import { UploadApiResponse } from "cloudinary";
import { streamUpload } from "@/lib/cloudinary.config";

// Disable default body parser
export const config = { api: { bodyParser: false } };

// Typed promise wrapper for formidable
const parseForm = (
  req: NextApiRequest
): Promise<{ fields: Fields; files: Files }> => {
  const form = formidable({
    maxFileSize: 5 * 1024 * 1024,
    filter: ({ mimetype }: Part) =>
      mimetype !== null && ["image/jpeg", "image/png"].includes(mimetype),
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
};

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

  try {
    const { fields, files } = await parseForm(req);

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

    const uploadResult: UploadApiResponse = await streamUpload(imageFile);
    const imageUrl = uploadResult.secure_url;

    if (!imageUrl) {
      return res
        .status(500)
        .json({
          success: false,
          message: "Failed to get image URL from Cloudinary",
        });
    }

    const newProduct = new Product({
      name: name.trim(),
      price: Number(price),
      stockQuantity: Number(stockQuantity),
      category: category.trim(),
      status,
      vendor: vendor.trim(),
      imageUrl,
    });

    const savedProduct = await newProduct.save();

    return res
      .status(201)
      .json({ success: true, product: savedProduct.toObject() });
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
}
