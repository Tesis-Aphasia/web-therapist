import { useState, useEffect, useCallback } from 'react';
import { UI } from '../constants';

/**
 * Hook for search functionality with debouncing
 * @param {Array} data - Array of items to search through
 * @param {Function} searchFn - Function to perform the search
 * @param {number} debounceDelay - Delay in milliseconds for debouncing
 * @returns {Object} Search state and methods
 */
export const useSearch = (data = [], searchFn, debounceDelay = UI.DEBOUNCE_DELAY) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(data);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceDelay]);

  // Perform search when debounced term changes
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setSearchResults(data);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    
    try {
      const results = searchFn ? searchFn(data, debouncedSearchTerm) : data;
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults(data);
    } finally {
      setIsSearching(false);
    }
  }, [data, debouncedSearchTerm, searchFn]);

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSearchResults(data);
  }, [data]);

  const hasSearchTerm = searchTerm.trim().length > 0;

  return {
    searchTerm,
    debouncedSearchTerm,
    searchResults,
    isSearching,
    handleSearch,
    clearSearch,
    hasSearchTerm,
  };
};
