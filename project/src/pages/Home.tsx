import HeroBanner from '../components/Hero/HeroBanner';
import CategorySection from '../components/Categories/CategorySection';
import ProductSection from '../components/Products/ProductSection';
import { useTranslation } from 'react-i18next';
import type { Product } from '../services/productApi';
import { allProducts } from '../data/allProducts';

const toApiProduct = (product: (typeof allProducts)[number]): Product => ({
  ...product,
  slug: product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
  stock: 20,
  images: [product.image],
  total_reviews: 0,
  specifications: {},
  is_featured: product.section === 'bestsellers',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
});

const homeSectionProducts = {
  bestSellers: allProducts.filter((product) => product.section === 'bestsellers').map(toApiProduct),
  newArrivals: allProducts.filter((product) => product.section === 'newarrivals').map(toApiProduct),
  trending: allProducts.filter((product) => product.section === 'trending').map(toApiProduct),
};

export default function Home() {
  const { t } = useTranslation();

  return (
    <main className="bg-white">
      <HeroBanner />

      {/* Shop by Category */}
      <div className="bg-gray-50">
        <CategorySection />
      </div>

      <ProductSection title={t('home.bestSellers')} products={homeSectionProducts.bestSellers} />

      <div className="bg-gray-50">
        <ProductSection title={t('home.newArrivals')} products={homeSectionProducts.newArrivals} />
      </div>

      <ProductSection title={t('home.trending')} products={homeSectionProducts.trending} />

      {/* Spacer before footer */}
      <div className="h-8" />
    </main>
  );
}
