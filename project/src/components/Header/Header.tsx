import { User, ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logoImg from '../../assets/products/WhatsApp_Image_2026-06-19_at_11.31.57_AM.jpeg';
import LocationSelector from './LocationSelector';
import SearchBar from './SearchBar';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import LanguageSelector from './LanguageSelector';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { t } = useTranslation();
  const { items, toggleCart } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { user, logout } = useAuth();
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
            {/* Language Selector */}
            <LanguageSelector />

            {/* Profile */}
            {!user ? (
              <Link to="/login" className="flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors">
                Sign In
              </Link>
            ) : (
              <div className="relative group py-2">
                <Link to="/profile" className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:flex flex-col items-start leading-tight">
                    <span className="text-[10px] text-gray-500">Welcome,</span>
                    <span className="text-xs font-bold text-gray-800 line-clamp-1 max-w-[80px]">{user.name}</span>
                  </div>
                </Link>
                {/* Dropdown */}
                <div className="absolute right-0 top-full w-48 bg-white border border-gray-100 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2 space-y-1">
                    <Link to="/profile" className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg">My Profile</Link>
                    <Link to="/profile/orders" className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg">Orders</Link>
                    <Link to="/wishlist" className="block px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg">Wishlist</Link>
                    <button onClick={logout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">Logout</button>
                  </div>
                </div>
              </div>
            )}

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
              <span className="text-[10px] font-medium hidden sm:block">{t('header.cart')}</span>
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
              <span className="text-[10px] font-medium hidden sm:block">{t('header.wishlist')}</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
