import { Shirt } from 'lucide-react';
import CategoryPageLayout from '../components/Category/CategoryPageLayout';
import products from '../data/products'; // Mock data for now

const fashionCategories = ['Cotton Apparel', 'Linen Wear', 'Handloom Sarees', 'Eco Bags', 'Handmade Jewelry'];
const fashionFeatures = ['Sustainable Fabric', 'Ethical Fashion', 'Handwoven', 'Natural Dyes', 'Slow Fashion'];
const discounts = ['20% off & Above', '40% off & Above', '60% off & Above'];

export default function FashionPage() {
  return (
    <CategoryPageLayout
      title="Sustainable Fashion"
      description="Express yourself with eco-friendly clothing and accessories that look good and do good 👗"
      tags={['Slow Fashion', 'Handloom', 'Natural Dyes', 'Ethical Wear']}
      heroGradient="from-green-800 via-green-600 to-amber-500"
      icon={Shirt}
      badgeColorClass="bg-rose-600"
      products={products} // In a real app, filter products by category 'Fashion'
      categories={fashionCategories}
      features={fashionFeatures}
      discounts={discounts}
    />
  );
}
