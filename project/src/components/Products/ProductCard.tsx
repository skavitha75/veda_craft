import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '../../data/products';
import WishlistButton from './WishlistButton';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group flex flex-col">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-50 aspect-square block">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        {/* Wishlist Button */}
        <div className="absolute top-2 right-2">
          <WishlistButton productId={product.id} />
        </div>
      </div>

      {/* Product Info */ }
  <div className="p-2.5 flex flex-col gap-1 flex-1">
    <Link to={`/product/${product.id}`} className="hover:text-green-600 transition-colors">
      <h3 className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2">
        {product.name}
      </h3>
    </Link>
    <p className="text-[10px] text-green-600 font-medium">{product.category}</p>

    {/* Price + Rating Row */}
    <div className="flex items-center justify-between mt-auto pt-1.5">
      <span className="text-sm font-bold text-gray-800">
        &#8377; {product.price}
      </span>
      <div className="flex items-center gap-0.5">
        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
        <span className="text-[10px] text-gray-600 font-medium">{product.rating}</span>
      </div>
    </div>

    {/* Add Button */}
    <button className="mt-1.5 w-full flex items-center justify-center gap-1.5 border border-green-500 text-green-600 hover:bg-green-600 hover:text-white text-xs font-semibold py-1.5 rounded-md transition-all duration-200 active:scale-95">
      <ShoppingCart className="w-3 h-3" />
      Add
    </button>
  </div>
    </div >
  );
}
