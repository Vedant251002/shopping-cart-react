import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../layout/Header';
import Button from '../layout/Button';
import { fetchCartItems, removeFromCart, cartActions, updateCartItemQuantity } from '../../store/slices/cartSlice';
import { cartApi } from '../../services/api';
import { getUserId } from '../../utils/auth';
import { userApi } from '../../services/api';

// CheckoutModal component to display purchased items and thank you message
const CheckoutModal = ({ isOpen, items, total, onClose, onComplete }) => {
  if (!isOpen) return null;
  
  // Calculate subtotal
  const subtotal = total / 1.05;
  const tax = total - subtotal;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-secondary-900">Order Confirmed!</h2>
            <button 
              onClick={onClose}
              className="text-secondary-500 hover:text-secondary-700 transition-colors"
              aria-label="Close"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-green-100 p-3 animate-bounce">
              <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <p className="text-center text-lg text-secondary-700 mb-6">
            Thank you for your purchase!
          </p>
          
          <div className="border-t border-b border-secondary-200 py-4 mb-4">
            <h3 className="font-semibold text-secondary-900 mb-3">Items Purchased:</h3>
            <ul className="space-y-3">
              {items.map(item => {
                const quantity = item.quantity || 1;
                const itemTotal = item.price * quantity;
                
                return (
                  <li key={item.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-secondary-100 rounded overflow-hidden mr-3 flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-secondary-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-secondary-800">{item.name}</span>
                        {quantity > 1 && (
                          <span className="text-xs text-secondary-500 block">
                            ₹{item.price} × {quantity}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-medium text-secondary-900">₹{itemTotal.toFixed(2)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          
          <div className="flex justify-between mb-2">
            <span className="text-secondary-600">Subtotal</span>
            <span className="text-secondary-900">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-secondary-600">Tax (5%)</span>
            <span className="text-secondary-900">₹{tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mb-6">
            <span className="text-secondary-900">Total</span>
            <span className="text-secondary-900">₹{total.toFixed(2)}</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="secondary"
              onClick={onClose}
              fullWidth
            >
              Continue Shopping
            </Button>
            <Button 
              variant="primary"
              onClick={onComplete}
              fullWidth
            >
              Complete Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartItem = ({ product, onRemove, onUpdateQuantity }) => {
  const quantity = product.quantity || 1;
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="flex flex-col sm:flex-row py-6 border-b border-secondary-200 animate-fade-in">
      <div 
        className="flex-shrink-0 w-full sm:w-32 h-32 bg-secondary-100 rounded-md overflow-hidden mb-4 sm:mb-0 cursor-pointer"
        onClick={handleProductClick}
      >
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-secondary-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        )}
      </div>
      
      <div className="flex-1 sm:ml-6">
        <div className="flex flex-col sm:flex-row justify-between">
          <div>
            <h3 className="text-lg font-medium text-secondary-900">
              <span 
                className="hover:text-primary-600 cursor-pointer"
                onClick={handleProductClick}
              >
                {product.name}
              </span>
            </h3>
            <p className="mt-1 text-sm text-secondary-500 line-clamp-2">
              {product.description}
            </p>
            <div className="mt-1 flex items-center">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                {product.category}
              </span>
              {product.rating && (
                <div className="ml-2 flex items-center">
                  <svg className="w-4 h-4 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="ml-1 text-sm text-secondary-500">{product.rating}</span>
                </div>
              )}
            </div>
            
            {/* Quantity Controls */}
            <div className="mt-3 flex items-center">
              <span className="text-sm text-secondary-600 mr-2">Quantity:</span>
              <div className="flex items-center border border-secondary-300 rounded-md">
                <button 
                  className="px-2 py-1 border-r border-secondary-300 hover:bg-secondary-100 transition-colors"
                  onClick={() => {
                    if (quantity <= 1) {
                      onRemove(product.id);
                    } else {
                      onUpdateQuantity(product.id, quantity - 1);
                    }
                  }}
                  aria-label="Decrease quantity"
                >
                  <svg className="h-4 w-4 text-secondary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <div className="px-3 py-1 text-center min-w-[2.5rem]">
                  {quantity}
                </div>
                <button 
                  className="px-2 py-1 border-l border-secondary-300 hover:bg-secondary-100 transition-colors"
                  onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <svg className="h-4 w-4 text-secondary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0 flex flex-row sm:flex-col items-center sm:items-end justify-between">
            <div className="text-right">
              <p className="text-lg font-medium text-secondary-900">₹{product.price} × {quantity}</p>
              <p className="text-lg font-bold text-primary-600">₹{(product.price * quantity).toFixed(2)}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="ml-4 sm:ml-0 sm:mt-2"
              onClick={() => onRemove(product.id)}
              leftIcon={
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              }
            >
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status, error } = useSelector(state => state.cart);
  const { isAuthenticated } = useSelector(state => state.auth);
  const [localItems, setLocalItems] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  
  // Load cart items
  useEffect(() => {
    const loadCartItems = async () => {
      if (isAuthenticated) {
        try {
          // Try Redux first
          dispatch(fetchCartItems());
          
          // If it fails, try direct API call
          setTimeout(async () => {
            if (status === 'failed' || items.length === 0) {
              setLocalLoading(true);
              try {
                const userId = getUserId();
                if (userId && userId !== 'temp') {
                  const cartItems = await cartApi.getCartItems(userId);
                  setLocalItems(cartItems);
                }
                setLocalLoading(false);
              } catch (err) {
                setLocalError(err.message);
                setLocalLoading(false);
              }
            }
          }, 1000);
        } catch (error) {
          console.error("Error loading cart items:", error);
        }
      }
    };
    
    loadCartItems();
  }, [dispatch, isAuthenticated]);
  
  const handleRemoveFromCart = async (productId) => {
    try {
      await dispatch(removeFromCart(productId)).unwrap();
    } catch (err) {
      setLocalError("Failed to remove item. Please try again.");
      console.error("Error removing item:", err);
    }
  };
  
  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      await dispatch(updateCartItemQuantity({ productId, quantity })).unwrap();
    } catch (err) {
      setLocalError("Failed to update quantity. Please try again.");
      console.error("Error updating quantity:", err);
    }
  };
  
  const handleBackToProducts = () => {
    navigate('/products');
  };
  
  const handleRetry = () => {
    setLocalError(null);
    dispatch(fetchCartItems());
  };
  
  const handleCheckout = () => {
    setIsCheckoutModalOpen(true);
  };
  
  const handleCloseCheckoutModal = () => {
    setIsCheckoutModalOpen(false);
    // Just close the modal, don't clear cart
  };
  
  const handleCompleteCheckout = () => {
    setIsCheckoutModalOpen(false);
    
    // Clear the cart and navigate to products page
    dispatch(cartActions.clearCart());
    
    // Also clear the user's saved_products in the backend
    const userId = getUserId();
    if (userId && userId !== 'temp') {
      userApi.getById(userId)
        .then(user => {
          user.saved_products = [];
          user.cart_items = [];
          return userApi.updateUser(userId, user);
        })
        .catch(error => {
          console.error('Error clearing cart:', error);
        });
    }
    
    // Redirect after a short delay to allow the animation to complete
    setTimeout(() => {
      navigate('/products');
    }, 300);
  };
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Header title="Shopping Cart" />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-8 text-center">
              <svg className="mx-auto h-16 w-16 text-secondary-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h2 className="text-2xl font-bold text-secondary-900 mb-2">Login Required</h2>
              <p className="text-secondary-600 mb-6">Please login to view your cart and checkout</p>
              <Button 
                variant="primary"
                onClick={() => navigate('/login')}
                fullWidth
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const isLoading = status === 'loading' || localLoading;
  const displayError = error || localError;
  const displayItems = items.length > 0 ? items : localItems;
  
  // Calculate totals, taking quantities into account
  const totalItems = displayItems.reduce((count, item) => count + (item.quantity || 1), 0);
  const subtotal = displayItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  const tax = subtotal * 0.05;
  const totalWithTax = subtotal + tax;
  
  return (
    <div className="min-h-screen bg-secondary-50">
      <Header title="Shopping Cart" />
      
      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={isCheckoutModalOpen}
        items={displayItems}
        total={totalWithTax}
        onClose={handleCloseCheckoutModal}
        onComplete={handleCompleteCheckout}
      />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-8">Your Shopping Cart</h1>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-secondary-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-secondary-900">
                    Cart Items ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToProducts}
                    leftIcon={
                      <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                    }
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
              
              {isLoading && displayItems.length === 0 && (
                <div className="flex justify-center items-center py-16">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-primary-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-4 text-lg text-secondary-600">Loading cart items...</p>
                  </div>
                </div>
              )}
              
              {displayError && displayItems.length === 0 && (
                <div className="flex flex-col justify-center items-center py-16">
                  <svg className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <p className="text-xl text-red-600 mb-4">Error: {displayError}</p>
                  <Button variant="primary" onClick={handleRetry}>
                    Retry
                  </Button>
                </div>
              )}
              
              {!isLoading && !displayError && displayItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <svg className="h-20 w-20 text-secondary-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <p className="text-2xl text-secondary-600 mb-6">Your cart is empty</p>
                  <Button variant="primary" onClick={handleBackToProducts}>
                    Browse Products
                  </Button>
                </div>
              )}
              
              {displayItems.length > 0 && (
                <div className="px-6">
                  {displayItems.map((product, index) => (
                    <CartItem 
                      key={product.id} 
                      product={product}
                      onRemove={handleRemoveFromCart}
                      onUpdateQuantity={handleUpdateQuantity}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {displayItems.length > 0 && (
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white shadow-sm rounded-lg overflow-hidden sticky top-4">
                <div className="px-6 py-4 border-b border-secondary-200">
                  <h2 className="text-lg font-medium text-secondary-900">Order Summary</h2>
                </div>
                <div className="px-6 py-4">
                  <div className="flex justify-between py-2">
                    <p className="text-secondary-600">Subtotal</p>
                    <p className="text-secondary-900 font-medium">₹{subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between py-2">
                    <p className="text-secondary-600">Shipping</p>
                    <p className="text-secondary-900 font-medium">Free</p>
                  </div>
                  <div className="flex justify-between py-2">
                    <p className="text-secondary-600">Tax</p>
                    <p className="text-secondary-900 font-medium">₹{tax.toFixed(2)}</p>
                  </div>
                  <div className="border-t border-secondary-200 mt-4 pt-4">
                    <div className="flex justify-between py-2">
                      <p className="text-lg font-bold text-secondary-900">Total</p>
                      <p className="text-lg font-bold text-secondary-900">₹{totalWithTax.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Button 
                      variant="primary"
                      fullWidth
                      size="lg"
                      onClick={handleCheckout}
                      leftIcon={
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      }
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage; 