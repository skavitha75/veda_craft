import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  CreditCard,
  Home,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
  XCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getOrderById, type SavedOrder, updateOrderStatus } from '../../services/orderStorage';

const trackingSteps = [
  { label: 'Processing', icon: Check },
  { label: 'Packed', icon: Package },
  { label: 'Shipped', icon: Truck },
  { label: 'Out of Delivery', icon: ShoppingBag },
  { label: 'Delivered', icon: Home },
];

function formatDisplayDate(date: string) {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function addDays(date: string, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate.toISOString();
}

function getActiveStep(status: SavedOrder['status']) {
  if (status === 'Delivered') return 4;
  if (status === 'In Transit') return 2;
  if (status === 'Cancelled') return 0;
  return 1;
}

export default function OrderTrackingPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<SavedOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  useEffect(() => {
    let isActive = true;

    const loadOrder = async () => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      const nextOrder = await getOrderById(orderId, user?.id);
      if (isActive) {
        setOrder(nextOrder);
        setIsLoading(false);
      }
    };

    void loadOrder();

    return () => {
      isActive = false;
    };
  }, [orderId, user?.id]);

  const activeStep = useMemo(() => (order ? getActiveStep(order.status) : 0), [order]);
  const expectedDate = order ? addDays(order.createdAt, order.status === 'In Transit' ? 2 : 3) : '';
  const totalQuantity = order?.items.reduce((total, item) => total + item.quantity, 0) ?? 0;
  const canCancel = order?.status !== 'Delivered' && order?.status !== 'Cancelled';

  const handleCancelOrder = async () => {
    if (!order || !canCancel) return;

    const shouldCancel = window.confirm('Cancel this order?');
    if (!shouldCancel) return;

    setIsCancelling(true);
    setCancelError('');

    const updatedOrder = await updateOrderStatus(order.id, 'Cancelled', user?.id);
    if (updatedOrder) {
      setOrder(updatedOrder);
    } else {
      setCancelError('Unable to cancel this order right now.');
    }

    setIsCancelling(false);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-sm text-gray-500">
        Loading order tracking...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
        <p className="text-base font-semibold text-gray-900">Order not found</p>
        <Link to="/profile/orders" className="mt-3 inline-flex text-sm font-semibold text-[#2d6a2d]">
          Back to My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <button
            type="button"
            onClick={() => navigate('/profile/orders')}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-800 hover:text-[#2d6a2d] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Tracking #{order.id}
          </button>
          <p className="text-xs font-medium text-gray-500 mt-3">
            Placed on {formatDisplayDate(order.createdAt)}
          </p>
        </div>

        <div className="flex flex-col sm:items-end gap-2">
          <span
            className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold ${
              order.status === 'Cancelled'
                ? 'bg-red-50 text-red-600'
                : order.status === 'Delivered'
                  ? 'bg-green-50 text-green-700'
                  : 'bg-yellow-50 text-yellow-700'
            }`}
          >
            {order.status}
          </span>
          {canCancel && (
            <button
              type="button"
              onClick={handleCancelOrder}
              disabled={isCancelling}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <XCircle className="w-4 h-4" />
              {isCancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>

      {cancelError && (
        <div className="mb-5 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          {cancelError}
        </div>
      )}

      <div className="relative grid grid-cols-5 gap-2 mb-8">
        <div className="absolute left-[10%] right-[10%] top-5 h-px bg-gray-200" />
        <div
          className="absolute left-[10%] top-5 h-px bg-[#2d8f3a] transition-all"
          style={{ width: `${Math.min(activeStep / (trackingSteps.length - 1), 1) * 80}%` }}
        />
        {trackingSteps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= activeStep;
          return (
            <div key={step.label} className="relative flex flex-col items-center gap-2 text-center">
              <div
                className={`w-10 h-10 rounded-full border flex items-center justify-center bg-white ${
                  isActive ? 'border-[#2d8f3a] text-[#2d8f3a]' : 'border-yellow-200 text-yellow-300'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-xs sm:text-sm font-semibold ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      <div
        className={`rounded-lg p-4 flex items-start gap-3 mb-5 ${
          order.status === 'Cancelled'
            ? 'border border-red-100 bg-red-50'
            : 'border border-yellow-200 bg-yellow-50/30'
        }`}
      >
        {order.status === 'Cancelled' ? (
          <XCircle className="w-7 h-7 text-red-500 flex-shrink-0 mt-0.5" />
        ) : (
          <Truck className="w-7 h-7 text-yellow-500 flex-shrink-0 mt-0.5" />
        )}
        <div>
          <p className={`text-sm font-bold ${order.status === 'Cancelled' ? 'text-red-600' : 'text-[#2d8f3a]'}`}>
            {order.status === 'Cancelled'
              ? 'Your order has been cancelled'
              : order.status === 'Delivered'
              ? `Delivered on ${formatDisplayDate(order.createdAt)}`
              : `Arriving by ${formatDisplayDate(expectedDate)}`}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {order.status === 'Cancelled'
              ? 'This order will not be shipped.'
              : 'Your order is on the way and will be delivered soon.'}
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-7">
        <section className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-[#2d8f3a] mb-3">
            <MapPin className="w-4 h-4" />
            <h3 className="text-sm font-bold text-gray-900">Delivery Address</h3>
          </div>
          {order.address ? (
            <div className="text-sm text-gray-700 leading-6">
              <p className="font-semibold text-gray-900">{order.address.fullName}</p>
              <p>
                {order.address.address}
                {order.address.landmark ? `, ${order.address.landmark}` : ''}
              </p>
              <p>
                {order.address.city}, {order.address.state} - {order.address.pincode}
              </p>
              <p>{order.address.phoneNumber}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Delivery address not available</p>
          )}
        </section>

        <section className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-[#2d8f3a] mb-3">
            <CreditCard className="w-4 h-4" />
            <h3 className="text-sm font-bold text-gray-900">Order Details</h3>
          </div>
          <dl className="grid grid-cols-[90px_1fr] gap-y-2 text-sm">
            <dt className="text-gray-500">Items:</dt>
            <dd className="font-semibold text-gray-900">{totalQuantity || order.itemCount}</dd>
            <dt className="text-gray-500">Payment:</dt>
            <dd className="font-semibold text-gray-900">{order.paymentMethod}</dd>
            <dt className="text-gray-500">Total:</dt>
            <dd className="font-semibold text-gray-900">&#8377;{order.total.toLocaleString('en-IN')}</dd>
          </dl>
        </section>
      </div>

      <section>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Order Items</h3>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {order.items.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">Item details not available</p>
          ) : (
            order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 border-b border-gray-100 last:border-b-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 rounded-md object-cover border border-gray-100"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    &#8377;{item.price.toLocaleString('en-IN')} &nbsp; Quantity: {item.quantity}
                  </p>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  &#8377;{(item.price * item.quantity).toLocaleString('en-IN')}
                </p>
              </div>
            ))
          )}
          <div className="flex justify-between px-4 py-3 bg-gray-50 text-sm font-bold text-gray-900">
            <span>Total Amount:</span>
            <span>&#8377;{order.total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
