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
    <div className="min-h-screen flex flex-col bg-secondary-50">
      <Header title="Products" />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary-900">Browse Products</h1>
          <p className="text-secondary-500 mt-2">Discover our products and find what you need</p>
        </div>
        
        {isLoading && !hasProducts && (
          <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm animate-pulse">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-primary-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-lg text-secondary-600">Loading products...</p>
            </div>
          </div>
        )}
        
        {displayError && !hasProducts && (
          <div className="flex flex-col justify-center items-center h-64 bg-white rounded-lg shadow-sm">
            <svg className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-xl text-red-600 mb-4">Error: {displayError}</p>
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
        
        {(status === 'succeeded' || hasProducts) && (
          <div className="flex flex-col lg:flex-row">
            <ProductFilters 
              checkedCategories={checkedCategory}
              sortBy={sortByOptions}
              onCategoryChange={handleCategoryChange}
              onSortChange={handleSortChange}
              onClearFilters={handleClearFilters}
            />
            
            <div className="flex-1 lg:ml-8 bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Product count and applied filters */}
              <div className="border-b border-secondary-200 px-6 py-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-secondary-600">{filteredProducts.length} Products</span>
                    {checkedCategory.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {checkedCategory.map(cat => (
                          <span key={cat} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {cat}
                            <button 
                              type="button"
                              className="ml-1.5 inline-flex text-primary-500 focus:outline-none"
                              onClick={() => {
                                dispatch(productActions.removeCheckedCategory(cat));
                              }}
                            >
                              <span className="sr-only">Remove filter for {cat}</span>
                              <svg className="h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <ProductList products={filteredProducts} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage; 