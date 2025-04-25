import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, onDelete = null }) => {
  if (!products || products.length === 0) {
    return (
      <div className="w-full flex justify-center items-center p-16">
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="mt-4 text-2xl font-medium text-secondary-600">No products found</p>
          <p className="mt-2 text-secondary-500">Try adjusting your filters or search criteria.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <div 
            key={product.id} 
            className="animate-slide-up" 
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <ProductCard 
              product={product}
              onDelete={onDelete} 
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList; 