import { useState, useEffect } from 'react';
import { Link, useSearchParams, useLocation } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useCart, type CartItem } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import CheckoutStepper from '../components/Checkout/CheckoutStepper';
import AddressStep from '../components/Checkout/AddressStep';
import OrderSummaryStep from '../components/Checkout/OrderSummaryStep';
import PaymentStep from '../components/Checkout/PaymentStep';
import PriceSummaryPanel from '../components/Checkout/PriceSummaryPanel';
import AddAddressDrawer from '../components/Checkout/AddAddressDrawer';
import type { Address } from '../components/Checkout/AddAddressDrawer';
import { saveOrder } from '../services/orderStorage';
import { supabase } from '../lib/supabase';
import { checkDeliveryState, type DeliveryAvailability } from '../services/deliveryApi';

const STEP_KEYS = ['address', 'summary', 'payment'] as const;

type BrowserAudioContext = typeof AudioContext;
type AudioWindow = Window & {
  AudioContext?: BrowserAudioContext;
  webkitAudioContext?: BrowserAudioContext;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Razorpay?: any;
};

function loadScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function createOrderPlacedSound() {
  const audioWindow = window as AudioWindow;
  const AudioContextClass: BrowserAudioContext | undefined =
    audioWindow.AudioContext || audioWindow.webkitAudioContext;

  if (!AudioContextClass) return null;

  const audioContext = new AudioContextClass();

  return async () => {
    try {
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const now = audioContext.currentTime;
      const notes = [
        { frequency: 523.25, start: 0 },
        { frequency: 659.25, start: 0.11 },
        { frequency: 783.99, start: 0.22 },
      ];

      notes.forEach(({ frequency, start }) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, now + start);
        gain.gain.setValueAtTime(0.0001, now + start);
        gain.gain.exponentialRampToValueAtTime(0.18, now + start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + start + 0.24);

        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(now + start);
        oscillator.stop(now + start + 0.26);
      });
    } catch (error) {
      console.error('Failed to play order sound', error);
    }
  };
}

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const { t } = useTranslation();
  const {
    user,
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    selectedLocation,
    updateLocation,
  } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Buy Now item comes from router state — guaranteed to be present immediately
  const buyNowItem: CartItem | null = (location.state as { buyNowItem?: CartItem })?.buyNowItem ?? null;

  // Determine checkout items: Buy Now single item or full cart
  const isBuyNow = !!buyNowItem;
  const checkoutItems: CartItem[] = isBuyNow ? [buyNowItem] : items;

  // Step management (1=address, 2=summary, 3=payment)
  const stepFromUrl = STEP_KEYS.indexOf(
    searchParams.get('step') as (typeof STEP_KEYS)[number]
  );
  const [currentStep, setCurrentStep] = useState(() => {
    if (stepFromUrl >= 0) return stepFromUrl + 1;
    // For Buy Now, if user already has an address, go straight to order summary (step 2)
    if (isBuyNow && addresses.length > 0) return 2;
    return 1;
  });

  // Selected address
  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    if (selectedLocation.type === 'address') {
      return selectedLocation.value;
    }
    return addresses.length > 0 ? addresses[0].id : '';
  });

  // Payment
  const [selectedPayment, setSelectedPayment] = useState('');

  // Address drawer
  const [isAddressDrawerOpen, setIsAddressDrawerOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Order placed state
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Delivery Availability State
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryAvailability | null>(null);

  // Sync URL with step
  useEffect(() => {
    const key = STEP_KEYS[currentStep - 1];
    if (key) {
      setSearchParams({ step: key }, { replace: true, state: location.state });
    }
  }, [currentStep, setSearchParams, location.state]);

  // Keep selectedAddressId valid
  useEffect(() => {
    if (
      addresses.length > 0 &&
      !addresses.find((a) => a.id === selectedAddressId)
    ) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  useEffect(() => {
    if (selectedAddress?.state) {
      checkDeliveryState(selectedAddress.state).then(setDeliveryInfo);
    } else {
      setDeliveryInfo(null);
    }
  }, [selectedAddress?.state]);

  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setIsAddressDrawerOpen(true);
  };

  const handleOpenEditAddress = (address: Address) => {
    setEditingAddress(address);
    setIsAddressDrawerOpen(true);
  };

  const handleCloseAddressDrawer = () => {
    setIsAddressDrawerOpen(false);
    setEditingAddress(null);
  };

  const handleSaveAddress = async (newAddress: Address) => {
    try {
      if (editingAddress) {
        await updateAddress(newAddress);
        setSelectedAddressId(newAddress.id);
        updateLocation({
          type: 'address',
          value: newAddress.id,
          text: `${newAddress.city} - ${newAddress.pincode}`,
        });
        handleCloseAddressDrawer();
        return;
      }

      const { id, ...addressDataToSave } = newAddress;
      const created = await addAddress(addressDataToSave);
      updateLocation({
        type: 'address',
        value: created.id,
        text: `${created.city} - ${created.pincode}`,
      });
      setSelectedAddressId(created.id);
      handleCloseAddressDrawer();
    } catch (e) {
      console.error("Failed to save address", e);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    const shouldDelete = window.confirm('Delete this address?');
    if (!shouldDelete) return;

    try {
      await deleteAddress(id);

      if (selectedAddressId === id) {
        const nextAddress = addresses.find((address) => address.id !== id);
        if (nextAddress) {
          setSelectedAddressId(nextAddress.id);
          updateLocation({
            type: 'address',
            value: nextAddress.id,
            text: `${nextAddress.city} - ${nextAddress.pincode}`,
          });
        } else {
          setSelectedAddressId('');
          updateLocation({ type: 'pincode', value: '627002', text: 'Tirunelveli - 627002' });
        }
      }
    } catch (e) {
      console.error("Failed to delete address", e);
    }
  };

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
    const addr = addresses.find((a) => a.id === id);
    if (addr) {
      updateLocation({
        type: 'address',
        value: id,
        text: `${addr.city} - ${addr.pincode}`,
      });
    }
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const finalizeOrder = async (
    token: string | undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    playOrderPlacedSound: any,
    total: number,
    itemCount: number,
    firstProduct: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    razorpayDetails?: any
  ) => {
    const payload = {
      items: checkoutItems,
      address: selectedAddress,
      paymentMethod: selectedPayment,
      total,
      itemCount,
      product:
        checkoutItems.length > 1
          ? `${firstProduct} + ${checkoutItems.length - 1} more`
          : firstProduct,
      ...razorpayDetails,
    };

    await saveOrder({
      userId: user?.id,
      ...payload,
    });

    if (token) {
      try {
        const url = razorpayDetails
          ? 'http://localhost:5000/api/v1/payment/verify'
          : 'http://localhost:5000/api/v1/orders';

        await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        console.warn('Order backend sync failed', error);
      }
    }

    if (!isBuyNow) {
      clearCart();
    }

    setOrderPlaced(true);
    void playOrderPlacedSound?.();
  };

  const handleContinue = async () => {
    if (currentStep === 3) {
      const playOrderPlacedSound = createOrderPlacedSound();
      const total = checkoutItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      const itemCount = checkoutItems.reduce((acc, item) => acc + item.quantity, 0);
      const firstProduct = checkoutItems[0]?.name || 'Vedha Craft Order';

      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (selectedPayment !== 'cod') {
        // Razorpay Flow
        try {
          const res = await fetch('http://localhost:5000/api/v1/payment/create-order', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({ amount: total }),
          });

          const data = await res.json();
          if (!data.success) {
            alert('Failed to initiate payment. Please try again.');
            return;
          }

          const isLoaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
          if (!isLoaded) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
          }

          const options = {
            key: data.data.key_id || 'rzp_test_your_key_id', // Add your Razorpay Key ID
            amount: data.data.amount,
            currency: data.data.currency,
            name: 'VedaCraft',
            description: 'Test Transaction',
            order_id: data.data.id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handler: async function (response: any) {
              await finalizeOrder(token, playOrderPlacedSound, total, itemCount, firstProduct, {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              });
            },
            prefill: {
              name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || '',
              email: user?.email || '',
              contact: selectedAddress?.phoneNumber || '',
            },
            theme: {
              color: '#16a34a',
            },
          };

          const paymentObject = new window.Razorpay(options);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          paymentObject.on('payment.failed', function (response: any) {
            alert(`Payment failed: ${response.error.description}`);
          });
          paymentObject.open();
        } catch (err) {
          console.error('Payment initialization error', err);
          alert('Failed to start payment process.');
        }
        return;
      }

      // COD Flow
      await finalizeOrder(token, playOrderPlacedSound, total, itemCount, firstProduct);
      return;
    }
    goToStep(currentStep + 1);
  };

  const canContinue = (() => {
    if (deliveryInfo && !deliveryInfo.is_active) return false;
    if (currentStep === 1) return !!selectedAddress;
    if (currentStep === 2) return checkoutItems.length > 0;
    if (currentStep === 3) return !!selectedPayment;
    return false;
  })();

  // Empty state
  if (checkoutItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('checkout.noItems')}
          </h2>
          <p className="text-gray-500 mb-6">{t('checkout.noItemsDesc')}</p>
          <Link
            to="/"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded font-semibold transition-colors shadow-md shadow-green-200"
          >
            {t('checkout.continueShopping')}
          </Link>
        </div>
      </div>
    );
  }

  // Order placed success state
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t('checkout.orderPlaced')}
          </h2>
          <p className="text-gray-500 mb-8">{t('checkout.orderPlacedDesc')}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/profile/orders"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded font-semibold transition-colors shadow-md shadow-green-200"
            >
              {t('checkout.viewOrders')}
            </Link>
            <Link
              to="/"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded font-semibold hover:bg-gray-50 transition-colors"
            >
              {t('checkout.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back + Title */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/"
            className="p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-600"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            {t('checkout.title')}
          </h1>
          {isBuyNow && (
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
              Buy Now
            </span>
          )}
        </div>

        {/* Stepper */}
        <CheckoutStepper currentStep={currentStep} onStepClick={goToStep} />

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column: Step Content */}
          <div className="flex-1 min-w-0">
            {/* Step 1: Address */}
            {currentStep === 1 && (
              <AddressStep
                selectedAddressId={selectedAddressId}
                onSelectAddress={handleSelectAddress}
                onAddAddress={handleOpenAddAddress}
                onEditAddress={handleOpenEditAddress}
                onDeleteAddress={handleDeleteAddress}
                onContinue={() => goToStep(2)}
              />
            )}

            {/* Step 2: Order Summary */}
            {currentStep === 2 && (
              <OrderSummaryStep
                selectedAddress={selectedAddress}
                items={checkoutItems}
                onChangeAddress={() => goToStep(1)}
                onContinue={() => goToStep(3)}
                isBuyNow={isBuyNow}
              />
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <PaymentStep
                selectedAddress={selectedAddress}
                items={checkoutItems}
                onChangeAddress={() => goToStep(1)}
                onChangeSummary={() => goToStep(2)}
                selectedPayment={selectedPayment}
                onSelectPayment={setSelectedPayment}
              />
            )}
          </div>

          {/* Right Column: Price Summary */}
          <PriceSummaryPanel
            items={checkoutItems}
            currentStep={currentStep}
            onContinue={handleContinue}
            canContinue={canContinue}
            isBuyNow={isBuyNow}
            deliveryInfo={deliveryInfo}
          />
        </div>
      </div>

      {/* Address Drawer */}
      <AddAddressDrawer
        isOpen={isAddressDrawerOpen}
        onClose={handleCloseAddressDrawer}
        onSave={handleSaveAddress}
        initialAddress={editingAddress}
      />
    </div>
  );
}
