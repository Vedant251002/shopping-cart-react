import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productApi } from "../../services/api";

// Async thunks for product actions
export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await productApi.getAll();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (productId, { rejectWithValue }) => {
    try {
      return await productApi.getById(productId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  products: [],
  selectedProduct: null,
  checkedCategory: [],
  sortByOptions: '',
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProducts: (state, action) => {
      state.products = action.payload;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    addCheckedCategory: (state, action) => {
      state.checkedCategory.push(action.payload);
    },
    removeCheckedCategory: (state, action) => {
      state.checkedCategory = state.checkedCategory.filter(cat => cat !== action.payload);
    },
    addSelectedFilter: (state, action) => {
      state.sortByOptions = action.payload;
    },
    clearFilters: (state) => {
      state.checkedCategory = [];
      state.sortByOptions = '';
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Handle fetchProductById
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const productActions = productSlice.actions;
export default productSlice; 