import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../layout/Button';

const ProductCard = ({ product, onDelete = null }) => {
  const navigate = useNavigate();
  
  const handleViewDetails = (e) => {
    // Prevent navigation if clicked on delete button
    if (e && e.target.closest('.delete-button')) {
      return;
    }
    navigate(`/products/${product.id}`);
  };

  // Helper to generate star rating display
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
        
        <span className="ml-1.5 text-sm text-gray-600 font-medium">({rating})</span>
      </div>
    );
  };
  
  return (
    <div 
      className="card group max-w-xs rounded-2xl overflow-hidden shadow-card bg-white hover:shadow-card-hover transition-all duration-500 animate-fade-in cursor-pointer"
      onClick={handleViewDetails}
    >
      {/* Product image with gradient overlay */}
      <div className="relative h-56 bg-gray-200 overflow-hidden">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform duration-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        )}
        
        {/* Image overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Category badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-primary-700 shadow-md backdrop-blur-sm">
            {product.category}
          </span>
        </div>
        
        {/* Quick view button */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <span className="bg-white/90 backdrop-blur-sm text-primary-700 text-sm font-medium px-4 py-1.5 rounded-full shadow-md hover:bg-white transition-colors duration-200">
            Quick View
          </span>
        </div>
      </div>
      
      {/* Product details */}
      <div className="p-5">
        <h2 className="font-bold text-lg text-secondary-800 line-clamp-2 h-14 mb-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h2>
        
        <div className="mb-3">
          {renderStarRating(product.rating)}
        </div>
        
        <p className="text-sm text-secondary-600 line-clamp-2 h-10 mb-4">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-xl font-bold text-secondary-900">₹{product.price}</span>
            {product.discountPercentage && (
              <span className="text-sm text-gray-500 line-through">₹{Math.round(product.price * (100 / (100 - product.discountPercentage)))}</span>
            )}
          </div>
          {product.discountPercentage && (
            <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-success-100 text-success-800 shadow-sm">
              Save {product.discountPercentage}%
            </span>
          )}
        </div>
        
        {onDelete && (
          <div className="delete-button" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="danger"
              size="sm"
              fullWidth
              onClick={() => onDelete(product.id)}
              className="rounded-lg hover:-translate-y-1"
            >
              Remove
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard; 