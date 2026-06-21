export interface Category {
  id: number;
  name: string;
  image: string;
  slug: string;
}

const categories: Category[] = [
  { id: 1, name: 'Eco', image: '', slug: 'eco' },
  { id: 2, name: 'Wellness', image: '', slug: 'wellness' },
  { id: 3, name: 'Food', image: '', slug: 'food' },
  { id: 4, name: 'Craft', image: '', slug: 'craft' },
  { id: 5, name: 'Fashion', image: '', slug: 'fashion' },
  { id: 6, name: 'Decor Items', image: '', slug: 'decor' },
];

export default categories;
