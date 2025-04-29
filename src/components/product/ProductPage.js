import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../layout/Header';
import ProductFilters from './ProductFilters';
import ProductList from './ProductList';
import { productActions, fetchProducts } from '../../store/slices/productSlice';
import { productApi } from '../../services/api';
import Button from '../layout/Button';

const ProductPage = () => {
  const dispatch = useDispatch();
  const { products, checkedCategory, sortByOptions, status, error } = useSelector(state => state.products);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [localProducts, setLocalProducts] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  
  // Initial data fetch
  useEffect(() => {
    const loadProducts = async () => {
      if (products.length === 0) {
        try {
          // Try with Redux
          dispatch(fetchProducts());
          
          // If Redux fails, try direct API call after a short delay
          setTimeout(async () => {
            if (status === 'failed' || products.length === 0) {
              setLocalLoading(true);
              try {
                const fetchedProducts = await productApi.getAll();
                setLocalProducts(fetchedProducts);
                setLocalLoading(false);
              } catch (err) {
                setLocalError(err.message);
                setLocalLoading(false);
              }
            }
          }, 1000);
        } catch (error) {
          console.error("Error loading products:", error);
        }
      } else {
        applyFilters();
      }
    };
    
    loadProducts();
  }, [dispatch]);
  
  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [checkedCategory, sortByOptions, products, localProducts]);
  
  const applyFilters = () => {
    // Use either Redux products or local products
    let sourceProducts = products.length > 0 ? products : localProducts;
    
    // Make a copy to avoid mutation
    let filtered = [...sourceProducts];
    
    // Apply category filter
    if (checkedCategory.length > 0) {
      filtered = filtered.filter(product => 
        checkedCategory.includes(product.category)
      );
    }
    
    // Apply sorting
    switch (sortByOptions) {
      case 'plowtohigh':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'phightolow':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rlowtohigh':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'rhightolow':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered.sort((a, b) => Number(a.id) - Number(b.id));
        break;
    }
    
    setFilteredProducts(filtered);
  };
  
  const handleCategoryChange = (e) => {
    const { checked, value } = e.target;
    
    if (checked) {
      dispatch(productActions.addCheckedCategory(value));
    } else {
      dispatch(productActions.removeCheckedCategory(value));
    }
  };
  
  const handleSortChange = (e) => {
    dispatch(productActions.addSelectedFilter(e.target.value));
  };
  
  const handleClearFilters = () => {
    dispatch(productActions.clearFilters());
  };
  
  const handleRetry = () => {
    setLocalError(null);
    dispatch(fetchProducts());
  };
  
  const isLoading = status === 'loading' || localLoading;
  const displayError = error || localError;
  const hasProducts = filteredProducts.length > 0;
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header title="Shopping Store" />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <svg className="absolute left-0 bottom-0 h-full opacity-10" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
            <path fill="#fff" d="M-59.8,80.9c-0.8,9.9,21.2,20.3,30.7,27.2S5,128.5,21.8,128s31.2-16.3,40.4-27s20.7-19.5,31.6-19.2 s22.3,20.1,26.5,27.5s0.5-27-0.4-44.9S124.5,38,109.3,31s-29.2-5.9-49.1-2.2S12.2,49.9,5.7,41.2S-6.9,9.6-23.8,10.3 s-26.7,15.9-36.5,30.5s-9,24.8-7.9,34.3C-67.1,84.6-59,69.2-59.8,80.9z"></path>
          </svg>
          <svg className="absolute right-0 top-0 h-full opacity-10 transform rotate-180" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
            <path fill="#fff" d="M-59.8,80.9c-0.8,9.9,21.2,20.3,30.7,27.2S5,128.5,21.8,128s31.2-16.3,40.4-27s20.7-19.5,31.6-19.2 s22.3,20.1,26.5,27.5s0.5-27-0.4-44.9S124.5,38,109.3,31s-29.2-5.9-49.1-2.2S12.2,49.9,5.7,41.2S-6.9,9.6-23.8,10.3 s-26.7,15.9-36.5,30.5s-9,24.8-7.9,34.3C-67.1,84.6-59,69.2-59.8,80.9z"></path>
          </svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display tracking-wide animate-fade-in">
              Discover Amazing Products
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up">
              Browse our collection of high-quality products at competitive prices. Find exactly what you need with our easy-to-use filters.
            </p>
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl inline-flex shadow-md animate-fade-in animate-float">
              <span className="inline-flex gap-1 items-center px-4 py-2 text-primary-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Free shipping over ₹500
              </span>
              <span className="inline-flex gap-1 items-center px-4 py-2 text-primary-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                24/7 Customer Support
              </span>
              <span className="inline-flex gap-1 items-center px-4 py-2 text-primary-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                100% Secure Checkout
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {isLoading && !hasProducts && (
          <div className="flex justify-center items-center h-80 bg-white rounded-xl shadow-sm animate-pulse">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                <div className="absolute inset-3 rounded-full border-4 border-t-transparent border-r-primary-300 border-b-transparent border-l-transparent animate-spin" style={{animationDirection: 'reverse', animationDuration: '1s'}}></div>
              </div>
              <p className="mt-6 text-xl font-medium text-secondary-600">Loading amazing products...</p>
              <p className="mt-2 text-secondary-400">This may take a moment</p>
            </div>
          </div>
        )}
        
        {displayError && !hasProducts && (
          <div className="flex flex-col justify-center items-center h-80 bg-white rounded-xl shadow-md">
            <div className="p-6 rounded-full bg-red-50 mb-4">
              <svg className="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-red-600 mb-2">Oops! Something went wrong</h3>
            <p className="text-secondary-600 mb-6 text-center max-w-md">
              {displayError}. Please try again or contact support if the problem persists.
            </p>
            <Button 
              variant="primary" 
              onClick={handleRetry} 
              className="flex items-center gap-2 shadow-md hover:-translate-y-1"
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
        
        {(status === 'succeeded' || hasProducts) && (
          <div className="mt-6">
            {/* Filter and Products section */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Product count and applied filters */}
              <div className="p-6 border-b border-secondary-200 flex flex-wrap justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-secondary-800 mb-2">Browse Products</h2>
                  <div className="flex items-center">
                    <span className="text-secondary-600 font-medium">{filteredProducts.length} Products Available</span>
                    {checkedCategory.length > 0 && (
                      <span className="ml-2 text-secondary-500 text-sm">
                        (Filtered by {checkedCategory.length} {checkedCategory.length === 1 ? 'category' : 'categories'})
                      </span>
                    )}
                  </div>
                </div>
                {checkedCategory.length > 0 && (
                  <div className="mt-2 sm:mt-0">
                    <button 
                      className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center gap-1 transition-colors"
                      onClick={handleClearFilters}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col lg:flex-row">
                <ProductFilters 
                  checkedCategories={checkedCategory}
                  sortBy={sortByOptions}
                  onCategoryChange={handleCategoryChange}
                  onSortChange={handleSortChange}
                  onClearFilters={handleClearFilters}
                />
                
                <div className="flex-1">
                  {/* Applied filters chips */}
                  {checkedCategory.length > 0 && (
                    <div className="px-6 py-4 border-b border-secondary-200">
                      <div className="flex flex-wrap gap-2">
                        {checkedCategory.map(cat => (
                          <span key={cat} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 animate-fade-in transition-all hover:bg-primary-200">
                            {cat}
                            <button 
                              type="button"
                              className="ml-1.5 inline-flex text-primary-600 focus:outline-none hover:text-primary-800 transition-colors"
                              onClick={() => {
                                dispatch(productActions.removeCheckedCategory(cat));
                              }}
                            >
                              <span className="sr-only">Remove filter for {cat}</span>
                              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <ProductList products={filteredProducts} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage; 