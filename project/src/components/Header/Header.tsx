import { User, ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import logoImg from '../../assets/products/WhatsApp_Image_2026-06-19_at_11.31.57_AM.jpeg';
import LocationSelector from './LocationSelector';
import SearchBar from './SearchBar';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export default function Header() {
  const { items, toggleCart } = useCart();
  const { items: wishlistItems } = useWishlist();
  const wishlistCount = wishlistItems.length;

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-2">
        <div className="flex items-center justify-between gap-4 md:gap-8 w-full">
          {/* Left: Logo & Location */}
          <div className="flex items-center gap-4 md:gap-8 flex-shrink-0">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 block">
              <img
                src={logoImg}
                alt="Vedha Craft"
                className="h-12 w-auto object-contain hover:opacity-90 transition-opacity"
              />
            </Link>

            {/* Location Selector */}
            <div className="hidden md:flex flex-shrink-0">
              <LocationSelector />
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar />

          {/* Icons */}
          <div className="flex items-center gap-5 flex-shrink-0">
            {/* Profile */}
            <button className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-green-600 transition-colors">
              <User className="w-5 h-5" />
              <span className="text-[10px] font-medium hidden sm:block">Profile</span>
            </button>

            {/* Cart */}
            <button 
              onClick={() => toggleCart(true)}
              className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-green-600 transition-colors"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium hidden sm:block">Cart</span>
            </button>

            {/* Wishlist */}
            <Link 
              to="/wishlist" 
              className="flex flex-col items-center gap-0.5 text-gray-600 hover:text-green-600 transition-colors"
            >
              <div className="relative">
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium hidden sm:block">Wishlist</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
