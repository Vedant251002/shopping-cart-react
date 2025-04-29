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
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="p-8 relative">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden rounded-2xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <defs>
                <pattern id="confetti" width="40" height="40" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="2" fill="currentColor" opacity="0.5" />
                  <circle cx="30" cy="30" r="1" fill="currentColor" opacity="0.5" />
                  <circle cx="15" cy="25" r="3" fill="currentColor" opacity="0.5" />
                  <circle cx="35" cy="5" r="2" fill="currentColor" opacity="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#confetti)" />
            </svg>
          </div>
          
          <div className="relative">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-secondary-900 font-display">Order Confirmed!</h2>
              <button 
                onClick={onClose}
                className="text-secondary-500 hover:text-secondary-700 transition-colors p-2 rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex justify-center mb-8">
              <div className="rounded-full bg-success-100 p-4 animate-float shadow-success-100/50 shadow-lg">
                <svg className="h-12 w-12 text-success-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <p className="text-center text-lg text-secondary-700 mb-8 font-medium">
              Thank you for your purchase! Your order has been confirmed.
            </p>
            
            <div className="bg-gray-50 rounded-xl p-4 mb-6 shadow-inner">
              <h3 className="font-semibold text-secondary-900 mb-4 flex items-center">
                <svg className="h-5 w-5 mr-2 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Items Purchased:
              </h3>
              <ul className="space-y-3 mb-4">
                {items.map(item => {
                  const quantity = item.quantity || 1;
                  const itemTotal = item.price * quantity;
                  
                  return (
                    <li key={item.id} className="flex justify-between items-center p-2 hover:bg-white rounded-lg transition-colors">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-white rounded-lg overflow-hidden mr-3 flex-shrink-0 shadow-sm">
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
                          <span className="text-secondary-800 font-medium">{item.name}</span>
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
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-secondary-600">Subtotal</span>
                <span className="text-secondary-900 font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-secondary-600">Tax (5%)</span>
                <span className="text-secondary-900 font-medium">₹{tax.toFixed(2)}</span>
              </div>
              <div className="h-px bg-gray-200 my-2"></div>
              <div className="flex justify-between font-bold text-lg">
                <span className="text-secondary-900">Total</span>
                <span className="text-primary-600">₹{total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="outline"
                onClick={onClose}
                fullWidth
                className="py-3"
              >
                Continue Shopping
              </Button>
              <Button 
                variant="primary"
                onClick={onComplete}
                fullWidth
                className="py-3"
              >
                View Orders
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// CartItem component to display individual cart items
const CartItem = ({ product, onRemove, onUpdateQuantity, index }) => {
  const quantity = product.quantity || 1;
  const navigate = useNavigate();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleProductClick = () => {
    navigate(`/products/${product.id}`);
  };

  const handleRemove = () => {
    setIsRemoving(true);
    // Delay actual removal to allow animation to complete
    setTimeout(() => {
      onRemove(product.id);
    }, 300);
  };

  return (
    <div 
      className={`flex flex-col sm:flex-row py-6 border-b border-secondary-200 hover:bg-gray-50 transition-all duration-300 rounded-xl p-4 ${
        isRemoving ? 'opacity-0 transform translate-x-full' : 'animate-slide-up'
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div 
        className="flex-shrink-0 w-full sm:w-36 h-36 bg-gray-100 rounded-lg overflow-hidden mb-4 sm:mb-0 cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-300"
        onClick={handleProductClick}
      >
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
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
            <h3 className="text-lg font-bold text-secondary-900">
              <span 
                className="hover:text-primary-600 cursor-pointer transition-colors"
                onClick={handleProductClick}
              >
                {product.name}
              </span>
            </h3>
            <p className="mt-1 text-sm text-secondary-500 line-clamp-2">
              {product.description}
            </p>
            <div className="mt-1 flex items-center">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 shadow-sm">
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
              <span className="text-sm text-secondary-600 mr-2 font-medium">Quantity:</span>
              <div className="flex items-center">
                <button 
                  className="w-8 h-8 rounded-l-lg border border-secondary-300 flex items-center justify-center bg-secondary-50 text-secondary-600 hover:bg-secondary-100 transition-colors active:scale-95 transform"
                  onClick={() => {
                    if (quantity <= 1) {
                      handleRemove();
                    } else {
                      onUpdateQuantity(product.id, quantity - 1);
                    }
                  }}
                  aria-label="Decrease quantity"
                >
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <div className="w-10 h-8 border-t border-b border-secondary-300 flex items-center justify-center bg-white">
                  {quantity}
                </div>
                <button 
                  className="w-8 h-8 rounded-r-lg border border-secondary-300 flex items-center justify-center bg-secondary-50 text-secondary-600 hover:bg-secondary-100 transition-colors active:scale-95 transform"
                  onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0 flex flex-row sm:flex-col items-center sm:items-end justify-between">
            <div className="text-right">
              <p className="text-sm text-secondary-500">₹{product.price} × {quantity}</p>
              <p className="text-xl font-bold text-primary-600">₹{(product.price * quantity).toFixed(2)}</p>
            </div>
            <Button
              variant="danger"
              size="sm"
              className="ml-4 sm:ml-0 sm:mt-3 hover:scale-105 active:scale-95 transform transition-transform"
              onClick={handleRemove}
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
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(true);
  
  // Load cart items
  useEffect(() => {
    const loadCartItems = async () => {
      if (isAuthenticated) {
        if (items.length === 0) {
          dispatch(fetchCartItems());
          
          // Fallback to direct API call if Redux fails
          setTimeout(async () => {
            if (status === 'failed' || items.length === 0) {
              setLocalLoading(true);
              try {
                const userId = getUserId();
                const user = await userApi.getById(userId);
                if (user && user.cart) {
                  setLocalItems(user.cart);
                }
                setLocalLoading(false);
                setShowLoadingAnimation(false); // Hide loading when done
              } catch (err) {
                setLocalError(err.message);
                setLocalLoading(false);
                setShowLoadingAnimation(false); // Hide loading on error
              }
            } else {
              setShowLoadingAnimation(false); // Hide loading if items loaded from Redux
            }
          }, 1000);
        } else {
          setShowLoadingAnimation(false); // Hide loading if items are already available
        }
      } else {
        navigate('/login');
      }
    };
    
    loadCartItems();
    
    // Always hide loading animation after 3 seconds max to prevent infinite loading
    const timer = setTimeout(() => {
      setShowLoadingAnimation(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [dispatch, isAuthenticated, navigate, items.length, status]);
  
  const handleRemoveFromCart = async (productId) => {
    // Use only the thunk action, not the slice action
    dispatch(removeFromCart(productId));
  };
  
  const handleUpdateQuantity = async (productId, quantity) => {
    // Use only the thunk action, not the slice action
    dispatch(updateCartItemQuantity({ productId, quantity }));
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
  };
  
  const handleCompleteCheckout = () => {
    dispatch(cartActions.clearCart());
    setIsCheckoutModalOpen(false);
    navigate('/products');
  };

  // Determine which cart items to display
  const cartItems = items.length > 0 ? items : localItems;
  const isLoading = status === 'loading' || localLoading;
  const displayError = error || localError;
  
  // Calculate total
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const quantity = item.quantity || 1;
      return total + (item.price * quantity);
    }, 0);
  };
  
  const hasItems = cartItems && cartItems.length > 0;
  const cartTotal = hasItems ? calculateTotal() : 0;
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Shopping Cart" />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2 font-display">Your Shopping Cart</h1>
        <p className="text-secondary-500 mb-8">Manage your selected items before checkout</p>
        
        {showLoadingAnimation && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-20 h-20 relative mb-6">
              <div className="w-full h-full rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <p className="text-lg text-secondary-600 font-medium animate-pulse">Loading your cart...</p>
          </div>
        )}
        
        {displayError && !hasItems && (
          <div className="bg-white rounded-xl shadow-md p-12 flex flex-col justify-center items-center">
            <div className="p-6 rounded-full bg-red-50 mb-4">
              <svg className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-red-600 mb-2">Error Loading Cart</h3>
            <p className="text-secondary-600 mb-6 text-center max-w-md">
              {displayError}. Please try again or contact support if the problem persists.
            </p>
            <Button 
              variant="primary" 
              onClick={handleRetry}
              leftIcon={
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              }
            >
              Retry
            </Button>
          </div>
        )}
        
        {!isLoading && !displayError && !hasItems && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-2xl mx-auto animate-fade-in">
            <div className="bg-primary-50 rounded-lg p-8 mb-6 shadow-inner">
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="w-32 h-32 flex items-center justify-center rounded-full bg-white shadow-md animate-float">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="absolute top-6 right-0">
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-accent-500"></span>
                    </span>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-secondary-900 mb-3 font-display">Your Cart is Empty</h2>
              <p className="text-secondary-600 mb-6 max-w-md mx-auto">Looks like you haven't added any products to your cart yet. Let's find something amazing for you!</p>
            </div>
            <Button 
              variant="primary" 
              onClick={handleBackToProducts}
              className="mx-auto px-8 py-3 text-lg hover:scale-105 active:scale-95 transform transition-transform"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Browse Products
            </Button>
          </div>
        )}
        
        {hasItems && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6 border-b border-secondary-200">
                  <h2 className="text-xl font-bold text-secondary-900">Cart Items ({cartItems.length})</h2>
                </div>
                <div className="p-6">
                  {cartItems.map((item, index) => (
                    <CartItem 
                      key={item.id}
                      product={item}
                      onRemove={handleRemoveFromCart}
                      onUpdateQuantity={handleUpdateQuantity}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md sticky top-8">
                <div className="p-6 border-b border-secondary-200">
                  <h2 className="text-xl font-bold text-secondary-900">Order Summary</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Subtotal</span>
                      <span className="text-secondary-900 font-medium">₹{(cartTotal / 1.05).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Tax (5%)</span>
                      <span className="text-secondary-900 font-medium">₹{(cartTotal - cartTotal / 1.05).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="h-px bg-gray-200 my-3"></div>
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-secondary-900">Total</span>
                      <span className="text-lg font-bold text-primary-600">₹{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="primary"
                    onClick={handleCheckout}
                    fullWidth
                    className="py-3"
                    leftIcon={
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    }
                  >
                    Checkout
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={handleBackToProducts}
                    fullWidth
                    className="mt-4"
                    leftIcon={
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                    }
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Checkout modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        items={cartItems}
        total={cartTotal}
        onClose={handleCloseCheckoutModal}
        onComplete={handleCompleteCheckout}
      />
    </div>
  );
};

export default CartPage; 