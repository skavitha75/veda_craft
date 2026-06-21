import categories from '../../data/categories';
import CategoryCard from './CategoryCard';
import craftImg from '../../assets/categories/WhatsApp_Image_2026-06-19_at_11.31.44_AM.jpeg';

export default function CategorySection() {
  return (
    <section className="py-8 px-4">
      <div className="max-w-screen-xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={{ ...category, image: craftImg }} />
          ))}
        </div>
      </div>
    </section>
  );
}
