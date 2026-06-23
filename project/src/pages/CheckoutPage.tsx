import React, { useState, useEffect } from 'react';
import { Trash2, Star, MapPin, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import AddAddressDrawer, { Address } from '../components/Checkout/AddAddressDrawer';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

export default function CheckoutPage() {
  const { items, updateQuantity, removeFromCart } = useCart();
  const { t } = useTranslation();
  const { addresses, addAddress, selectedLocation, updateLocation } = useAuth();

  const [selectedAddressId, setSelectedAddressId] = useState<string>(() => {
    if (selectedLocation.type === 'address') {
      return selectedLocation.value;
    }
    return addresses.length > 0 ? addresses[0].id : '';
  });
  
  const [isAddressDrawerOpen, setIsAddressDrawerOpen] = useState(false);

  useEffect(() => {
    if (addresses.length > 0 && !addresses.find(a => a.id === selectedAddressId)) {
      setSelectedAddressId(addresses[0].id);
    }
  }, [addresses, selectedAddressId]);

  const handleSaveAddress = (newAddress: Omit<Address, 'id'>) => {
    const created = addAddress(newAddress);
    setSelectedAddressId(created.id);
    updateLocation({
      type: 'address',
      value: created.id,
      text: `${created.city} - ${created.pincode}`
    });
    setIsAddressDrawerOpen(false);
  };

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
    const addr = addresses.find(a => a.id === id);
    if (addr) {
      updateLocation({
        type: 'address',
        value: id,
        text: `${addr.city} - ${addr.pincode}`
      });
    }
  };

  const selectedAddress = addresses.find(a => a.id === selectedAddressId);

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const bagTotal = items.reduce((acc, item) => acc + (item.price * 2) * item.quantity, 0); 
  const discount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const youPay = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Address and Items */}
          <div className="flex-1 space-y-6">
            
            {/* Delivery Address Section */}
            <div className="bg-white p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  {t('checkout.deliveryAddress')}
                </h2>
                <button 
                  onClick={() => setIsAddressDrawerOpen(true)}
                  className="px-4 py-2 border border-gray-300 text-sm font-medium rounded hover:bg-gray-50 text-gray-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  {t('checkout.addAddress')}
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-gray-500 bg-gray-50 p-4 border border-dashed border-gray-300 rounded text-center">
                  <p>{t('checkout.noAddress')}</p>
                  <button 
                    onClick={() => setIsAddressDrawerOpen(true)}
                    className="text-green-600 font-medium mt-2 hover:underline"
                  >
                    {t('checkout.addNewAddress')}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label 
                      key={addr.id} 
                      className={`flex gap-4 p-4 border rounded cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'border-green-500 bg-green-50/30' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <div className="pt-1">
                        <input 
                          type="radio" 
                          name="selectedAddress" 
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={() => handleSelectAddress(addr.id)}
                          className="accent-green-600 w-4 h-4"
                        />
                      </div>
                      <div className="flex-1 text-sm text-gray-800">
                        <p className="font-medium text-gray-900 flex items-center gap-2 mb-1">
                          {addr.fullName}
                          <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {addr.addressType}
                          </span>
                        </p>
                        <p className="text-gray-600 mb-1">{addr.address}, {addr.landmark && `${addr.landmark},`} {addr.city}</p>
                        <p className="text-gray-600 mb-1">{addr.state} - {addr.pincode}</p>
                        <p className="text-gray-800 font-medium mt-2">{t('checkout.mobile')} {addr.phoneNumber}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Items List */}
            {items.length === 0 ? (
              <div className="bg-white p-8 border border-gray-200 text-center">
                <p className="text-gray-500 mb-4">{t('checkout.cartEmpty')}</p>
                <a href="/" className="inline-block bg-[#6cc24a] hover:bg-[#5db33e] text-white px-6 py-2 rounded font-medium transition-colors">
                  {t('checkout.continueShopping')}
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white p-4 border-b border-gray-200 text-gray-800 font-medium flex items-center justify-between">
                  <span>
                    {t('checkout.deliverTo')} {selectedAddress ? `${selectedAddress.city} - ${selectedAddress.pincode}` : t('checkout.selectAddress')}
                  </span>
                </div>
                {items.map((item) => (
                  <div key={item.id} className="bg-white p-4 border border-gray-200 flex flex-col sm:flex-row gap-4 relative">
                    {/* Image */}
                    <div className="w-24 h-24 flex-shrink-0 border border-gray-100 rounded-sm">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    {/* Item Details */}
                    <div className="flex-1 pr-8 flex flex-col justify-between">
                      <div>
                        <h3 className="text-gray-900 font-medium">{item.name}</h3>
                        {item.rating && (
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-xs text-gray-600 font-medium">{item.rating}</span>
                            <Star className="w-3 h-3 fill-green-600 text-green-600" />
                          </div>
                        )}
                        <div className="mt-4 flex items-center gap-2">
                          <label htmlFor={`quantity-${item.id}`} className="text-sm text-gray-600">{t('checkout.quantity')}</label>
                          <select 
                            id={`quantity-${item.id}`}
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                            className="text-sm border-none bg-transparent cursor-pointer focus:ring-0 text-gray-800 font-medium"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                              <option key={num} value={num}>{num}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      {/* Amount */}
                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center w-full">
                        <span className="text-sm text-gray-500">{t('checkout.amount')}</span>
                        <span className="font-bold text-gray-900">&#8377;{item.price * item.quantity}</span>
                      </div>
                    </div>
                    
                    {/* Remove Button */}
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Price Summary */}
          <div className="w-full lg:w-96">
            <div className="bg-white p-6 border border-gray-200 sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-1">{t('checkout.priceSummary')}</h2>
              <p className="text-xs text-gray-500 mb-6">{t('checkout.inclusiveTaxes')}</p>
              
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex justify-between items-center">
                  <span>{t('checkout.bagTotal')} ( {totalItems} {t('checkout.items')} )</span>
                  <span className="text-gray-900">&#8377;{bagTotal}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('cart.discount')}</span>
                  <span className="text-gray-900">-&#8377; {discount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('cart.subTotal')}</span>
                  <span className="text-gray-900">-&#8377; {discount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>{t('cart.convenience')}</span>
                  <span className="text-green-600 font-medium">{t('cart.free')}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-2 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">{t('checkout.youPay')}</span>
                  <span className="text-lg font-bold text-gray-900">&#8377;{youPay}</span>
                </div>
              </div>
              
              {items.length > 0 && (
                <button 
                  disabled={!selectedAddress}
                  className={`w-full mt-8 font-semibold py-3 rounded transition-colors ${
                    selectedAddress 
                      ? 'bg-[#6cc24a] hover:bg-[#5db33e] text-white' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {t('checkout.placeOrder')}
                </button>
              )}
            </div>
          </div>
          
        </div>
      </div>

      <AddAddressDrawer 
        isOpen={isAddressDrawerOpen} 
        onClose={() => setIsAddressDrawerOpen(false)} 
        onSave={handleSaveAddress}
      />
    </div>
  );
}
