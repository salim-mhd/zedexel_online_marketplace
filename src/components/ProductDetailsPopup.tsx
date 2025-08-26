import React, { useState } from "react";
import CommonButton from "@/components/common/buttons/CommonButton";
import { useAppDispatch } from "@/redux/hooks";
import { deleteProduct, updateProduct } from "@/store/slices/productSlice";
import { IProduct } from "@/interfaces";
import CommonDropdown from "@/components/common/formHelpers/CommonDropdown";
import CommonTextField from "./common/formHelpers/CommonTextField";

interface ProductDetailsPopupProps {
  product: IProduct;
  onClose: () => void;
}

const ProductDetailsPopup: React.FC<ProductDetailsPopupProps> = ({
  product,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<IProduct>(product);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categories = ["Category1", "Category2", "Category3"]; // Replace with your actual categories
  const statuses = ["Active", "Inactive", "Out of Stock"];

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await dispatch(deleteProduct(product?._id as string)).unwrap();
        onClose();
      } catch (err) {
        setError("Failed to delete product");
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("stockQuantity", formData.stockQuantity.toString());
      formDataToSend.append("category", formData.category);
      formDataToSend.append("status", formData.status);
      formDataToSend.append("vendor", formData.vendor);
      if (file) {
        formDataToSend.append("image", file);
      }

      if (!product._id) return;
      await dispatch(
        updateProduct({ id: product._id, formData: formDataToSend })
      ).unwrap();
      setIsEditing(false);
      onClose();
    } catch (err) {
      setError("Failed to update product");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "price" || name === "stockQuantity" ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Edit Product" : "Product Details"}
        </h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="space-y-4">
          <div>
            <img
              src={formData.imageUrl}
              alt={formData.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            {isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mb-4"
              />
            )}
          </div>

          {isEditing ? (
            <>
              <CommonTextField
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter product name"
              />
              <CommonTextField
                label="Price"
                name="price"
                type="number"
                value={formData.price.toString()}
                onChange={handleInputChange}
                placeholder="Enter price"
              />
              <CommonTextField
                label="Stock Quantity"
                name="stockQuantity"
                type="number"
                value={formData.stockQuantity.toString()}
                onChange={handleInputChange}
                placeholder="Enter stock quantity"
              />
              <CommonDropdown
                label="Category"
                options={categories}
                value={formData.category}
                onSelect={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              />
              <CommonDropdown
                label="Status"
                options={statuses}
                value={formData.status}
                onSelect={(value) =>
                  setFormData((prev) => ({ ...prev, status: value as string }))
                }
              />
              <CommonTextField
                label="Vendor"
                name="vendor"
                value={formData.vendor}
                onChange={handleInputChange}
                placeholder="Enter vendor"
              />
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Name:</p>
                <p>{formData.name}</p>
              </div>
              <div>
                <p className="font-semibold">Price:</p>
                <p>${formData.price}</p>
              </div>
              <div>
                <p className="font-semibold">Stock Quantity:</p>
                <p>{formData.stockQuantity}</p>
              </div>
              <div>
                <p className="font-semibold">Category:</p>
                <p>{formData.category}</p>
              </div>
              <div>
                <p className="font-semibold">Status:</p>
                <p>{formData.status}</p>
              </div>
              <div>
                <p className="font-semibold">Vendor:</p>
                <p>{formData.vendor}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          {!isEditing ? (
            <>
              <CommonButton
                label="Edit"
                onClick={handleEdit}
                className="button_filled bg-blue-500 text-white"
              />
              <CommonButton
                label="Delete"
                onClick={handleDelete}
                className="button_filled bg-red-500 text-white"
              />
            </>
          ) : (
            <CommonButton
              label="Save"
              onClick={handleSave}
              className="button_filled bg-green-500 text-white"
            />
          )}
          <CommonButton
            label="Close"
            onClick={onClose}
            className="button_no_fill"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPopup;
