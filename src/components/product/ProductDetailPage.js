import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../layout/Header';
import Button from '../layout/Button';
import { fetchProductById } from '../../store/slices/productSlice';
import { addToCart, updateCartItemQuantity, removeFromCart } from '../../store/slices/cartSlice';
import { productApi } from '../../services/api';
import { isAuthenticated, isGuest } from '../../utils/auth';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selectedProduct, status, error } = useSelector(state => state.products);
  const cartItems = useSelector(state => state.cart.items);
  const [isInCart, setIsInCart] = useState(false);
  const [productQuantity, setProductQuantity] = useState(1);
  const [localProduct, setLocalProduct] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  // Check if product is in cart
  useEffect(() => {
    const cartItem = cartItems.find(item => item.id === id);
    if (cartItem) {
      setIsInCart(true);
      setProductQuantity(cartItem.quantity || 1);
    } else {
      setIsInCart(false);
      setProductQuantity(1);
    }
  }, [cartItems, id]);
  
  // Fetch product details with fallback to direct API call
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        dispatch(fetchProductById(id));
        
        // If we don't have a product after a short delay, try direct API call
        setTimeout(async () => {
          if (status === 'failed' || !selectedProduct) {
            setLocalLoading(true);
            try {
              const product = await productApi.getById(id);
              setLocalProduct(product);
              setLocalLoading(false);
            } catch (err) {
              setLocalError(err.message);
              setLocalLoading(false);
            }
          }
        }, 1000);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    
    fetchProduct();
  }, [dispatch, id]);
  
  const handleAddToCart = () => {
    if (isGuest()) {
      navigate('/login');
      return;
    }
    
    dispatch(addToCart(id));
  };
  
  const handleUpdateQuantity = (quantity) => {
    if (isGuest()) {
      navigate('/login');
      return;
    }
    
    dispatch(updateCartItemQuantity({ productId: id, quantity }));
  };
  
  const handleRemoveFromCart = () => {
    if (isGuest()) {
      navigate('/login');
      return;
    }
    
    dispatch(removeFromCart(id));
  };
  
  const handleGoBack = () => {
    navigate('/products');
  };

  // Helper function to render star rating
  const renderStarRating = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <svg key={`full-${i}`} className="w-6 h-6 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        {hasHalfStar && (
          <svg className="w-6 h-6 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
            <defs>
              <linearGradient id="halfStarGradient">
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="#D1D5DB" />
              </linearGradient>
            </defs>
            <path fill="url(#halfStarGradient)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        )}
        
        {[...Array(emptyStars)].map((_, i) => (
          <svg key={`empty-${i}`} className="w-6 h-6 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        <span className="ml-2.5 text-secondary-600 font-medium">({rating} of 5)</span>
      </div>
    );
  };

  const productToDisplay = selectedProduct || localProduct;
  const isLoading = status === 'loading' || localLoading;
  const displayError = error || localError;

  if (isLoading && !productToDisplay) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Product Details" />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-md p-12 flex justify-center items-center min-h-[500px]">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                <div className="absolute inset-3 rounded-full border-4 border-t-transparent border-r-primary-300 border-b-transparent border-l-transparent animate-spin" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
              </div>
              <p className="mt-6 text-xl font-medium text-secondary-600">Loading product details...</p>
              <p className="mt-2 text-secondary-400">This might take a moment</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (displayError && !productToDisplay) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Product Details" />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-md p-12 flex flex-col justify-center items-center min-h-[500px]">
            <div className="p-6 rounded-full bg-red-50 mb-6">
              <svg className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-red-600 mb-2">Product Not Found</h3>
            <p className="text-secondary-600 mb-6 text-center max-w-md">
              {displayError}. Please try again or browse our other products.
            </p>
            <Button 
              variant="primary" 
              onClick={handleGoBack}
              leftIcon={
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              }
            >
              Back to Products
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Product Details" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Navigation breadcrumbs */}
        <nav className="mb-8">
          <ol className="flex text-sm">
            <li className="flex items-center">
              <button 
                onClick={() => navigate('/')}
                className="text-secondary-600 hover:text-primary-600 transition-colors"
              >
                Home
              </button>
              <svg className="h-4 w-4 mx-2 text-secondary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="flex items-center">
              <button 
                onClick={() => navigate('/products')}
                className="text-secondary-600 hover:text-primary-600 transition-colors"
              >
                Products
              </button>
              <svg className="h-4 w-4 mx-2 text-secondary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </li>
            <li className="text-secondary-800 font-medium truncate">
              {productToDisplay ? productToDisplay.name : 'Product not found'}
            </li>
          </ol>
        </nav>
      
        {productToDisplay && (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Product image section */}
              <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center">
                <div className="absolute top-4 right-4 z-10">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white shadow-sm text-primary-700 backdrop-blur-sm">
                    {productToDisplay.category}
                  </span>
                </div>
                
                {/* Decorative background elements */}
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary-100 rounded-full opacity-50"></div>
                <div className="absolute top-1/4 right-12 w-16 h-16 bg-accent-100 rounded-full opacity-40"></div>
                
                <div className="relative z-0 p-6 w-full h-96 flex items-center justify-center animate-float">
                  {productToDisplay.image ? (
                    <img 
                      src={productToDisplay.image} 
                      alt={productToDisplay.name}
                      className="max-w-full max-h-full object-contain shadow-xl rounded-lg transform transition-all duration-500 hover:scale-105"
                    />
                  ) : (
                    <div className="text-secondary-400 transition-transform duration-500 transform hover:scale-105">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-40 w-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Product details section */}
              <div className="p-10">
                <h1 className="text-3xl font-bold text-secondary-900 mb-2 font-display">
                  {productToDisplay.name}
                </h1>
                
                <div className="mb-6">
                  {renderStarRating(productToDisplay.rating)}
                </div>
                
                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold text-secondary-900 mr-3">₹{productToDisplay.price}</span>
                  {productToDisplay.discountPercentage && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ₹{Math.round(productToDisplay.price * (100 / (100 - productToDisplay.discountPercentage)))}
                      </span>
                      <span className="ml-3 px-3 py-1 text-sm font-semibold rounded-full bg-success-100 text-success-800 shadow-sm">
                        Save {productToDisplay.discountPercentage}%
                      </span>
                    </>
                  )}
                </div>
                
                <div className="mb-8">
                  <div className="text-secondary-600 leading-relaxed">
                    {productToDisplay.description}
                  </div>
                </div>
                
                {/* Quantity controls */}
                {isAuthenticated() && (
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-secondary-700 mb-2">Quantity</label>
                    <div className="flex items-center">
                      <button 
                        className="w-10 h-10 rounded-l-lg border border-secondary-300 flex items-center justify-center bg-secondary-50 text-secondary-600 hover:bg-secondary-100 transition-colors"
                        onClick={() => isInCart && productQuantity > 1 && handleUpdateQuantity(productQuantity - 1)}
                        disabled={!isInCart || productQuantity <= 1}
                      >
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={productQuantity}
                        onChange={(e) => {
                          const newQuantity = parseInt(e.target.value) || 1;
                          if (isInCart && newQuantity >= 1) {
                            handleUpdateQuantity(newQuantity);
                          }
                        }}
                        className="w-12 h-10 border-t border-b border-secondary-300 text-center bg-white text-secondary-700 focus:outline-none"
                        readOnly={!isInCart}
                      />
                      <button 
                        className="w-10 h-10 rounded-r-lg border border-secondary-300 flex items-center justify-center bg-secondary-50 text-secondary-600 hover:bg-secondary-100 transition-colors"
                        onClick={() => isInCart && handleUpdateQuantity(productQuantity + 1)}
                        disabled={!isInCart}
                      >
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Action buttons */}
                <div className="flex gap-4 flex-wrap">
                  {!isInCart ? (
                    <Button
                      variant="primary"
                      onClick={handleAddToCart}
                      className="flex-1 py-3 min-w-[180px]"
                      leftIcon={
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      }
                    >
                      Add to Cart
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="accent"
                        onClick={() => navigate('/cart')}
                        className="flex-1 py-3 min-w-[180px]"
                        leftIcon={
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        }
                      >
                        Go to Cart
                      </Button>
                      
                      <Button
                        variant="danger"
                        onClick={handleRemoveFromCart}
                        className="py-3 min-w-[120px]"
                        leftIcon={
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        }
                      >
                        Remove
                      </Button>
                    </>
                  )}
                </div>
                
                {/* Additional product metadata */}
                <div className="mt-10 border-t border-gray-200 pt-6">
                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1 bg-secondary-100 text-secondary-800 rounded-full text-sm font-medium inline-flex items-center">
                      <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Fast Delivery
                    </span>
                    <span className="px-3 py-1 bg-secondary-100 text-secondary-800 rounded-full text-sm font-medium inline-flex items-center">
                      <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Secure Payment
                    </span>
                    <span className="px-3 py-1 bg-secondary-100 text-secondary-800 rounded-full text-sm font-medium inline-flex items-center">
                      <svg className="h-4 w-4 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Easy Returns
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage; 