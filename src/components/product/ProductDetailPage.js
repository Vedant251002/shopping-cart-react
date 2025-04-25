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
          <svg key={`full-${i}`} className="w-5 h-5 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        {hasHalfStar && (
          <svg className="w-5 h-5 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
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
          <svg key={`empty-${i}`} className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        
        <span className="ml-2 text-secondary-600">({rating} of 5)</span>
      </div>
    );
  };

  const productToDisplay = selectedProduct || localProduct;
  const isLoading = status === 'loading' || localLoading;
  const displayError = error || localError;

  if (isLoading && !productToDisplay) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Header title="Product Details" />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-primary-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-lg text-secondary-600">Loading product details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (displayError && !productToDisplay) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <Header title="Product Details" />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col justify-center items-center min-h-[400px]">
            <svg className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-xl text-red-600 mb-4">Error: {displayError}</p>
            <div className="flex gap-4">
              <Button 
                variant="secondary" 
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
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-secondary-50">
      <Header title="Product Details" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Navigation breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex text-sm">
            <li className="flex items-center">
              <button 
                onClick={() => navigate('/')}
                className="text-secondary-600 hover:text-primary-600"
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
                className="text-secondary-600 hover:text-primary-600"
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
      
        {productToDisplay ? (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Product image */}
              <div className="relative bg-secondary-100 h-96 flex items-center justify-center">
                <div className="absolute top-4 right-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    {productToDisplay.category}
                  </span>
                </div>
                {productToDisplay.image ? (
                  <img 
                    src={productToDisplay.image} 
                    alt={productToDisplay.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="text-secondary-400 group-hover:scale-110 transition-transform duration-500 transform">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Product details */}
              <div className="p-8">
                <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                  {productToDisplay.name}
                </h1>
                
                <div className="mb-6">
                  {renderStarRating(productToDisplay.rating)}
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-secondary-900 mb-2">Description</h3>
                    <p className="text-secondary-700 leading-relaxed">
                      {productToDisplay.description}
                    </p>
                  </div>
                  
                  <div className="border-t border-b border-secondary-200 py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-3xl font-bold text-secondary-900">
                          ₹{productToDisplay.price}
                        </span>
                        {productToDisplay.discountPercentage && (
                          <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Save {productToDisplay.discountPercentage}%
                          </span>
                        )}
                      </div>
                      
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <svg className="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        In Stock
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="secondary"
                      onClick={handleGoBack}
                      leftIcon={
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                      }
                    >
                      Back to Products
                    </Button>
                    
                    {!isInCart ? (
                      <Button
                        variant="primary"
                        onClick={handleAddToCart}
                        leftIcon={
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        }
                      >
                        Add to Cart
                      </Button>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-center gap-3">
                        <div className="flex items-center">
                          <span className="text-sm text-secondary-600 mr-2">Quantity:</span>
                          <div className="flex items-center border border-secondary-300 rounded-md">
                            <button 
                              className="px-2 py-1 border-r border-secondary-300 hover:bg-secondary-100 transition-colors"
                              onClick={() => {
                                if (productQuantity <= 1) {
                                  handleRemoveFromCart();
                                } else {
                                  handleUpdateQuantity(productQuantity - 1);
                                }
                              }}
                              aria-label="Decrease quantity"
                            >
                              <svg className="h-4 w-4 text-secondary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <div className="px-3 py-1 text-center min-w-[2.5rem]">
                              {productQuantity}
                            </div>
                            <button 
                              className="px-2 py-1 border-l border-secondary-300 hover:bg-secondary-100 transition-colors"
                              onClick={() => handleUpdateQuantity(productQuantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <svg className="h-4 w-4 text-secondary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRemoveFromCart}
                          leftIcon={
                            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          }
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col justify-center items-center min-h-[400px]">
            <svg className="h-16 w-16 text-secondary-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xl text-secondary-700 mb-4">Product not found</p>
            <Button 
              variant="secondary" 
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
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage; 