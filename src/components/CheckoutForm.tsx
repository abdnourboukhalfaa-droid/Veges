import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowLeft, Send, CheckCircle2, Phone, MapPin, Truck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem, Order, OrderItem, StoreSettings } from '../types';
import { ALGERIA_WILAYAS } from '../data';

interface CheckoutFormProps {
  language: 'ar' | 'en';
  cartItems: CartItem[];
  storeSettings: StoreSettings;
  onBackToCart: () => void;
  onSubmitOrder: (order: Order, sendToWhatsApp: boolean) => void;
}

export default function CheckoutForm({
  language,
  cartItems,
  storeSettings,
  onBackToCart,
  onSubmitOrder,
}: CheckoutFormProps) {
  const isAr = language === 'ar';
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('22 - سيدي بلعباس');
  const [commune, setCommune] = useState('');
  const [addressDetails, setAddressDetails] = useState('');
  const [deliveryType, setDeliveryType] = useState<'home' | 'office'>('home');
  const [validationError, setValidationError] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // Calculate delivery fee dynamically based on Wilaya
  // If Wilaya is Sidi Bel Abbes (code 22), local delivery fee is applied, else national fee is applied.
  const isBelAbbes = selectedWilaya.includes('22');
  const deliveryFee = isBelAbbes 
    ? storeSettings.deliveryFeeBelAbbes 
    : storeSettings.deliveryFeeOtherWilayas;

  const total = subtotal + deliveryFee;

  const handleCheckoutSubmit = (e: React.FormEvent, sendToWhatsApp: boolean) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !commune.trim() || !addressDetails.trim()) {
      setValidationError(isAr ? 'يرجى ملء جميع الحقول المطلوبة لتأكيد الطلب.' : 'Please fill all required fields to submit order.');
      return;
    }

    setValidationError('');

    const orderItems: OrderItem[] = cartItems.map(item => ({
      productId: item.product.id,
      productNameAr: item.product.nameAr,
      productNameEn: item.product.nameEn,
      price: item.product.price,
      quantity: item.quantity,
      selectedSize: item.selectedSize,
      selectedColor: item.selectedColor
    }));

    const newOrder: Order = {
      id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: fullName,
      customerPhone: phone,
      customerWilaya: selectedWilaya,
      customerCommune: commune,
      customerAddress: addressDetails,
      deliveryType,
      items: orderItems,
      subtotal,
      deliveryFee,
      total,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    onSubmitOrder(newOrder, sendToWhatsApp);
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xl" id="checkout-form-shell">
      <div className="p-6 bg-slate-950 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToCart}
            className="p-2 hover:bg-white/10 rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-black">{isAr ? 'تأكيد طلب الشراء' : 'Confirm Purchase Order'}</h1>
            <p className="text-[10px] text-slate-300 mt-0.5">{isAr ? 'يرجى ملء تفاصيل الشحن والتوصيل' : 'Please provide your shipping and delivery details'}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs bg-red-600 px-3 py-1.5 rounded-full border border-red-500 font-bold">
          <Truck className="w-3.5 h-3.5 animate-pulse" />
          <span>{isAr ? 'الدفع عند الاستلام' : 'Cash on Delivery'}</span>
        </div>
      </div>

      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Details */}
        <form className="lg:col-span-7 space-y-5">
          {validationError && (
            <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs flex items-center gap-2 font-bold animate-pulse">
              <AlertCircle className="w-4.5 h-4.5 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Customer Info */}
          <div>
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">
              {isAr ? '1. المعلومات الشخصية' : '1. Personal Information'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">{isAr ? 'الاسم واللقب الكامـل *' : 'Full Name *'}</label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'مثال: عبد النور دانون' : 'Abdenour Danone'}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs px-3.5 py-3 rounded-xl outline-none focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/5 text-slate-900 transition-all font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">{isAr ? 'رقم الهاتف (النشط) *' : 'Active Phone Number *'}</label>
                <div className="relative">
                  <input
                    type="tel"
                    required
                    placeholder="0555 12 34 56"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-xs px-3.5 py-3 rounded-xl outline-none focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/5 text-slate-900 transition-all font-semibold"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-3.5" />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Area Details */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">
              {isAr ? '2. معلومات الشحن والولاية' : '2. Shipping & Wilaya Details'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">{isAr ? 'الولاية *' : 'Wilaya *'}</label>
                <select
                  value={selectedWilaya}
                  onChange={(e) => setSelectedWilaya(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs px-2.5 py-3 rounded-xl outline-none focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/5 text-slate-900 transition-all cursor-pointer font-semibold"
                >
                  {ALGERIA_WILAYAS.map(w => (
                    <option key={w.code} value={w.nameEn}>
                      {isAr ? w.nameAr : w.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">{isAr ? 'البلدية أو الدائرة *' : 'Commune / District *'}</label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'مثال: سيدي الجيلالي' : 'Sidi Djillali'}
                  value={commune}
                  onChange={(e) => setCommune(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs px-3.5 py-3 rounded-xl outline-none focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/5 text-slate-900 transition-all font-semibold"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 mt-4">
              <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">{isAr ? 'العنوان التفصيلي (الشارع والحي ورقم الباب) *' : 'Detailed Address (Street & House No.) *'}</label>
              <textarea
                required
                rows={2}
                placeholder={isAr ? 'مثال: شارع سيدي الجيلالي، عمارة 4، شقة 12، سيدي بلعباس' : 'e.g. Sidi Djillali Street, Building 4, Apartment 12'}
                value={addressDetails}
                onChange={(e) => setAddressDetails(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs px-3.5 py-3 rounded-xl outline-none focus:border-red-600 focus:bg-white focus:ring-4 focus:ring-red-600/5 text-slate-900 transition-all font-semibold resize-none"
              />
            </div>
          </div>

          {/* Delivery Option */}
          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-3">
              {isAr ? '3. خيار التوصيل المفضل' : '3. Preferred Delivery Option'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDeliveryType('home')}
                className={`p-3 rounded-xl border text-right sm:text-left transition-all cursor-pointer ${
                  deliveryType === 'home'
                    ? 'border-red-600 bg-red-50/50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className={`w-4 h-4 ${deliveryType === 'home' ? 'text-red-600' : 'text-slate-400'}`} />
                  <span className="text-xs font-black text-slate-900">{isAr ? 'توصيل لباب المنزل' : 'Home Delivery'}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  {isAr ? 'توصيل مباشر لعنوان إقامتك الموضح أعلاه.' : 'Delivered directly to your residence address.'}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryType('office')}
                className={`p-3 rounded-xl border text-right sm:text-left transition-all cursor-pointer ${
                  deliveryType === 'office'
                    ? 'border-red-600 bg-red-50/50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Truck className={`w-4 h-4 ${deliveryType === 'office' ? 'text-red-600' : 'text-slate-400'}`} />
                  <span className="text-xs font-black text-slate-900">{isAr ? 'استلام من مكتب الشحن' : 'Yalidine Office'}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                  {isAr ? 'الاستلام من مكتب ياليدين Yalidine في ولايتك.' : 'Pick up from nearest Yalidine agency.'}
                </p>
              </button>
            </div>
          </div>
        </form>

        {/* Right Column: Order Summary Deck & Submit Actions */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-slate-55 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl border border-slate-200/60 p-5 space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-900 tracking-wider flex items-center gap-2 border-b border-slate-200 pb-3">
              <ShoppingBag className="w-4 h-4 text-slate-600" />
              <span>{isAr ? 'ملخص الطلب المالي' : 'Order Cost Summary'}</span>
            </h3>

            {/* List of checkout items */}
            <div className="max-h-40 overflow-y-auto space-y-3 pr-1">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start gap-2 text-xs">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 line-clamp-1">{isAr ? item.product.nameAr : item.product.nameEn}</h4>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                      {isAr ? `مقاس: ${item.selectedSize} • كمية: ${item.quantity}x` : `Size: ${item.selectedSize} • Qty: ${item.quantity}x`}
                    </span>
                  </div>
                  <span className="font-mono font-black text-slate-950 shrink-0">
                    {item.product.price * item.quantity} DA
                  </span>
                </div>
              ))}
            </div>

            {/* Price breakdown details */}
            <div className="pt-4 border-t border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-500 font-semibold">
                <span>{isAr ? 'مجموع السلع:' : 'Items total:'}</span>
                <span className="font-mono text-slate-800">{subtotal} DA</span>
              </div>
              <div className="flex justify-between text-slate-500 font-semibold">
                <span>{isAr ? 'تكلفة التوصيل الشحن:' : 'Delivery fee:'}</span>
                <span className="font-mono text-slate-800">+{deliveryFee} DA</span>
              </div>
              
              {isBelAbbes && (
                <span className="text-[9px] text-red-600 font-black bg-red-50 border border-red-100 px-2 py-0.5 rounded-md inline-block">
                  📍 {isAr ? 'سعر خاص بزبائن سيدي بلعباس' : 'Special local SBA shipping fee'}
                </span>
              )}

              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline text-sm font-black text-slate-900">
                <span>{isAr ? 'المجموع المستحق للدفع:' : 'Total Payable amount:'}</span>
                <span className="text-red-600 text-lg font-mono">{total} DA</span>
              </div>
            </div>
          </div>

          {/* Secure and Trust details */}
          <div className="p-4 bg-emerald-50/50 border border-emerald-100/60 rounded-2xl flex gap-3 text-[11px] text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-emerald-950">{isAr ? 'تأمين معاينة المشتريات' : 'Inspect before paying'}</span>
              <p className="mt-0.5 leading-relaxed text-emerald-700">
                {isAr 
                  ? 'يمكنك فحص الملابس، التحقق من القماش والمقاس، ثم الدفع عند الاستلام لمنقذ ياليدين أو كابتن التوصيل.' 
                  : 'You have full rights to check fabric and size. Pay only when you are 100% satisfied.'}
              </p>
            </div>
          </div>

          {/* Dual Checkout Action Buttons */}
          <div className="space-y-3">
            {/* 1. Order via WhatsApp */}
            <button
              onClick={(e) => handleCheckoutSubmit(e, true)}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl transition-all duration-300 shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 hover:scale-[1.01] cursor-pointer"
            >
              <Send className="w-4 h-4 text-emerald-200 animate-pulse" />
              <span>{isAr ? 'أرسل الطلب مباشرة بالواتساب' : 'Submit & Send via WhatsApp'}</span>
            </button>

            {/* 2. Direct Simulated Checkout Order */}
            <button
              onClick={(e) => handleCheckoutSubmit(e, false)}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs rounded-2xl transition-all duration-300 shadow-xl shadow-slate-900/10 flex items-center justify-center gap-2 hover:scale-[1.01] cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-red-500" />
              <span>{isAr ? 'تأكيد طلب الشراء الفوري هنا' : 'Instant Direct Checkout Here'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
