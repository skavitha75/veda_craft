import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Eco', href: '/eco' },
  { label: 'Wellness', href: '/wellness' },
  { label: 'Food', href: '/food' },
  { label: 'Craft', href: '/craft' },
  { label: 'Fashion', href: '/fashion' },
  { label: 'Decor Items', href: '/decor' },
  { label: 'Seller', href: '#' },
];

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="w-full px-6 md:px-10">
        <ul className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {navItems.map((item) => (
            <li key={item.label} className="flex-shrink-0">
              <Link
                to={item.href}
                className="block px-5 py-3 text-sm font-medium text-gray-700 hover:text-green-600 hover:border-b-2 hover:border-green-500 transition-all whitespace-nowrap"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
