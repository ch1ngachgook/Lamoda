import React, { useState, useCallback } from 'react';
import useProducts from './useProducts'; 
import { initialProducts } from './chance';

export default function ProductList() {
  const { filteredProducts, handleSearch, handleColorFilter, handlePriceFilter, handleSort, colors } = useProducts(initialProducts);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handlePriceChange = useCallback(() => {
    handlePriceFilter(parseInt(minPrice, 10) || 0, parseInt(maxPrice, 10) || Infinity); 
  }, [minPrice, maxPrice, handlePriceFilter]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-gray-700 text-white p-4 shadow-md flex justify-between items-center"> 
        <h1 className="text-3xl font-bold">Internet-store</h1>
        <SearchFilter onSearch={handleSearch} /> 
      </header>
      <main className="flex-grow p-4 flex">
        <aside className="w-64 mr-4 bg-gray-200 p-4 rounded-lg shadow-md">
          <div className="mb-4">
            <PriceFilter onFilter={handlePriceFilter} />
          </div>
          <div className="mb-4">
            <ColorFilter colors={Array.from(new Set(initialProducts.map(p => p.color)))} onFilter={handleColorFilter} />
          </div>
          <div>
            <SortFilter onSort={handleSort} />
          </div>
        </aside>
        <div className="flex-grow">
          {filteredProducts.length === 0 ? (
            <p className="text-center text-gray-500">По вашему запросу ничего не найдено.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <li key={product.id} className="bg-white rounded-lg shadow-md p-4">
                  <Product product={product} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        
      </footer>
    </div>
  );
}


function Product({ product }) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="relative w-full h-64">
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{product.name}</h3>
        <p className="text-gray-700 mb-2">{product.description}</p>
        <p className="text-gray-900 font-bold">Цена: {product.price} руб.</p>
        <p className="text-gray-600">Рейтинг: {product.rating}</p>
      </div>
    </div>
  );
}


function SearchFilter({ onSearch }) {
  const [search, setSearch] = useState('');

  const handleChange = (e) => {
    setSearch(e.target.value);
    onSearch(e.target.value); 
  };

  return (
    <div className="w-full md:w-1/3">
      <input
        type="text"
        value={search} 
        onChange={handleChange}
        placeholder="Поиск..."
        className="w-full p-2 border border-gray-300 rounded"
        style={{ color: 'black' }}
      />
    </div>
  );
}


function ColorFilter({ colors, onFilter }) {
  const [selectedColors, setSelectedColors] = useState([]);

  const handleCheckboxChange = useCallback((color) => {
    const updatedColors = selectedColors.includes(color) 
      ? selectedColors.filter(c => c !== color) 
      : [...selectedColors, color];
      
    setSelectedColors(updatedColors);
    onFilter(updatedColors);
  }, [selectedColors, onFilter]);

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Цвет:</h3>
      <div className="flex flex-col"> 
        {colors.map((color) => (
          <div key={color} className="flex items-center">
            <input
              type="checkbox"
              id={`color-${color}`} 
              checked={selectedColors.includes(color)}
              onChange={() => handleCheckboxChange(color)}
              className="mr-2"
            />
            <label htmlFor={`color-${color}`}>
              {color}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function PriceFilter({ onFilter }) { 
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  const handlePriceChange = () => {
    onFilter(minPrice, maxPrice);
  };

  return (
    <div>
      <h3>Цена:</h3>
      <input
        type="number"
        value={minPrice}
        onChange={e => setMinPrice(parseInt(e.target.value, 10) || 0)} 
        placeholder="Min"
      /> -
      <input
        type="number"
        value={maxPrice}
        onChange={e => setMaxPrice(parseInt(e.target.value, 10) || 1000)} 
        placeholder="Max"
      />
      <button onClick={handlePriceChange}>Применить</button> 
    </div>
  );
}


const sortOptions = [
  { value: 'priceAsc', label: 'Сначала дешевые' },
  { value: 'priceDesc', label: 'Сначала дорогие' },
  { value: 'ratingDesc', label: 'Сначала популярные' },
];

function SortFilter({ onSort }) {
  const [selectedSort, setSelectedSort] = useState(sortOptions[0].value);

  const handleSortChange = useCallback((value) => {
    setSelectedSort(value);
    onSort(value);
  }, [onSort]);

  return (
    <div>
      <h3>Сортировка:</h3>
      <select value={selectedSort} onChange={e => handleSortChange(e.target.value)}>
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}