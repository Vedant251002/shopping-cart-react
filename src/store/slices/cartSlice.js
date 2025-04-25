import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartApi } from "../../services/api";
import { getUserId } from "../../utils/auth";

// Async thunks for cart actions
export const fetchCartItems = createAsyncThunk(
  'cart/fetchItems',
  async (_, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      if (!userId || userId === 'temp') {
        return [];
      }
      return await cartApi.getCartItems(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addItem',
  async (productId, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      if (!userId || userId === 'temp') {
        return null;
      }
      await cartApi.addToCart(userId, productId);
      return await cartApi.getCartItems(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeItem',
  async (productId, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      if (!userId || userId === 'temp') {
        return null;
      }
      await cartApi.removeFromCart(userId, productId);
      return await cartApi.getCartItems(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItemQuantity = createAsyncThunk(
  'cart/updateItemQuantity',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const userId = getUserId();
      if (!userId || userId === 'temp') {
        return null;
      }
      await cartApi.updateCartItemQuantity(userId, productId, quantity);
      return await cartApi.getCartItems(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchCartItems
      .addCase(fetchCartItems.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCartItems.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Handle addToCart
      .addCase(addToCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Handle removeFromCart
      .addCase(removeFromCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Handle updateCartItemQuantity
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const cartActions = cartSlice.actions;
export default cartSlice; 