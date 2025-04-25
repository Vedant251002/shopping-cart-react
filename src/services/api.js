const API_URL = 'http://localhost:3000';

// Helper to safely parse JSON
const safeJsonParse = async (response) => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
  }
};

// User API
export const userApi = {
  getById: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`);
      if (!response.ok) {
        throw new Error('Could not fetch user');
      }
      return await safeJsonParse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  getByCredentials: async (name, password) => {
    try {
      const response = await fetch(`${API_URL}/users?name=${name}&password=${password}`);
      if (!response.ok) {
        throw new Error('Authentication failed');
      }
      return await safeJsonParse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  updateUser: async (userId, userData) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
      if (!response.ok) {
        throw new Error('Could not update user data');
      }
      return await safeJsonParse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

// Product API
export const productApi = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_URL}/products`);
      if (!response.ok) {
        throw new Error('Could not fetch products');
      }
      return await safeJsonParse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  getById: async (productId) => {
    try {
      const response = await fetch(`${API_URL}/products/${productId}`);
      if (!response.ok) {
        throw new Error('Could not fetch product');
      }
      return await safeJsonParse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  getByQuery: async (query) => {
    try {
      const response = await fetch(`${API_URL}/products?${query}`);
      if (!response.ok) {
        throw new Error('Could not fetch products with query');
      }
      return await safeJsonParse(response);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};

// Cart API functions
export const cartApi = {
  addToCart: async (userId, productId) => {
    try {
      // First get the user
      const user = await userApi.getById(userId);
      
      // Check if the user has cart_items field, if not create it
      if (!user.cart_items) {
        user.cart_items = [];
      }
      
      // Check if the product is already in the cart_items
      const existingCartItem = user.cart_items.find(item => item.productId === Number(productId));
      
      if (existingCartItem) {
        // If product already exists, increment quantity
        existingCartItem.quantity += 1;
      } else {
        // Otherwise add as a new item with quantity 1
        user.cart_items.push({ 
          productId: Number(productId), 
          quantity: 1 
        });
        
        // Keep saved_products in sync (backwards compatibility)
        if (!user.saved_products) {
          user.saved_products = [];
        }
        if (!user.saved_products.includes(Number(productId))) {
          user.saved_products.push(Number(productId));
        }
      }
      
      // Update the user
      return await userApi.updateUser(userId, user);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  removeFromCart: async (userId, productId) => {
    try {
      // First get the user
      const user = await userApi.getById(userId);
      
      // Remove product from cart_items
      if (user.cart_items) {
        user.cart_items = user.cart_items.filter(item => item.productId !== Number(productId));
      }
      
      // Keep saved_products in sync (backwards compatibility)
      if (user.saved_products) {
        user.saved_products = user.saved_products.filter(id => id !== Number(productId));
      }
      
      // Update the user
      return await userApi.updateUser(userId, user);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  updateCartItemQuantity: async (userId, productId, quantity) => {
    try {
      // First get the user
      const user = await userApi.getById(userId);
      
      // Ensure cart_items exists
      if (!user.cart_items) {
        user.cart_items = [];
      }
      
      // Find the item
      const existingCartItem = user.cart_items.find(item => item.productId === Number(productId));
      
      if (existingCartItem) {
        // Update quantity
        existingCartItem.quantity = quantity;
      } else {
        // If item doesn't exist, add it
        user.cart_items.push({ 
          productId: Number(productId), 
          quantity 
        });
        
        // Add to saved_products if not already there (backwards compatibility)
        if (!user.saved_products) {
          user.saved_products = [];
        }
        if (!user.saved_products.includes(Number(productId))) {
          user.saved_products.push(Number(productId));
        }
      }
      
      // Update the user
      return await userApi.updateUser(userId, user);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },
  
  getCartItems: async (userId) => {
    try {
      // Get user data
      const user = await userApi.getById(userId);
      
      // Get products in cart
      const cartItems = [];
      
      // First try to use cart_items (with quantities)
      if (user.cart_items && user.cart_items.length > 0) {
        for (const item of user.cart_items) {
          const product = await productApi.getById(item.productId);
          // Add quantity to the product object
          cartItems.push({
            ...product,
            quantity: item.quantity
          });
        }
      } 
      // Fallback to saved_products (legacy, no quantities)
      else if (user.saved_products && user.saved_products.length > 0) {
        for (const productId of user.saved_products) {
          const product = await productApi.getById(productId);
          // Default to quantity 1 for backwards compatibility
          cartItems.push({
            ...product,
            quantity: 1
          });
        }
        
        // Initialize cart_items from saved_products for future use
        user.cart_items = user.saved_products.map(id => ({
          productId: Number(id),
          quantity: 1
        }));
        await userApi.updateUser(userId, user);
      }
      
      return cartItems;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
}; 