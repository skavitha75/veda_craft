import { MapPin, ChevronDown } from 'lucide-react';

export default function LocationSelector() {
  return (
    <div className="flex items-center gap-1 cursor-pointer group min-w-[140px]">
      <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
      <div className="flex flex-col leading-tight">
        <span className="text-[10px] text-green-600 font-semibold">Delivery In 2 days</span>
        <div className="flex items-center gap-0.5">
          <span className="text-xs text-gray-700 font-medium">364, Tirunelveli</span>
          <ChevronDown className="w-3 h-3 text-gray-500" />
        </div>
      </div>
    </div>
  );
}
