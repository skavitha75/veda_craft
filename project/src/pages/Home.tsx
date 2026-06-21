import HeroBanner from '../components/Hero/HeroBanner';
import CategorySection from '../components/Categories/CategorySection';
import ProductSection from '../components/Products/ProductSection';
import products from '../data/products';

export default function Home() {
  const bestSellers = products.filter((p) => p.section === 'bestsellers');
  const newArrivals = products.filter((p) => p.section === 'newarrivals');
  const trending = products.filter((p) => p.section === 'trending');

  return (
    <main className="bg-white">
      <HeroBanner />

      {/* Shop by Category */}
      <div className="bg-gray-50">
        <CategorySection />
      </div>

      {/* Best Sellers */}
      <ProductSection title="Best Sellers" products={bestSellers} />

      {/* New Arrivals */}
      <div className="bg-gray-50">
        <ProductSection title="New Arrivals" products={newArrivals} />
      </div>

      {/* Trending Products */}
      <ProductSection title="Trending Products" products={trending} />

      {/* Spacer before footer */}
      <div className="h-8" />
    </main>
  );
}
