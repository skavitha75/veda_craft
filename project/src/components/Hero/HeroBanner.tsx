import { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import bannerImg from '../../assets/banners/banner2.jpeg';

const banners = [
  {
    id: 'eco',
    title: 'Eco - Friendly choices,\nbeautiful impact',
    subtitle: 'Discover thoughtfully crafted products that are kind to the planet and support skilled artisans and communities.',
    buttonText: 'Shop Eco Products',
    link: '/eco',
    image: bannerImg, // Local image from assets
    titleColor: 'text-green-800',
    btnColor: 'bg-green-600 hover:bg-green-700',
  },
  {
    id: 'wellness',
    title: 'Nourish Your Mind,\nBody & Soul',
    subtitle: 'Explore our natural wellness collection for a balanced and peaceful lifestyle.',
    buttonText: 'Shop Wellness',
    link: '/wellness',
    image: 'https://images.pexels.com/photos/3735149/pexels-photo-3735149.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    titleColor: 'text-teal-800',
    btnColor: 'bg-teal-600 hover:bg-teal-700',
  },
  {
    id: 'food',
    title: 'Taste the Purity\nof Nature',
    subtitle: 'Ethically sourced, organic food items brought directly from the farm to your table.',
    buttonText: 'Shop Organic Food',
    link: '/food',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    titleColor: 'text-orange-800',
    btnColor: 'bg-orange-600 hover:bg-orange-700',
  },
  {
    id: 'craft',
    title: 'Discover Unique\nArtisan Crafts',
    subtitle: 'Masterpieces handcrafted by skilled artisans, preserving ancient traditions and culture.',
    buttonText: 'Shop Crafts',
    link: '/craft',
    image: 'https://images.pexels.com/photos/4202325/pexels-photo-4202325.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    titleColor: 'text-purple-800',
    btnColor: 'bg-purple-600 hover:bg-purple-700',
  },
  {
    id: 'fashion',
    title: 'Sustainable &\nEthical Fashion',
    subtitle: 'Express yourself with eco-friendly clothing that looks good and does good.',
    buttonText: 'Shop Fashion',
    link: '/fashion',
    image: 'https://images.pexels.com/photos/6044266/pexels-photo-6044266.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    titleColor: 'text-rose-800',
    btnColor: 'bg-rose-600 hover:bg-rose-700',
  },
  {
    id: 'decor',
    title: 'Handcrafted Decor\nfor Your Home',
    subtitle: 'Transform your space with beautiful, rustic decor that tells a unique story.',
    buttonText: 'Shop Decor',
    link: '/decor',
    image: 'https://images.pexels.com/photos/3094218/pexels-photo-3094218.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    titleColor: 'text-amber-800',
    btnColor: 'bg-amber-600 hover:bg-amber-700',
  }
];

export default function HeroBanner() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000); // Change banner every 5 seconds
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <section className="w-full relative overflow-hidden bg-gray-100 group">
      <div 
        className="flex transition-transform duration-700 ease-in-out h-[280px] md:h-[360px] lg:h-[400px]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {banners.map((banner, index) => (
          <div key={banner.id} className="w-full h-full flex-shrink-0 relative">
            <img
              src={banner.image}
              alt={banner.title.replace('\n', ' ')}
              className="w-full h-full object-cover object-center"
            />
            
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/40 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
                <div 
                  className={`max-w-md transition-all duration-700 delay-300 transform ${
                    index === currentIndex ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}
                >
                  <h1 className={`text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight mb-3 whitespace-pre-line ${banner.titleColor}`}>
                    {banner.title}
                  </h1>
                  <p className="text-sm md:text-base text-gray-800 font-medium mb-6 leading-relaxed max-w-sm">
                    {banner.subtitle}
                  </p>
                  <button
                    onClick={() => navigate(banner.link)}
                    className={`inline-flex items-center gap-2 active:scale-95 text-white font-semibold text-sm px-6 py-3 rounded-md transition-all duration-200 shadow-md hover:shadow-lg group/btn ${banner.btnColor}`}
                  >
                    {banner.buttonText}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/50 hover:bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-800 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/50 hover:bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-800 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentIndex 
                ? 'w-6 h-2 bg-green-600' 
                : 'w-2 h-2 bg-gray-400 hover:bg-gray-600'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
