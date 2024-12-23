import { useState, useCallback } from 'react';

export default function useProducts(initialProducts) {
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('priceAsc');

  const colors = [...new Set(initialProducts.map(p => p.color))];

  const handleSearch = useCallback((query) => {
    setSearchQuery(query.toLowerCase());
    filterProducts(query.toLowerCase(), selectedColors, minPrice, maxPrice, sortBy);
  }, [selectedColors, minPrice, maxPrice, sortBy]);

  const handleColorFilter = useCallback((colors) => {
    setSelectedColors(colors);
    filterProducts(searchQuery, colors, minPrice, maxPrice, sortBy);
  }, [searchQuery, minPrice, maxPrice, sortBy]);

  const handlePriceFilter = useCallback((min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
    filterProducts(searchQuery, selectedColors, min, max, sortBy);
  }, [searchQuery, selectedColors, sortBy]);

  const handleSort = useCallback((sortBy) => {
    setSortBy(sortBy);
    filterProducts(searchQuery, selectedColors, minPrice, maxPrice, sortBy);
  }, [searchQuery, selectedColors, minPrice, maxPrice]);

  const filterProducts = useCallback((searchQuery, selectedColors, minPrice, maxPrice, sortBy) => {
    let filtered = initialProducts;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery)
      );
    }

    if (selectedColors.length > 0) {
      filtered = filtered.filter(product => selectedColors.includes(product.color));
    }

    const parsedMin = parseInt(minPrice, 10) || 0;
    const parsedMax = parseInt(maxPrice, 10) || Infinity;
    filtered = filtered.filter(product => 
      product.price >= parsedMin && product.price <= parsedMax
    );

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      if (sortBy === 'ratingDesc') return b.rating - a.rating;
      return 0;
    });

    setFilteredProducts(sorted);
  }, [initialProducts]);

  return { filteredProducts, handleSearch, handleColorFilter, handlePriceFilter, handleSort, colors };
}