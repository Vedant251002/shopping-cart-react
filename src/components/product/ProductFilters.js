import React, { useState } from 'react';
import Button from '../layout/Button';

const categories = [
  'Appliances',
  'Audio',
  'Wearables',
  'Electronics',
  'Gaming'
];

const sortOptions = [
  { value: '', label: 'Default' },
  { value: 'plowtohigh', label: 'Price (Low to High)' },
  { value: 'phightolow', label: 'Price (High to Low)' },
  { value: 'rlowtohigh', label: 'Rating (Low to High)' },
  { value: 'rhightolow', label: 'Rating (High to Low)' }
];

const ProductFilters = ({ 
  checkedCategories = [], 
  sortBy = '', 
  onCategoryChange, 
  onSortChange,
  onClearFilters
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleFilters = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <>
      {/* Mobile filter button */}
      <div className="lg:hidden sticky top-0 z-10 bg-white shadow-sm py-3 px-4">
        <Button
          variant="outline"
          onClick={toggleFilters}
          fullWidth
          leftIcon={
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          }
        >
          Filters {checkedCategories.length > 0 && `(${checkedCategories.length})`}
        </Button>
      </div>
      
      {/* Mobile filter panel */}
      <div className={`lg:hidden fixed inset-0 z-40 bg-black bg-opacity-25 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleFilters}></div>
      
      <aside 
        className={`
          lg:sticky top-4 h-auto lg:self-start transition-all duration-300 ease-in-out
          ${isOpen ? 'fixed inset-y-0 right-0 w-64 z-50 transform translate-x-0' : 'fixed inset-y-0 right-0 w-64 z-50 transform translate-x-full lg:transform-none lg:static lg:w-64 lg:z-0'} 
          bg-white lg:bg-transparent shadow-lg lg:shadow-none overflow-y-auto
        `}
      >
        <div className="p-4 lg:pt-0">
          {/* Mobile header */}
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <h2 className="text-lg font-medium text-secondary-900">Filters</h2>
            <button 
              className="text-secondary-500 hover:text-secondary-700" 
              onClick={toggleFilters}
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Desktop header */}
          <h2 className="hidden lg:block text-xl font-bold text-secondary-900 mb-6">Filters</h2>
          
          {/* Sortby section */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-secondary-900 mb-3">Sort By</h3>
            <select
              onChange={onSortChange}
              value={sortBy}
              className="w-full p-2 bg-white border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Category section */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-secondary-900 mb-3">Category</h3>
            <ul className="space-y-2">
              {categories.map(category => (
                <li key={category}>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkedCategories.includes(category)}
                      value={category}
                      onChange={onCategoryChange}
                      className="h-4 w-4 text-primary-600 rounded border-secondary-300 focus:ring-primary-500"
                    />
                    <span className="text-sm text-secondary-700 group-hover:text-secondary-900">
                      {category}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Clear filters button */}
          {checkedCategories.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={onClearFilters}
              leftIcon={
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
            >
              Clear Filters
            </Button>
          )}
        </div>
      </aside>
    </>
  );
};

export default ProductFilters; 