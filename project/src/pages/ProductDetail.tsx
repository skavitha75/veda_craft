import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Star, Leaf, HeartPulse, Sparkles, Sprout, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { ecoProducts } from '../data/ecoProducts';
import { foodProducts } from '../data/foodProducts';
import { wellnessProducts } from '../data/wellnessProducts';
import { craftProducts } from '../data/craftProducts';
import { decorProducts } from '../data/decorProducts';
import { fashionProducts } from '../data/fashionProducts';
import ProductTabs from '../components/Products/ProductTabs';
import ReviewCard from '../components/Products/ReviewCard';
import ProductSection from '../components/Products/ProductSection';

// Combine all products to find the one we need
const allProducts = [
  ...ecoProducts,
  ...foodProducts,
  ...wellnessProducts,
  ...craftProducts,
  ...decorProducts,
  ...fashionProducts,
];

// Mock data to match UI design
const mockDescription = `Our Bamboo Hairbrush is designed to gently detangle your hair while promoting a healthy scalp. Made from 100% natural bamboo, it is a sustainable and eco-friendly alternative to plastic combs.

Suitable for all hair types
Lightweight and durable
Reduces hair breakage and split ends
Perfect for daily use`;

const mockHowToUse = `1. Start from the ends of your hair and gently work your way up to the roots.
2. Use daily on dry or slightly damp hair.
3. Clean regularly by removing loose hair and wiping with a damp cloth.`;

const mockCoreInstructions = `Store in a cool, dry place away from direct sunlight.
Do not soak in water for extended periods as it is a natural wood product.
Replace every 6-12 months depending on usage and wear.`;

const mockReviews = [
  {
    id: 'r1',
    author: 'Priya M.',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    isVerified: true,
    content: "Quality is incredible — you can tell it's handmade with love. Packaging was completely plastic-free.",
  },
  {
    id: 'r2',
    author: 'Anu S.',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    isVerified: true,
    content: "Perfect for detangling wet hair. My kids love using it too. Great value for 4 brushes!",
  },
  {
    id: 'r3',
    author: 'Swati.R',
    avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
    isVerified: true,
    content: "Beautiful brush, but I wish the bristles were a bit softer. Still, amazing eco-friendly alternative!",
  },
];

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const product = allProducts.find((p) => p.id === Number(id));

  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <p className="mb-4">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="text-green-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Get some similar products (mock logic: same category)
  const similarProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 5);

  return (
    <div className="bg-white min-h-screen pt-4 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-green-600">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="hover:text-green-600 cursor-pointer">{product.category}</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-800 font-medium">{product.name}</span>
        </nav>

        {/* Main Product Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
          
          {/* Image Gallery (Mocked with single image replicated for thumbnails) */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 w-20 flex-shrink-0">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white border border-gray-200 rounded-md overflow-hidden cursor-pointer hover:border-green-500">
                   <img src={product.image} alt="thumbnail" className="w-full h-auto object-cover" />
                </div>
              ))}
            </div>
            <div className="flex-1 flex items-start justify-center">
               <img src={product.image} alt={product.name} className="w-full h-auto rounded-xl object-contain shadow-sm border border-gray-100" />
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-4">Biodegradable • Plastic - Free • Biodegradable</p>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center bg-green-700 text-white px-2 py-0.5 rounded text-sm font-medium">
                {product.rating} <Star className="w-3.5 h-3.5 fill-white ml-1" />
              </div>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm text-blue-600">(1,248 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">&#8377; {product.price}</span>
              <span className="text-lg text-gray-400 line-through mb-1">&#8377; {Math.round(product.price * 1.5)}</span>
              <span className="text-sm text-green-600 font-semibold mb-1.5">50% OFF</span>
            </div>

            {/* Quantity */}
            <div className="flex items-center border border-gray-300 rounded-md w-fit mb-8">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1.5 hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-1.5 border-x border-gray-300 font-medium text-gray-800 min-w-[3rem] text-center">
                {quantity}
              </span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1.5 hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <button className="bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-md transition-colors shadow-sm">
                Add To Cart
              </button>
              <button className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-semibold py-3 px-6 rounded-md transition-colors shadow-sm">
                Buy Now
              </button>
            </div>

            {/* Delivery Location */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-semibold text-gray-900 mb-2">Select Delivery Location</h3>
              <p className="text-sm text-gray-600 mb-4">Enter the pincode of your area to check product availability and delivery options</p>
              <div className="flex">
                <input 
                  type="text" 
                  placeholder="Enter Pincode" 
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="border border-gray-300 rounded-l-md px-4 py-2.5 flex-1 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                />
                <button className="bg-gray-50 border border-l-0 border-gray-300 text-gray-700 font-medium px-6 py-2.5 rounded-r-md hover:bg-gray-100 transition-colors">
                  Apply
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Product Highlights */}
        <div className="py-8 border-t border-gray-100 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Product Highlights</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-700 mb-3">
                <Leaf className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">100% Natural Bamboo</h4>
              <p className="text-xs text-gray-600">Made from high-quality natural bamboo</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-700 mb-3">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">Gentle On Scalp</h4>
              <p className="text-xs text-gray-600">Smooth rounded teeth reduce hair - fall</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-700 mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">Anti-static & Fizz Free</h4>
              <p className="text-xs text-gray-600">Reduce frizz and keeps hair smooth</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-700 mb-3">
                <Sprout className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">Sustainable Choice</h4>
              <p className="text-xs text-gray-600">Biodegradable and safe from the plant</p>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <ProductTabs 
          description={mockDescription}
          howToUse={mockHowToUse}
          coreInstructions={mockCoreInstructions}
        />

        {/* Reviews Section */}
        <div className="mt-16 mb-16">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Review</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>

      </div>

      {/* Similar Products (Outside max-w-7xl to let ProductSection manage its own padding if needed, but it's fine inside) */}
      {similarProducts.length > 0 && (
        <div className="bg-gray-50 pt-8 pb-4">
          <div className="max-w-7xl mx-auto">
            <ProductSection title="Similar Products" products={similarProducts} />
          </div>
        </div>
      )}
    </div>
  );
}
