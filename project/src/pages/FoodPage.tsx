import { UtensilsCrossed } from 'lucide-react';
import CategoryPageLayout from '../components/Category/CategoryPageLayout';
import products from '../data/products'; // Mock data for now

const foodCategories = ['Herbal Tea', 'Spices & Seasonings', 'Healthy Snacks', 'Organic Honey', 'Superfoods'];
const foodFeatures = ['Organic', 'Gluten-Free', 'No Preservatives', 'Farm Fresh', 'Non-GMO'];
const discounts = ['10% off & Above', '20% off & Above', '30% off & Above'];

export default function FoodPage() {
  return (
    <CategoryPageLayout
      title="Organic Food"
      description="Taste the purity of nature with our ethically sourced, organic food items 🍯"
      tags={['Farm Fresh', 'Healthy Living', 'Locally Sourced', 'Pesticide Free']}
      heroGradient="from-orange-700 via-amber-600 to-yellow-500"
      icon={UtensilsCrossed}
      badgeColorClass="bg-orange-600"
      products={products} // In a real app, filter products by category 'Food'
      categories={foodCategories}
      features={foodFeatures}
      discounts={discounts}
    />
  );
}
