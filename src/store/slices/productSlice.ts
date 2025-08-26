import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../store";
import { Product } from "@/interfaces";

interface ProductState {
  products: Product[];
  product: Product | null;
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
  Product[],
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

    return res.data.products as Product[];
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Failed to fetch products"
    );
  }
});

// Create product with FormData
export const createProduct = createAsyncThunk<
  Product,
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
    return res.data.product as Product;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || "Failed to create product"
    );
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
      });
  },
});

export const { clearError } = productSlice.actions;
export default productSlice.reducer;
