import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    imageUrl: { type: String, required: true},
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stockQuantity: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ["Active", "Inactive", "Out of Stock"],
    },
    vendor: { type: String, required: true },
  },
  { timestamps: true }
);

const Product = models.Product || model("Product", ProductSchema);
export default Product;
