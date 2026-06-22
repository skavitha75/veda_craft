import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/Products/ProductCard';
import { Link } from 'react-router-dom';

export default function WishlistPage() {
  const { items } = useWishlist();

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Your WishList</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-6">Save items you love here to easily find them later.</p>
            <Link 
              to="/" 
              className="inline-block bg-green-700 hover:bg-green-800 text-white font-medium px-6 py-2.5 rounded-md transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
