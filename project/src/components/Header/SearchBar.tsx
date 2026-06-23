import { Search, Mic } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { allProducts, SearchProduct } from '../../data/allProducts';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (e.target.value.trim() !== '') {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
    setQuery('');
    setIsDropdownOpen(false);
  };

  const filteredProducts: SearchProduct[] = query.trim() === '' 
    ? [] 
    : allProducts.filter(p => {
        const lowerQuery = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery) ||
          p.mainCategory.toLowerCase().includes(lowerQuery)
        );
      });

  return (
    <div className="flex-1 max-w-2xl relative" ref={dropdownRef}>
      <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm hover:border-green-400 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition-all">
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0 mr-2" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (query.trim() !== '') setIsDropdownOpen(true);
          }}
          placeholder="Search"
          className="flex-1 outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400"
        />
        <button className="flex-shrink-0 ml-2 text-gray-400 hover:text-green-600 transition-colors">
          <Mic className="w-4 h-4" />
        </button>
      </div>

      {/* Search Results Dropdown */}
      {isDropdownOpen && query.trim() !== '' && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50">
          {filteredProducts.length > 0 ? (
            <ul className="max-h-96 overflow-y-auto">
              {filteredProducts.map(product => (
                <li 
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-12 h-12 object-cover rounded-md border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                    <p className="text-xs text-gray-500 flex gap-2">
                      <span>{product.mainCategory}</span>
                      <span>•</span>
                      <span>{product.category}</span>
                    </p>
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    &#8377;{product.price}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500 text-sm">
              No products found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
