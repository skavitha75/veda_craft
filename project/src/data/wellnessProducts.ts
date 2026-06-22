import { Product } from './products';
import AromatherapyCandle from '../assets/products/wellnessproducts/AromatherapyCandle.jpeg';
import Essitentialoil from '../assets/products/wellnessproducts/Essitentialoil.jpeg';
import HerbalTeaPack from '../assets/products/wellnessproducts/HerbalTeaPack.jpeg';
import Herbalsupplements from '../assets/products/wellnessproducts/Herbalsupplements.jpeg';
import MassageRoller from '../assets/products/wellnessproducts/MassageRoller.jpeg';
import MeditationCushion from '../assets/products/wellnessproducts/MeditationCushion.jpeg';
import OrganicFaceSerum from '../assets/products/wellnessproducts/OrganicFaceSerum.jpeg';
import VeganSoap from '../assets/products/wellnessproducts/VeganSoap.jpeg';
import WellnessGiftBox from '../assets/products/wellnessproducts/WellnessGiftBox.jpeg';
import skincarecream from '../assets/products/wellnessproducts/skincarecream.jpeg';
import yogamat from '../assets/products/wellnessproducts/yogamat.jpeg';

export const wellnessProducts: Product[] = [
  {
    id: 101,
    name: 'Aromatherapy Candle',
    category: 'Wellness',
    price: 399,
    rating: 4.8,
    image: AromatherapyCandle,
    section: 'bestsellers',
  },
  {
    id: 102,
    name: 'Essential Oil',
    category: 'Wellness',
    price: 499,
    rating: 4.7,
    image: Essitentialoil,
    section: 'bestsellers',
  },
  {
    id: 103,
    name: 'Herbal Tea Pack',
    category: 'Wellness',
    price: 299,
    rating: 4.5,
    image: HerbalTeaPack,
    section: 'bestsellers',
  },
  {
    id: 104,
    name: 'Herbal Supplements',
    category: 'Wellness',
    price: 599,
    rating: 4.6,
    image: Herbalsupplements,
    section: 'bestsellers',
  },
  {
    id: 105,
    name: 'Massage Roller',
    category: 'Wellness',
    price: 349,
    rating: 4.4,
    image: MassageRoller,
    section: 'newarrivals',
  },
  {
    id: 106,
    name: 'Meditation Cushion',
    category: 'Wellness',
    price: 799,
    rating: 4.9,
    image: MeditationCushion,
    section: 'newarrivals',
  },
  {
    id: 107,
    name: 'Organic Face Serum',
    category: 'Wellness',
    price: 699,
    rating: 4.7,
    image: OrganicFaceSerum,
    section: 'newarrivals',
  },
  {
    id: 108,
    name: 'Vegan Soap',
    category: 'Wellness',
    price: 199,
    rating: 4.5,
    image: VeganSoap,
    section: 'trending',
  },
  {
    id: 109,
    name: 'Wellness Gift Box',
    category: 'Wellness',
    price: 1499,
    rating: 4.8,
    image: WellnessGiftBox,
    section: 'trending',
  },
  {
    id: 110,
    name: 'Skincare Cream',
    category: 'Wellness',
    price: 549,
    rating: 4.6,
    image: skincarecream,
    section: 'trending',
  },
  {
    id: 111,
    name: 'Yoga Mat',
    category: 'Wellness',
    price: 899,
    rating: 4.8,
    image: yogamat,
    section: 'trending',
  },
];
