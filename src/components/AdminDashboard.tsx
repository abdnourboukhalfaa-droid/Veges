import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Package, TrendingUp, ShoppingCart, DollarSign, Settings, Plus, Trash2, Check, RefreshCw, X, Edit, Phone, Send } from 'lucide-react';
import { Product, Order, StoreSettings, CategoryType } from '../types';

interface AdminDashboardProps {
  language: 'ar' | 'en';
  products: Product[];
  orders: Order[];
  storeSettings: StoreSettings;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: 'pending' | 'shipped' | 'delivered' | 'cancelled') => void;
  onUpdateStoreSettings: (settings: StoreSettings) => void;
}

export default function AdminDashboard({
  language,
  products,
  orders,
  storeSettings,
  onAddProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onUpdateStoreSettings,
}: AdminDashboardProps) {
  const isAr = language === 'ar';
  
  // Tab states for admin console
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'inventory' | 'settings'>('analytics');

  // Add Product form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProdNameAr, setNewProdNameAr] = useState('');
  const [newProdNameEn, setNewProdNameEn] = useState('');
  const [newProdDescAr, setNewProdDescAr] = useState('');
  const [newProdDescEn, setNewProdDescEn] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<CategoryType>('jackets');
  const [newProdImage, setNewProdImage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewProdImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Store Settings form states
  const [whatsapp, setWhatsapp] = useState(storeSettings.whatsappNumber);
  const [contact, setContact] = useState(storeSettings.contactPhone);
  const [addressAr, setAddressAr] = useState(storeSettings.storeAddressAr);
  const [addressEn, setAddressEn] = useState(storeSettings.storeAddressEn);
  const [feeSBA, setFeeSBA] = useState(storeSettings.deliveryFeeBelAbbes.toString());
  const [feeOther, setFeeOther] = useState(storeSettings.deliveryFeeOtherWilayas.toString());
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  // Stats calculations
  const totalSales = orders
    .filter(o => o.status === 'delivered')
    .reduce((acc, o) => acc + o.subtotal, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const totalOrdersCount = orders.length;
  const inventoryCount = products.length;

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdNameAr || !newProdNameEn || !newProdPrice) return;

    const defaultImages = [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&auto=format&fit=crop&q=80'
    ];

    const imageToUse = newProdImage.trim() || defaultImages[Math.floor(Math.random() * defaultImages.length)];

    const newProduct: Product = {
      id: `p-${Math.floor(1000 + Math.random() * 9000)}`,
      nameAr: newProdNameAr,
      nameEn: newProdNameEn,
      descriptionAr: newProdDescAr || 'لا يوجد وصف حالياً لهذا المنتج المميز.',
      descriptionEn: newProdDescEn || 'No detailed description available currently.',
      price: parseInt(newProdPrice) || 3500,
      category: newProdCategory,
      images: [imageToUse],
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [
        { nameAr: 'أسود كلاسيكي', nameEn: 'Classic Black', hex: '#1e293b' },
        { nameAr: 'أبيض أنيق', nameEn: 'Elegant White', hex: '#f8fafc' }
      ],
      rating: 5.0,
      reviewsCount: 1,
      inStock: true,
      isNew: true
    };

    onAddProduct(newProduct);

    // Reset fields
    setNewProdNameAr('');
    setNewProdNameEn('');
    setNewProdDescAr('');
    setNewProdDescEn('');
    setNewProdPrice('');
    setNewProdImage('');
    setShowAddForm(false);
  };

  const handleUpdateSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: StoreSettings = {
      whatsappNumber: whatsapp,
      contactPhone: contact,
      storeAddressAr: addressAr,
      storeAddressEn: addressEn,
      deliveryFeeBelAbbes: parseInt(feeSBA) || 300,
      deliveryFeeOtherWilayas: parseInt(feeOther) || 600,
    };
    onUpdateStoreSettings(updatedSettings);
    setSettingsSuccess(true);
    setTimeout(() => setSettingsSuccess(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-[80vh] rounded-3xl border border-slate-200 shadow-lg" id="owner-admin-dashboard">
      {/* Dashboard Top Header bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1 rounded-full text-[10px] font-bold w-fit mb-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            <span>{isAr ? 'لوحة تحكم البائع المشرف' : 'Seller Store Overseer Panel'}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">
            {isAr ? 'إدارة متجر Veges بلعباس' : 'Veges SBA Store Control Center'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isAr ? 'تابع الطلبات، أدر المنتجات، واضبط إعدادات شحن الواتساب والتسوق.' : 'Manage inventory, check incoming sales, update address & WhatsApp webhook.'}
          </p>
        </div>

        {/* Console tab controls */}
        <div className="flex bg-slate-200/60 p-1.5 rounded-2xl border border-slate-300/30 w-full md:w-auto overflow-x-auto">
          {[
            { value: 'analytics', labelAr: 'الإحصائيات والربح', labelEn: 'KPI Analytics' },
            { value: 'orders', labelAr: 'الطلبات الحالية', labelEn: 'Incoming Orders' },
            { value: 'inventory', labelAr: 'إدارة المخزن', labelEn: 'Inventory' },
            { value: 'settings', labelAr: 'إعدادات المتجر', labelEn: 'Settings' }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value as any)}
              className={`px-4 py-2 rounded-xl text-xs font-black shrink-0 transition-all cursor-pointer ${
                activeTab === tab.value
                  ? 'bg-red-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-slate-200'
              }`}
            >
              {isAr ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics view panel */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 mt-6">
          {/* Bento grid KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center text-slate-400 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider">{isAr ? 'المبيعات المؤكدة' : 'Earning Sales'}</span>
                <DollarSign className="w-5 h-5 text-emerald-500" />
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 font-mono">
                {totalSales} DA
              </h2>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">{isAr ? 'مستخلصة من الطلبات المستلمة' : 'Revenue from delivered items'}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center text-slate-400 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider">{isAr ? 'الطلبات القيد المعالجة' : 'Pending Orders'}</span>
                <ShoppingCart className="w-5 h-5 text-amber-500" />
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 font-mono">
                {pendingOrders} {isAr ? 'طلب' : 'orders'}
              </h2>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">{isAr ? 'في انتظار الشحن أو التأكيد' : 'Awaiting fulfillment/shipping'}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center text-slate-400 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider">{isAr ? 'إجمالي الطلبات المستلمة' : 'All Orders Total'}</span>
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 font-mono">
                {totalOrdersCount} {isAr ? 'طلب' : 'orders'}
              </h2>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">{isAr ? 'مجموع سائر المعاملات بالمتجر' : 'Lifetime store transactions'}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center text-slate-400 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider">{isAr ? 'أصناف الملابس المعروضة' : 'Garments Count'}</span>
                <Package className="w-5 h-5 text-red-600" />
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 font-mono">
                {inventoryCount} {isAr ? 'قطعة' : 'styles'}
              </h2>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">{isAr ? 'متوفرة للزبائن على الواجهة' : 'Active catalogs on storefront'}</p>
            </div>
          </div>

          {/* Quick tips about SBA local sales */}
          <div className="p-4 bg-red-50 border border-red-150 rounded-2xl flex gap-3 text-xs text-red-900">
            <TrendingUp className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-slate-900">{isAr ? 'نصيحة المبيعات لولاية سيدي بلعباس:' : 'Algerian Local Sales Pro-Tip:'}</span>
              <p className="mt-0.5 leading-relaxed text-slate-600">
                {isAr 
                  ? 'يرغب معظم المتسوقين في بلعباس بالحصول على طلباتهم سريعا. يفضل الاتصال هاتفيا بالزبائن بعد تقديمهم للطلب الفوري لتأكيد قياسات الملابس وشحنها فورا عبر ياليدين يساهم في تقليل معدل إلغاء الشحنات!' 
                  : 'Most local shoppers appreciate a quick confirmation call. Ringing the customer to verify sizing prior to dispatching significantly reduces return-to-sender (RTS) rates.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Orders Ledger list */}
      {activeTab === 'orders' && (
        <div className="mt-6 space-y-4">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">{isAr ? 'كشف مبيعات وتفاصيل الشحن' : 'Incoming Order Ledger'}</h2>
          
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-150 p-6 text-slate-400">
              <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-600">{isAr ? 'لا يوجد طلبات حالياً.' : 'No customer orders received yet.'}</p>
              <p className="text-xs text-slate-400 mt-1">{isAr ? 'عند قيام الزبائن بشراء الملابس ستظهر هنا مع رنين جرس المبيعات.' : 'Awaiting checkout operations from the customer storefront.'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col gap-4 shadow-sm">
                  {/* Title & Status block */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-mono font-black text-slate-400 block">{order.id}</span>
                      <h3 className="font-black text-slate-800 text-sm">{order.customerName}</h3>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                        order.status === 'pending' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                        order.status === 'shipped' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                        order.status === 'delivered' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                        'bg-red-50 border-red-200 text-red-600'
                      }`}>
                        {isAr
                          ? order.status === 'pending' ? 'قيد الانتظار' : order.status === 'shipped' ? 'تم الشحن' : order.status === 'delivered' ? 'تم الاستلام' : 'ملغي'
                          : order.status}
                      </span>
                    </div>
                  </div>

                  {/* Customer shipping breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-slate-400 block text-[9px] font-bold uppercase">{isAr ? 'رقم الهاتف' : 'Phone'}</span>
                      <a href={`tel:${order.customerPhone}`} className="font-bold text-slate-900 flex items-center gap-1 hover:text-red-600">
                        <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        {order.customerPhone}
                      </a>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] font-bold uppercase">{isAr ? 'الولاية والبلدية' : 'Wilaya & Commune'}</span>
                      <span className="font-bold text-slate-900">{order.customerWilaya} • {order.customerCommune}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[9px] font-bold uppercase">{isAr ? 'العنوان وتفاصيل التوصيل' : 'Address & Delivery'}</span>
                      <p className="font-bold text-slate-900 line-clamp-1">{order.customerAddress}</p>
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">{isAr ? 'الملابس المطلوبة:' : 'Garments ordered:'}</span>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs text-slate-700 py-1 border-b border-slate-50 last:border-0">
                        <span>
                          {item.quantity}x {isAr ? item.productNameAr : item.productNameEn} 
                          <span className="text-slate-400 font-bold ml-1.5">
                            ({isAr ? 'المقاس:' : 'Size:'} {item.selectedSize} • {isAr ? 'اللون:' : 'Color:'} {isAr ? item.selectedColor.nameAr : item.selectedColor.nameEn})
                          </span>
                        </span>
                        <span className="font-mono font-bold text-slate-900">{item.price * item.quantity} DA</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing and Action controllers */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-1 text-xs">
                    <div className="font-bold text-slate-700">
                      <span>{isAr ? 'الحساب الإجمالي المستحق:' : 'Total due value:'}</span>
                      <span className="text-sm font-black text-red-600 font-mono ml-1">{order.total} DA</span>
                    </div>

                    {/* Change Status buttons */}
                    <div className="flex gap-2.5 flex-wrap w-full sm:w-auto">
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'shipped')}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 border border-blue-200 hover:text-white rounded-lg transition-colors cursor-pointer text-[10px] font-bold flex items-center gap-1"
                      >
                        {isAr ? 'شحن الطلب' : 'Mark Shipped'}
                      </button>
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-600 border border-emerald-200 hover:text-white rounded-lg transition-colors cursor-pointer text-[10px] font-bold flex items-center gap-1"
                      >
                        {isAr ? 'تأكيد التسليم' : 'Mark Delivered'}
                      </button>
                      <button
                        onClick={() => onUpdateOrderStatus(order.id, 'cancelled')}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-600 border border-red-200 hover:text-white rounded-lg transition-colors cursor-pointer text-[10px] font-bold flex items-center gap-1"
                      >
                        {isAr ? 'إلغاء الطلب' : 'Cancel Order'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Inventory catalog management */}
      {activeTab === 'inventory' && (
        <div className="mt-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">{isAr ? 'قائمة المنتجات المعروضة بالمخزن' : 'Stock Apparel Catalog'}</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-red-600/15 cursor-pointer flex items-center gap-1.5 hover:scale-103"
            >
              {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{showAddForm ? (isAr ? 'إغلاق الاستمارة' : 'Close Form') : (isAr ? 'أضف منتج ملابس جديد' : 'Add New Style')}</span>
            </button>
          </div>

          {/* Add product expandable form */}
          {showAddForm && (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleAddProductSubmit}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md space-y-4"
            >
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">{isAr ? 'إضافة قطعة ملابس جديدة للمتجر' : 'Add New Garment Style'}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">{isAr ? 'الاسم بالعربية *' : 'Name in Arabic *'}</label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: قميص كتان صيفي خفيف"
                    value={newProdNameAr}
                    onChange={(e) => setNewProdNameAr(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-red-600 focus:bg-white text-slate-900 transition-all font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">{isAr ? 'الاسم بالإنجليزية *' : 'Name in English *'}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Linen Summer Casual Shirt"
                    value={newProdNameEn}
                    onChange={(e) => setNewProdNameEn(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-red-600 focus:bg-white text-slate-900 transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">{isAr ? 'السعر (بالدينار) *' : 'Price in DA *'}</label>
                  <input
                    type="number"
                    required
                    placeholder="3500"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-red-600 focus:bg-white text-slate-900 transition-all font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">{isAr ? 'التصنيف *' : 'Category *'}</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as CategoryType)}
                    className="bg-slate-50 border border-slate-200 text-xs px-2.5 py-2.5 rounded-xl outline-none focus:border-red-600 focus:bg-white text-slate-900 transition-all cursor-pointer font-semibold"
                  >
                    <option value="jackets">{isAr ? 'جاكيتات ومعاطف' : 'Coats & Jackets'}</option>
                    <option value="hoodies">{isAr ? 'أطقم وهوديز' : 'Tracksuits & Hoodies'}</option>
                    <option value="shirts">{isAr ? 'قمصان فاخرة' : 'Premium Shirts'}</option>
                    <option value="accessories">{isAr ? 'إكسسوارات وساعات' : 'Accessories'}</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-1">
                  <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">
                    {isAr ? 'صورة قطعة الملابس *' : 'Apparel Image *'}
                  </label>
                  
                  <div className="flex flex-col gap-2">
                    {/* Choose between File Upload or Link pasting */}
                    <div className="grid grid-cols-1 gap-2">
                      {/* Direct Upload */}
                      <div className="relative border-2 border-dashed border-slate-300 hover:border-red-500 rounded-xl p-3 bg-slate-50 hover:bg-red-50/10 transition-colors flex flex-col items-center justify-center cursor-pointer text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <span className="text-[11px] font-bold text-slate-700">
                          {isAr ? '📸 اختر صورة من هاتفك/جهازك' : '📸 Upload photo from gallery'}
                        </span>
                        <span className="text-[9px] text-slate-400 mt-0.5">
                          {isAr ? 'يدعم الصور المباشرة والكاميرا' : 'Supports images & camera'}
                        </span>
                      </div>

                      {/* URL input fallback */}
                      <input
                        type="url"
                        placeholder={isAr ? "أو الصق رابط صورة جاهز هنا..." : "Or paste web image link here..."}
                        value={newProdImage.startsWith('data:') ? '' : newProdImage}
                        onChange={(e) => setNewProdImage(e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-xs px-3 py-2 rounded-xl outline-none focus:border-red-600 focus:bg-white text-slate-900 transition-all font-semibold"
                      />
                    </div>

                    {/* Image Preview thumbnail if available */}
                    {newProdImage && (
                      <div className="flex items-center gap-3 p-2 bg-slate-100 rounded-xl border border-slate-200 w-full">
                        <img 
                          src={newProdImage} 
                          alt="preview" 
                          className="w-10 h-12 object-cover rounded-lg border border-slate-300 shrink-0 bg-white" 
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-grow min-w-0">
                          <span className="text-[10px] font-bold text-slate-700 block truncate">
                            {newProdImage.startsWith('data:') ? (isAr ? 'صورة محملة محلياً' : 'Locally uploaded image') : newProdImage}
                          </span>
                          <span className="text-[8px] text-emerald-600 font-bold block">✓ {isAr ? 'تم الحفظ والملاءمة' : 'Ready to upload'}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNewProdImage('')}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">{isAr ? 'الوصف بالعربية' : 'Description in Arabic'}</label>
                  <textarea
                    rows={2}
                    placeholder="وصف وتفاصيل نوعية القماش والتطريز..."
                    value={newProdDescAr}
                    onChange={(e) => setNewProdDescAr(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-red-600 focus:bg-white text-slate-900 transition-all font-semibold resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">{isAr ? 'الوصف بالإنجليزية' : 'Description in English'}</label>
                  <textarea
                    rows={2}
                    placeholder="Detailed description about fabric and quality features..."
                    value={newProdDescEn}
                    onChange={(e) => setNewProdDescEn(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-red-600 focus:bg-white text-slate-900 transition-all font-semibold resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                {isAr ? 'حفظ وإدراج في الواجهة' : 'Save & Publish on Store'}
              </button>
            </motion.form>
          )}

          {/* Product stock grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex gap-3 shadow-sm relative">
                {/* Image */}
                <div className="w-16 h-20 bg-slate-50 border border-slate-150 rounded-xl overflow-hidden shrink-0">
                  <img src={product.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{product.category}</span>
                    <h4 className="font-extrabold text-slate-800 text-xs line-clamp-1">{isAr ? product.nameAr : product.nameEn}</h4>
                    <span className="font-mono text-xs font-black text-red-600 mt-1 block">{product.price} DA</span>
                  </div>

                  <span className="text-[10px] text-slate-500 font-bold">
                    {isAr ? 'المقاسات:' : 'Sizes:'} {product.sizes.join(', ')}
                  </span>
                </div>

                {/* Trash delete button */}
                <button
                  onClick={() => onDeleteProduct(product.id)}
                  className="absolute bottom-3 left-3 p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                  title={isAr ? 'حذف من المتجر' : 'Delete from store'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Store general configurations settings */}
      {activeTab === 'settings' && (
        <form onSubmit={handleUpdateSettingsSubmit} className="mt-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-3">{isAr ? 'إعدادات متجر Veges ومواقع الشحن' : 'WhatsApp & Delivery Webhooks Settings'}</h2>

          {settingsSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{isAr ? 'تم حفظ التحديثات بنجاح!' : 'Store settings updated successfully!'}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">{isAr ? 'رقم الواتساب لاستقبال الطلبات *' : 'Store WhatsApp Number *'}</label>
              <input
                type="text"
                required
                placeholder="+213555123456"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-red-600 focus:bg-white text-slate-900 transition-all font-semibold"
              />
              <span className="text-[9px] text-slate-400">{isAr ? 'أدخل الرمز الدولي بدون مسافات (مثال: 213555123456+).' : 'International code required without spaces (e.g. +213555123456).'}</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">{isAr ? 'هاتف الاتصال والشكاوى *' : 'Customer Support Phone *'}</label>
              <input
                type="text"
                required
                placeholder="0555 12 34 56"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-red-600 focus:bg-white text-slate-900 transition-all font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">{isAr ? 'سعر التوصيل داخل ولاية سيدي بلعباس (DA) *' : 'Local SBA Delivery Fee (DA) *'}</label>
              <input
                type="number"
                required
                value={feeSBA}
                onChange={(e) => setFeeSBA(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-red-600 focus:bg-white text-slate-900 transition-all font-semibold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">{isAr ? 'سعر التوصيل لباقي الولايات الأخرى (DA) *' : 'Other 57 Wilayas Delivery Fee (DA) *'}</label>
              <input
                type="number"
                required
                value={feeOther}
                onChange={(e) => setFeeOther(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-red-600 focus:bg-white text-slate-900 transition-all font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">{isAr ? 'عنوان المحل بالتفصيل (سيدي بلعباس) بالعربية *' : 'Detailed Shop Address SBA in Arabic *'}</label>
              <input
                type="text"
                required
                value={addressAr}
                onChange={(e) => setAddressAr(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-red-600 focus:bg-white text-slate-900 transition-all font-semibold"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">{isAr ? 'عنوان المحل بالتفصيل (سيدي بلعباس) بالإنجليزية *' : 'Detailed Shop Address SBA in English *'}</label>
              <input
                type="text"
                required
                value={addressEn}
                onChange={(e) => setAddressEn(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none focus:border-red-600 focus:bg-white text-slate-900 transition-all font-semibold"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs rounded-xl transition-all shadow-md cursor-pointer"
          >
            {isAr ? 'حفظ وحفظ التكوينات' : 'Save General Configurations'}
          </button>
        </form>
      )}
    </div>
  );
}
