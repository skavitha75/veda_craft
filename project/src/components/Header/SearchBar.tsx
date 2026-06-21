import { Search, Mic } from 'lucide-react';
import { useState } from 'react';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  return (
    <div className="flex-1 max-w-2xl">
      <div className="flex items-center bg-white border border-gray-300 rounded-full px-4 py-2 shadow-sm hover:border-green-400 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition-all">
        <Search className="w-4 h-4 text-gray-400 flex-shrink-0 mr-2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          className="flex-1 outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400"
        />
        <button className="flex-shrink-0 ml-2 text-gray-400 hover:text-green-600 transition-colors">
          <Mic className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
