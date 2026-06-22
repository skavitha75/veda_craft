import { useState, useMemo } from 'react';
import { Star, ShoppingCart, Heart, SlidersHorizontal, ChevronDown, ChevronUp, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../../data/products';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface Filters {
  categories: string[];
  features: string[];
  discounts: string[];
  priceMax: number;
  inStock: boolean;
  outOfStock: boolean;
}

function FilterSection({
  title,
  items,
  selected,
  onToggle,
}: {
  title: string;
  items: string[];
  selected: string[];
  onToggle: (item: string) => void;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button
        className="flex items-center justify-between w-full mb-3 text-sm font-semibold text-gray-800"
        onClick={() => setOpen((o) => !o)}
      >
        {title}
        {open ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>
      {open && (
        <div className="space-y-2">
          {items.map((item) => (
            <label key={item} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={selected.includes(item)}
                onChange={() => onToggle(item)}
                className="accent-green-600 w-4 h-4 rounded"
              />
              <span className="text-sm text-gray-600 group-hover:text-green-700 transition-colors">{item}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, badgeIcon: BadgeIcon, badgeText, badgeColorClass }: { product: Product, badgeIcon: React.ElementType, badgeText: string, badgeColorClass: string }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const wished = isInWishlist(product.id);
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      rating: product.rating
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex flex-col">
      <div className="relative overflow-hidden bg-gray-50 aspect-square">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
        {/* Badge */}
        <div className="absolute top-2 left-2">
          <span className={`flex items-center gap-1 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColorClass}`}>
            <BadgeIcon className="w-2.5 h-2.5" /> {badgeText}
          </span>
        </div>
        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className={`absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md transition-all duration-200 hover:scale-110 ${
            wished ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
          }`}
        >
          <Heart className={`w-4 h-4 ${wished ? 'fill-red-500' : ''}`} />
        </button>
      </div>

      <div className="p-3 flex flex-col gap-1 flex-1">
        <Link to={`/product/${product.id}`} className="hover:text-green-600 transition-colors">
          <h3 className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2">{product.name}</h3>
        </Link>
        <p className="text-[10px] text-green-600 font-medium">{product.category}</p>

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-sm font-bold text-gray-900">₹ {product.price}</span>
          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] text-gray-600 font-medium">{product.rating}</span>
          </div>
        </div>

        <button
          onClick={handleAdd}
          className={`mt-2 w-full flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg transition-all duration-200 active:scale-95 ${
            added
              ? 'bg-green-600 text-white'
              : 'border border-green-500 text-green-600 hover:bg-green-600 hover:text-white'
          }`}
        >
          <ShoppingCart className="w-3 h-3" />
          {added ? 'Added!' : 'Add'}
        </button>
      </div>
    </div>
  );
}

export interface CategoryPageLayoutProps {
  title: string;
  description: string;
  tags: string[];
  heroGradient: string;
  icon: React.ElementType;
  badgeColorClass: string;
  products: Product[];
  categories: string[];
  features: string[];
  discounts: string[];
}

export default function CategoryPageLayout({
  title,
  description,
  tags,
  heroGradient,
  icon: Icon,
  badgeColorClass,
  products,
  categories,
  features,
  discounts,
}: CategoryPageLayoutProps) {
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    features: [],
    discounts: [],
    priceMax: 5000,
    inStock: false,
    outOfStock: false,
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const toggleFilter = (key: keyof Pick<Filters, 'categories' | 'features' | 'discounts'>, item: string) => {
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(item) ? f[key].filter((x) => x !== item) : [...f[key], item],
    }));
  };

  const clearAll = () =>
    setFilters({ categories: [], features: [], discounts: [], priceMax: 5000, inStock: false, outOfStock: false });

  const activeFiltersCount =
    filters.categories.length + filters.features.length + filters.discounts.length +
    (filters.inStock ? 1 : 0) + (filters.outOfStock ? 1 : 0);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // 1. Category
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }
      
      // 2. Price
      if (product.price > filters.priceMax) {
        return false;
      }

      // 3. Availability (Pseudo-random: ID % 7 == 0 is Out of Stock)
      const isOutOfStock = product.id % 7 === 0;
      if (filters.inStock && !filters.outOfStock && isOutOfStock) return false;
      if (filters.outOfStock && !filters.inStock && !isOutOfStock) return false;

      // 4. Features
      if (filters.features.length > 0) {
        // Assign 1-2 consistent pseudo-random features to each product based on ID
        const feature1 = features[product.id % features.length];
        const feature2 = features[(product.id * 2) % features.length];
        const productFeatures = [feature1, feature2];
        
        // Product must have at least ONE of the selected features
        const hasFeature = filters.features.some(f => productFeatures.includes(f));
        if (!hasFeature) return false;
      }

      // 5. Discount
      if (filters.discounts.length > 0) {
        // Assign a consistent pseudo-random discount based on ID
        const productDiscount = discounts[product.id % discounts.length];
        if (!filters.discounts.includes(productDiscount)) return false;
      }

      return true;
    });
  }, [products, filters, features, discounts]);

  const FilterPanel = () => (
    <aside className="w-full space-y-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-green-600" /> Filter
        </h2>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium transition-colors"
          >
            <X className="w-3 h-3" /> Clear All ({activeFiltersCount})
          </button>
        )}
      </div>

      <div className="border-b border-gray-100 pb-4 mb-4">
        <p className="text-sm font-semibold text-gray-800 mb-3">Price</p>
        <input
          type="range"
          min={0}
          max={5000}
          value={filters.priceMax}
          onChange={(e) => setFilters((f) => ({ ...f, priceMax: Number(e.target.value) }))}
          className="w-full accent-green-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>₹0</span>
          <span className="text-green-700 font-semibold">₹{filters.priceMax}</span>
          <span>₹5000</span>
        </div>
      </div>

      <FilterSection
        title="Category"
        items={categories}
        selected={filters.categories}
        onToggle={(item) => toggleFilter('categories', item)}
      />
      <FilterSection
        title="Features"
        items={features}
        selected={filters.features}
        onToggle={(item) => toggleFilter('features', item)}
      />
      <FilterSection
        title="Discount"
        items={discounts}
        selected={filters.discounts}
        onToggle={(item) => toggleFilter('discounts', item)}
      />

      <div className="pb-4">
        <p className="text-sm font-semibold text-gray-800 mb-3">Availability</p>
        <div className="space-y-2">
          {[
            { label: 'In Stock', key: 'inStock' as const },
            { label: 'Out of Stock', key: 'outOfStock' as const },
          ].map(({ label, key }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters[key]}
                onChange={() => setFilters((f) => ({ ...f, [key]: !f[key] }))}
                className="accent-green-600 w-4 h-4"
              />
              <span className="text-sm text-gray-600 group-hover:text-green-700 transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`bg-gradient-to-r ${heroGradient} text-white py-10`}>
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
          <nav className="flex items-center gap-2 text-white/80 text-xs mb-4">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>›</span>
            <span className="text-white font-medium">{title}</span>
          </nav>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold">{title}</h1>
          </div>
          <p className="text-white/90 text-sm max-w-lg">
            {description}
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag) => (
              <span key={tag} className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full border border-white/30">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="md:hidden sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm">
        <span className="text-sm font-medium text-gray-700">
          {filteredProducts.length} Products
        </span>
        <button
          onClick={() => setMobileFiltersOpen((o) => !o)}
          className="flex items-center gap-2 text-sm font-semibold text-green-700 border border-green-400 px-3 py-1.5 rounded-lg"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters {activeFiltersCount > 0 && <span className="bg-green-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">{activeFiltersCount}</span>}
        </button>
      </div>

      {mobileFiltersOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="relative bg-white w-72 h-full overflow-y-auto p-5 shadow-xl">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-800" onClick={() => setMobileFiltersOpen(false)}>
              <X className="w-5 h-5" />
            </button>
            <FilterPanel />
          </div>
        </div>
      )}

      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-6 flex gap-6">
        <aside className="hidden md:block w-52 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-4">
            <FilterPanel />
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-800">{filteredProducts.length}</span> products
            </p>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400">
              <option>Sort: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Best Rated</option>
            </select>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-gray-400">
              <Icon className="w-12 h-12 mb-3 text-gray-300" />
              <p className="text-base font-medium">No products found</p>
              <button onClick={clearAll} className="mt-3 text-sm text-green-600 underline">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  badgeIcon={Icon} 
                  badgeText={title.split(' ')[0]} 
                  badgeColorClass={badgeColorClass} 
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
