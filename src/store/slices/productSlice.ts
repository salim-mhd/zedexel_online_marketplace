import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { IProduct } from "@/interfaces";

interface ProductState {
  products: IProduct[];
  product: IProduct | null;
  loading: boolean;
  createUpdateLoaing: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  product: null,
  loading: false,
  createUpdateLoaing: false,
  error: null,
};

// Fetch all products
export const fetchProducts = createAsyncThunk<
  IProduct[],
  {
    category?: string[];
    status?: string[];
    search?: string;
    sort?: "latest" | "oldest";
  },
  { rejectValue: string }
>("product/fetchAll", async (filters, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams();

    if (filters.category) params.append("category", filters.category.join(","));
    if (filters.status) params.append("status", filters.status.join(","));
    if (filters.search) params.append("search", filters.search);
    if (filters.sort) params.append("sort", filters.sort);

    const res = await axios.get(
      `/api/productApi/products?${params.toString()}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return res.data.products as IProduct[];
  } catch (err: unknown) {
    let errorMessage = "Failed to fetch products";
    if (err instanceof AxiosError) {
      errorMessage = err.response?.data?.message || errorMessage;
    }
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

// Create product with FormData
export const createProduct = createAsyncThunk<
  IProduct,
  FormData,
  { rejectValue: string }
>("product/create", async (formData, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.post("/api/productApi/productCreate", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.product as IProduct;
  } catch (err: unknown) {
    let errorMessage = "Failed to create product";
    if (err instanceof AxiosError) {
      errorMessage = err.response?.data?.message || errorMessage;
    }
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

// Delete product
export const deleteProduct = createAsyncThunk<
  string, // Return type is the product ID (string)
  string, // Argument is the product ID
  { rejectValue: string }
>("product/delete", async (id, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`/api/productApi/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  } catch (err: unknown) {
    let errorMessage = "Failed to delete product";
    if (err instanceof AxiosError) {
      errorMessage = err.response?.data?.message || errorMessage;
    }
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

// Update product with FormData
export const updateProduct = createAsyncThunk<
  IProduct, // Return type is the updated product
  { id: string; formData: FormData }, // Argument includes ID and FormData
  { rejectValue: string }
>("product/update", async ({ id, formData }, thunkAPI) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.put(`/api/productApi/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return res.data.product as IProduct;
  } catch (err: unknown) {
    let errorMessage = "Failed to update product";
    if (err instanceof AxiosError) {
      errorMessage = err.response?.data?.message || errorMessage;
    }
    return thunkAPI.rejectWithValue(errorMessage);
  }
});

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products cases
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
      })
      // Create product cases
      .addCase(createProduct.pending, (state) => {
        state.createUpdateLoaing = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.createUpdateLoaing = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.createUpdateLoaing = false;
        state.error = action.payload || "Failed to create product";
      })
      // Delete product cases
      .addCase(deleteProduct.pending, (state) => {
        state.createUpdateLoaing = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.createUpdateLoaing = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.createUpdateLoaing = false;
        state.error = action.payload || "Failed to delete product";
      })
      // Update product cases
      .addCase(updateProduct.pending, (state) => {
        state.createUpdateLoaing = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.createUpdateLoaing = false;
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.createUpdateLoaing = false;
        state.error = action.payload || "Failed to update product";
      });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;