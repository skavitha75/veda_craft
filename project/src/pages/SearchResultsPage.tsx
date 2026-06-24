import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { allProducts, SearchProduct } from '../data/allProducts';
import ProductCard from '../components/Products/ProductCard';

const getProductDescriptionKeywords = (p: SearchProduct): string => {
  if (p.mainCategory.toLowerCase() === 'eco') {
    return 'eco-friendly sustainable biodegradable plastic-free natural materials organic zero waste';
  }
  if (p.mainCategory.toLowerCase() === 'wellness') {
    return 'wellness healthy organic ingredients therapeutic natural healing relaxation self care';
  }
  if (p.mainCategory.toLowerCase() === 'food') {
    return 'organic food hand-processed traditional recipe healthy grains pure ingredients nutritional';
  }
  if (p.mainCategory.toLowerCase() === 'craft') {
    return 'handcrafted rural artisans traditional art heritage home decor eco-friendly crafts';
  }
  if (p.mainCategory.toLowerCase() === 'fashion') {
    return 'natural fiber organic cotton hand-spun handloom fabric sustainable fashion breathable';
  }
  if (p.mainCategory.toLowerCase() === 'decor items' || p.mainCategory.toLowerCase() === 'decor') {
    return 'handcrafted home decor wall hanging candle holder elegant aesthetic artistic ornaments';
  }
  return '';
};

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchProduct[]>([]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = allProducts.filter(p => {
      const descKeywords = getProductDescriptionKeywords(p);
      return (
        p.name.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.mainCategory.toLowerCase().includes(lowerQuery) ||
        descKeywords.toLowerCase().includes(lowerQuery)
      );
    });
    setResults(filtered);
  }, [query]);

  return (
    <div className="bg-white min-h-[calc(100vh-140px)]">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Search Results for "{query}"
        </h1>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
            <h2 className="text-xl text-gray-700 font-bold">No products found matching your search.</h2>
            <p className="text-sm text-gray-500 mt-2">Try checking your spelling or use more general terms like "food" or "eco".</p>
          </div>
        )}
      </div>
    </div>
  );
}
