import { HeartPulse } from 'lucide-react';
import CategoryPageLayout from '../components/Category/CategoryPageLayout';
import products from '../data/products'; // Mock data for now

const wellnessCategories = ['Essential Oils', 'Herbal Supplements', 'Yoga Mats', 'Meditation Cushions', 'Natural Skincare'];
const wellnessFeatures = ['Organic', 'Cruelty-Free', 'Vegan', 'Therapeutic Grade', 'Ayurvedic'];
const discounts = ['10% off & Above', '25% off & Above', '50% off & Above'];

export default function WellnessPage() {
  return (
    <CategoryPageLayout
      title="Wellness Products"
      description="Nourish your mind, body, and soul with our curated collection of natural wellness products 🧘‍♀️"
      tags={['Self Care', 'Natural Healing', 'Mindfulness', 'Ayurvedic']}
      heroGradient="from-teal-800 via-teal-600 to-cyan-500"
      icon={HeartPulse}
      badgeColorClass="bg-teal-600"
      products={products} // In a real app, filter products by category 'Wellness'
      categories={wellnessCategories}
      features={wellnessFeatures}
      discounts={discounts}
    />
  );
}
