import { useEffect, useState } from 'react';
import HeroBanner from '../components/Hero/HeroBanner';
import CategorySection from '../components/Categories/CategorySection';
import ProductSection from '../components/Products/ProductSection';
import { useTranslation } from 'react-i18next';
import { getProducts, type Product } from '../services/productApi';

export default function Home() {
  const { t } = useTranslation();
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [trending, setTrending] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadProducts = async () => {
      try {
        const [featuredResult, latestResult, ratedResult] = await Promise.all([
          getProducts({ featured: true, limit: 10, sortBy: 'created_at', sortOrder: 'desc' }),
          getProducts({ limit: 10, sortBy: 'created_at', sortOrder: 'desc' }),
          getProducts({ limit: 10, sortBy: 'rating', sortOrder: 'desc' }),
        ]);

        if (!mounted) return;

        setBestSellers(featuredResult.products);
        setNewArrivals(latestResult.products);
        setTrending(ratedResult.products);
      } catch (error) {
        console.error('Failed to load home products:', error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadProducts();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="bg-white">
      <HeroBanner />

      {/* Shop by Category */}
      <div className="bg-gray-50">
        <CategorySection />
      </div>

      {isLoading ? (
        <div className="py-16 text-center text-sm text-gray-500">Loading products...</div>
      ) : (
        <>
          <ProductSection title={t('home.bestSellers')} products={bestSellers} />

          <div className="bg-gray-50">
            <ProductSection title={t('home.newArrivals')} products={newArrivals} />
          </div>

          <ProductSection title={t('home.trending')} products={trending} />
        </>
      )}

      {/* Spacer before footer */}
      <div className="h-8" />
    </main>
  );
}
