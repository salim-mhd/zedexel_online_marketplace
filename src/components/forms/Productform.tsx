"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import CommonTextField from "../common/formHelpers/CommonTextField";
import CommonButton from "../common/buttons/CommonButton";
import CommonDropdown from "../common/formHelpers/CommonDropdown";
import { createProduct } from "@/store/slices/productSlice";
import { Person, AttachMoney, Inventory, Store } from "@mui/icons-material";
import { categoryies, statuses } from "@/utils/const";

// Define validation schema using Zod
const productSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Product name must be less than 100 characters"),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(
      /^\d+(\.\d{1,2})?$/,
      "Price must be a valid number with up to 2 decimal places"
    ),
  stockQuantity: z
    .string()
    .min(1, "Stock quantity is required")
    .regex(/^\d+$/, "Stock quantity must be a positive integer"),
  category: z.string().min(1, "Category is required"),
  status: z.string().min(1, "Status is required"),
  vendor: z
    .string()
    .min(1, "Vendor is required")
    .max(100, "Vendor name must be less than 100 characters"),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function CreateProductForm() {
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      price: "",
      stockQuantity: "",
      category: "",
      status: "",
      vendor: "",
    },
  });

  const category = watch("category");
  const status = watch("status");

  const onSubmit = async (data: ProductFormData) => {
    if (!image) {
      toast.error("Please select an image.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("stockQuantity", data.stockQuantity);
      formData.append("category", data.category);
      formData.append("status", data.status);
      formData.append("vendor", data.vendor);
      formData.append("image", image);

      const product = await dispatch(createProduct(formData)).unwrap();

      if (product?._id) {
        toast.success("Product created successfully!", { autoClose: 1500 });
        setTimeout(() => router.push("/"), 1000);
      } else {
        toast.error("Failed to create product");
      }
    } catch (err: unknown) {
      console.error("Unexpected error:", err);
      toast.error("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <ToastContainer />
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create New Product
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <CommonTextField
            label="Product Name"
            {...register("name")}
            error={errors.name?.message}
            required
            icon={<Person fontSize="small" />}
          />
          <CommonTextField
            label="Price"
            type="number"
            step="0.01"
            {...register("price")}
            error={errors.price?.message}
            required
            icon={<AttachMoney fontSize="small" />}
          />
          <CommonTextField
            label="Stock Quantity"
            type="number"
            {...register("stockQuantity")}
            error={errors.stockQuantity?.message}
            required
            icon={<Inventory fontSize="small" />}
          />
          <CommonDropdown
            label="Category"
            options={categoryies}
            onSelect={(value) => setValue("category", value)}
            value={category}
            error={errors.category?.message}
          />
          <CommonDropdown
            label="Status"
            options={statuses}
            onSelect={(value) => setValue("status", value)}
            value={status}
            error={errors.status?.message}
            height=""
          />
          <CommonTextField
            label="Vendor"
            {...register("vendor")}
            error={errors.vendor?.message}
            required
            icon={<Store fontSize="small" />}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="w-full border rounded-md p-2"
            required
          />
          <CommonButton
            label="Create Product"
            type="submit"
            loading={loading}
            width="100%"
          />
        </form>
      </div>
    </div>
  );
}
