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
          className="border-primary-300 text-primary-700 hover:bg-primary-50 transition-all rounded-xl"
          leftIcon={
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          }
        >
          Filters {checkedCategories.length > 0 && (
            <span className="ml-1.5 bg-primary-100 text-primary-800 text-xs py-0.5 px-2 rounded-full">
              {checkedCategories.length}
            </span>
          )}
        </Button>
      </div>
      
      {/* Mobile filter panel backdrop */}
      <div 
        className={`lg:hidden fixed inset-0 z-40 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={toggleFilters}
      ></div>
      
      <aside 
        className={`
          lg:sticky top-4 h-auto lg:self-start transition-all duration-300 ease-in-out
          ${isOpen ? 'fixed inset-y-0 right-0 max-w-xs w-full z-50 transform translate-x-0' : 'fixed inset-y-0 right-0 max-w-xs w-full z-50 transform translate-x-full lg:transform-none lg:static lg:w-72 lg:max-w-none lg:z-0'} 
          bg-white lg:bg-white/80 lg:backdrop-blur-md shadow-xl lg:shadow-md lg:rounded-xl overflow-y-auto
        `}
      >
        <div className="p-6">
          {/* Mobile header */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <h2 className="text-xl font-bold text-secondary-900">Filters</h2>
            <button 
              className="p-1.5 rounded-full bg-gray-100 text-secondary-500 hover:bg-gray-200 hover:text-secondary-700 transition-colors" 
              onClick={toggleFilters}
              aria-label="Close filters"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Desktop header */}
          <div className="hidden lg:block mb-6">
            <h2 className="text-xl font-bold text-secondary-900 mb-2">Filters</h2>
            <p className="text-sm text-secondary-500">Refine your product search</p>
          </div>
          
          {/* Sortby section */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-secondary-900 mb-3 flex items-center">
              <svg className="h-4 w-4 mr-2 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
              Sort By
            </h3>
            <div className="relative rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all duration-300 shadow-sm hover:shadow">
              <select
                onChange={onSortChange}
                value={sortBy}
                className="appearance-none bg-transparent w-full py-2.5 pl-4 pr-10 text-sm text-secondary-700 focus:outline-none rounded-lg"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-secondary-500">
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Category section */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-secondary-900 mb-3 flex items-center">
              <svg className="h-4 w-4 mr-2 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Categories
            </h3>
            <div className="bg-white/50 rounded-xl p-3 border border-gray-200 shadow-sm">
              <ul className="space-y-2">
                {categories.map(category => (
                  <li key={category}>
                    <label className="flex items-center py-1 px-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="bg-white border-2 rounded-md border-gray-300 w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-primary-500">
                        <input
                          type="checkbox"
                          checked={checkedCategories.includes(category)}
                          value={category}
                          onChange={onCategoryChange}
                          className="opacity-0 absolute"
                        />
                        {checkedCategories.includes(category) && (
                          <svg className="fill-current text-primary-600 pointer-events-none" width="12px" height="12px" viewBox="0 0 20 20">
                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-secondary-700 font-medium select-none">
                        {category}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Clear filters button */}
          {checkedCategories.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              fullWidth
              onClick={onClearFilters}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 transition-all rounded-xl mt-4"
              leftIcon={
                <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
            >
              Clear All Filters
            </Button>
          )}
        </div>
      </aside>
    </>
  );
};

export default ProductFilters; 