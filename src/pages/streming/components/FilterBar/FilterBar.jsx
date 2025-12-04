import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Filter, Sparkles } from 'lucide-react';
import { FILTERS, CATEGORIES } from '../../utils/constants';

const FilterBar = ({ onFilterChange, activeFilter, showShorts = false }) => {
  const [showCategories, setShowCategories] = useState(false);
  const [customFilters, setCustomFilters] = useState(FILTERS);
  const [searchFilter, setSearchFilter] = useState('');
  const filterContainerRef = useRef(null);

  const scroll = (direction) => {
    if (filterContainerRef.current) {
      const scrollAmount = 200;
      filterContainerRef.current.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
    }
  };

  const handleFilterClick = (filter) => {
    onFilterChange(filter);
    setShowCategories(false);
  };

  const addCustomFilter = () => {
    if (searchFilter.trim() && !customFilters.includes(searchFilter)) {
      setCustomFilters([...customFilters, searchFilter.trim()]);
      setSearchFilter('');
    }
  };

  const removeFilter = (filter, e) => {
    e.stopPropagation();
    if (FILTERS.includes(filter)) return; // Don't remove default filters
    setCustomFilters(customFilters.filter(f => f !== filter));
    if (activeFilter === filter) {
      onFilterChange('All');
    }
  };

  // Auto-scroll to active filter
  useEffect(() => {
    if (filterContainerRef.current && activeFilter) {
      const activeElement = filterContainerRef.current.querySelector(`[data-filter="${activeFilter}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    }
  }, [activeFilter]);

  return (
    <div className="sticky top-16 bg-white dark:bg-black py-4 z-40 border-b border-gray-200 dark:border-gray-800">
      <div className="relative">
        {/* Navigation Buttons */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex items-center gap-1 z-10">
          <button 
            onClick={() => scroll('left')}
            className="w-10 h-10 bg-white dark:bg-black/80 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-lg"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        
        {/* Filter Container */}
        <div 
          ref={filterContainerRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-12"
        >
          {/* All Filters */}
          <button 
            data-filter="All"
            onClick={() => handleFilterClick('All')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
              activeFilter === 'All' 
                ? 'bg-black dark:bg-white text-white dark:text-black font-medium' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Sparkles size={16} />
            <span>All</span>
          </button>

          {/* Shorts Button */}
          {showShorts && (
            <button 
              data-filter="Shorts"
              onClick={() => handleFilterClick('Shorts')}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                activeFilter === 'Shorts' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <div className="w-5 h-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded flex items-center justify-center">
                <span className="text-xs font-bold text-white">S</span>
              </div>
              <span>Shorts</span>
            </button>
          )}

          {/* Live Button */}
          <button 
            data-filter="Live"
            onClick={() => handleFilterClick('Live')}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
              activeFilter === 'Live' 
                ? 'bg-red-600 text-white font-medium' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            <span>Live</span>
          </button>

          {/* Custom Filters */}
          {customFilters.map((filter, index) => (
            <button 
              key={index} 
              data-filter={filter}
              onClick={() => handleFilterClick(filter)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 flex items-center gap-2 group ${
                activeFilter === filter 
                  ? 'bg-black dark:bg-white text-white dark:text-black font-medium' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span>{filter}</span>
              {!FILTERS.includes(filter) && (
                <button 
                  onClick={(e) => removeFilter(filter, e)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              )}
            </button>
          ))}
        </div>

        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 flex items-center gap-1 z-10">
          <button 
            onClick={() => scroll('right')}
            className="w-10 h-10 bg-white dark:bg-black/80 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-lg"
          >
            <ChevronRight size={20} />
          </button>
          
          <button 
            onClick={() => setShowCategories(!showCategories)}
            className="w-10 h-10 bg-white dark:bg-black/80 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors shadow-lg ml-2"
          >
            <Filter size={20} />
          </button>
        </div>
      </div>

      {/* Categories Dropdown */}
      {showCategories && (
        <div className="absolute top-full mt-2 left-4 right-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-2xl z-50 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Categories</h3>
            <button 
              onClick={() => setShowCategories(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
            {CATEGORIES.map((category, index) => (
              <button
                key={index}
                onClick={() => handleFilterClick(category)}
                className={`p-3 rounded-lg text-left ${
                  activeFilter === category 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* Add Custom Filter */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
            <h4 className="font-semibold mb-2">Add custom filter</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Enter filter name..."
                className="flex-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && addCustomFilter()}
              />
              <button 
                onClick={addCustomFilter}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;