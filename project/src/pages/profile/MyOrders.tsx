import { ShoppingBag, ChevronRight, Package } from 'lucide-react';

const mockOrders = [
  {
    id: 'ORD-2024-001',
    date: '12 Jun 2024',
    status: 'Delivered',
    statusColor: 'text-green-600 bg-green-50',
    total: '₹1,250',
    items: 3,
    product: 'Handcrafted Wooden Decor',
  },
  {
    id: 'ORD-2024-002',
    date: '05 Jun 2024',
    status: 'In Transit',
    statusColor: 'text-blue-600 bg-blue-50',
    total: '₹890',
    items: 2,
    product: 'Organic Wellness Kit',
  },
  {
    id: 'ORD-2024-003',
    date: '28 May 2024',
    status: 'Cancelled',
    statusColor: 'text-red-500 bg-red-50',
    total: '₹450',
    items: 1,
    product: 'Eco-Friendly Tote Bag',
  },
];

export default function MyOrders() {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center gap-2 mb-5">
          <ShoppingBag className="w-5 h-5 text-[#2d6a2d]" />
          <h3 className="text-base font-semibold text-gray-900">My Orders</h3>
        </div>

        {mockOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No orders yet</p>
            <p className="text-gray-400 text-sm mt-1">Your orders will appear here</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {mockOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 rounded-lg border border-gray-100
                           hover:border-gray-200 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#f0f5ec] flex items-center justify-center">
                    <Package className="w-5 h-5 text-[#2d6a2d]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{order.product}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {order.id} &nbsp;·&nbsp; {order.date} &nbsp;·&nbsp; {order.items} item{order.items > 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-gray-900">{order.total}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
