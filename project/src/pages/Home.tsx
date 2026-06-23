import HeroBanner from '../components/Hero/HeroBanner';
import CategorySection from '../components/Categories/CategorySection';
import ProductSection from '../components/Products/ProductSection';
import { useTranslation } from 'react-i18next';

import { ecoProducts } from '../data/ecoProducts';
import { foodProducts } from '../data/foodProducts';
import { wellnessProducts } from '../data/wellnessProducts';
import { craftProducts } from '../data/craftProducts';
import { decorProducts } from '../data/decorProducts';
import { fashionProducts } from '../data/fashionProducts';

// Helper to shuffle an array nicely
const shuffle = <T,>(array: T[]): T[] => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export default function Home() {
  const { t } = useTranslation();

  const allProducts = [
    ...ecoProducts,
    ...foodProducts,
    ...wellnessProducts,
    ...craftProducts,
    ...decorProducts,
    ...fashionProducts
  ];

  // Get products for each section and shuffle them so it looks like a curated mix
  const bestSellers = shuffle(allProducts.filter((p) => p.section === 'bestsellers'));
  const newArrivals = shuffle(allProducts.filter((p) => p.section === 'newarrivals'));
  const trending = shuffle(allProducts.filter((p) => p.section === 'trending'));

  return (
    <main className="bg-white">
      <HeroBanner />

      {/* Shop by Category */}
      <div className="bg-gray-50">
        <CategorySection />
      </div>

      {/* Best Sellers */}
      <ProductSection title={t('home.bestSellers')} products={bestSellers} />

      {/* New Arrivals */}
      <div className="bg-gray-50">
        <ProductSection title={t('home.newArrivals')} products={newArrivals} />
      </div>

      {/* Trending Products */}
      <ProductSection title={t('home.trending')} products={trending} />

      {/* Spacer before footer */}
      <div className="h-8" />
    </main>
  );
}
