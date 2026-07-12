import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Star, ShieldCheck, Truck, Phone, MessageSquare, 
  MapPin, Heart, ArrowRight, Check, ChevronRight, RefreshCw, Sparkles, 
  Trash2, Plus, Minus, AlertCircle, ShoppingCart, User, Archive
} from 'lucide-react';

import { Product, CartItem, Order, ProductColor, StoreSettings, CategoryType } from './types';
import { INITIAL_PRODUCTS, DEFAULT_STORE_SETTINGS, MOCK_REVIEWS } from './data';

import Header from './components/Header';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutForm from './components/CheckoutForm';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('veges_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    const saved = localStorage.getItem('veges_settings');
    return saved ? JSON.parse(saved) : DEFAULT_STORE_SETTINGS;
  });
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('veges_orders');
    return saved ? JSON.parse(saved) : [];
  });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('veges_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeCategory, setActiveCategory] = useState<CategoryType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'lowToHigh' | 'highToLow' | 'newest'>('featured');
  
  // Navigation states
  const [currentView, setCurrentView] = useState<'storefront' | 'checkout' | 'order-success'>('storefront');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Product details modal
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAr = language === 'ar';

  // Persistence effects
  useEffect(() => {
    localStorage.setItem('veges_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('veges_settings', JSON.stringify(storeSettings));
  }, [storeSettings]);

  useEffect(() => {
    localStorage.setItem('veges_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('veges_cart', JSON.stringify(cart));
  }, [cart]);

  // Quick helper to scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, isAdminMode, activeCategory]);

  // Cart operations
  const handleAddToCart = (product: Product, size: string, color: ProductColor, qty: number) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(item => 
        item.product.id === product.id && 
        item.selectedSize === size && 
        item.selectedColor.hex === color.hex
      );

      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += qty;
        return next;
      } else {
        return [...prev, { product, selectedSize: size, selectedColor: color, quantity: qty }];
      }
    });
  };

  const handleUpdateCartQuantity = (productId: string, size: string, colorHex: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId && item.selectedSize === size && item.selectedColor.hex === colorHex) {
          const nextQty = item.quantity + delta;
          return nextQty > 0 ? { ...item, quantity: nextQty } : null;
        }
        return item;
      }).filter((item): item is CartItem => item !== null);
    });
  };

  const handleRemoveCartItem = (productId: string, size: string, colorHex: string) => {
    setCart(prev => prev.filter(item => 
      !(item.product.id === productId && item.selectedSize === size && item.selectedColor.hex === colorHex)
    ));
  };

  const handleQuickAdd = (product: Product) => {
    // Adds with default values
    const size = product.sizes[0] || 'L';
    const color = product.colors[0] || { nameAr: 'افتراضي', nameEn: 'Default', hex: '#6b7280' };
    handleAddToCart(product, size, color, 1);
    setIsCartOpen(true);
  };

  const handleOpenProductDetails = (product: Product) => {
    setSelectedProductForModal(product);
    setIsModalOpen(true);
  };

  // Build filtered garments catalog
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = searchQuery.trim() === '' || 
      product.nameAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.descriptionAr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'lowToHigh') return a.price - b.price;
    if (sortBy === 'highToLow') return b.price - a.price;
    if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0); // featured by default
  });

  // Seller operations callbacks
  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const handleUpdateOrderStatus = (orderId: string, status: 'pending' | 'shipped' | 'delivered' | 'cancelled') => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleUpdateStoreSettings = (newSettings: StoreSettings) => {
    setStoreSettings(newSettings);
  };

  // Generate WhatsApp Message & Redirection link
  const generateWhatsAppLink = (order: Order) => {
    const phoneNum = storeSettings.whatsappNumber.replace('+', '').trim();
    
    const intro = isAr 
      ? `*طلب جديد من متجر Veges 👕👖*` 
      : `*New Garment Order from Veges SBA Store 👕👖*`;
      
    const clientDetails = isAr
      ? `*الزبون:* ${order.customerName}\n*الهاتف:* ${order.customerPhone}\n*الولاية:* ${order.customerWilaya}\n*البلدية:* ${order.customerCommune}\n*العنوان التفصيلي:* ${order.customerAddress}\n*طريقة التوصيل:* ${order.deliveryType === 'home' ? 'توصيل لباب المنزل' : 'استلام من مكتب ياليدين'}`
      : `*Customer:* ${order.customerName}\n*Phone:* ${order.customerPhone}\n*Wilaya:* ${order.customerWilaya}\n*Commune:* ${order.customerCommune}\n*Address Details:* ${order.customerAddress}\n*Delivery Method:* ${order.deliveryType === 'home' ? 'Home Delivery' : 'Yalidine Office Pick-up'}`;

    const itemsSection = isAr ? `*الملابس المطلوبة:*` : `*Requested Garments:*`;
    const itemsList = order.items.map(item => {
      return isAr
        ? `- ${item.quantity}x ${item.productNameAr} (مقاس: ${item.selectedSize} ، لون: ${item.selectedColor.nameAr}) [${item.price * item.quantity} DA]`
        : `- ${item.quantity}x ${item.productNameEn} (Size: ${item.selectedSize} , Color: ${item.selectedColor.nameEn}) [${item.price * item.quantity} DA]`;
    }).join('\n');

    const payment = isAr
      ? `*المجموع الفرعي:* ${order.subtotal} DA\n*تكلفة التوصيل:* ${order.deliveryFee} DA\n*المجموع الإجمالي المستحق للدفع:* *${order.total} DA*\n\n_طريقة الدفع: الدفع عند الاستلام بعد فحص السلعة 🤝_`
      : `*Items Subtotal:* ${order.subtotal} DA\n*Delivery Fee:* ${order.deliveryFee} DA\n*Grand Total Due:* *${order.total} DA*\n\n_Payment Method: Cash on Delivery after inspecting the garments 🤝_`;

    const footer = isAr
      ? `شكراً لتسوقكم من متجر Veges في سيدي بلعباس!`
      : `Thank you for shopping from Veges store in Sidi Bel Abbes!`;

    const fullMessage = `${intro}\n\n${clientDetails}\n\n${itemsSection}\n${itemsList}\n\n${payment}\n\n${footer}`;
    
    return `https://api.whatsapp.com/send?phone=${phoneNum}&text=${encodeURIComponent(fullMessage)}`;
  };

  const handlePlaceOrder = (newOrder: Order, sendToWhatsApp: boolean) => {
    setOrders(prev => [newOrder, ...prev]);
    setLastPlacedOrder(newOrder);
    setCart([]); // Clear shopping cart
    
    if (sendToWhatsApp) {
      // Trigger WhatsApp tab redirection
      const link = generateWhatsAppLink(newOrder);
      window.open(link, '_blank');
    }

    setCurrentView('order-success');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800" id="veges-app-root">
      {/* Branded Luxury Header */}
      <Header
        language={language}
        setLanguage={setLanguage}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
      />

      {/* Main Container Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          {isAdminMode ? (
            /* ========================================================================= */
            /* 👑 SELLER / ADMIN PANEL */
            /* ========================================================================= */
            <motion.div
              key="admin-dashboard-container"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <AdminDashboard
                language={language}
                products={products}
                orders={orders}
                storeSettings={storeSettings}
                onAddProduct={handleAddProduct}
                onDeleteProduct={handleDeleteProduct}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onUpdateStoreSettings={handleUpdateStoreSettings}
              />
            </motion.div>
          ) : (
            /* ========================================================================= */
            /* 🛍️ BUYER FRONTEND PATHWAY */
            /* ========================================================================= */
            (() => {
              if (currentView === 'storefront') {
                return (
                  <motion.div
                    key="storefront-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-8"
                  >
                    {/* Immersive Hero slider section */}
                    <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 sm:p-12 lg:p-16 flex flex-col justify-center min-h-[360px] sm:min-h-[420px] shadow-2xl border border-slate-800">
                      {/* Ambient background decoration */}
                      <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&auto=format&fit=crop&q=80')` }} />
                      <div className="absolute right-0 top-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl" />
                      <div className="absolute left-12 bottom-0 w-64 h-64 bg-slate-100/5 rounded-full blur-2xl" />

                      <div className="relative z-10 max-w-2xl space-y-4">
                        <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full border border-red-500 shadow-lg">
                          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                          {isAr ? 'أناقة عالمية، في سيدي بلعباس' : 'World-Class Elegance, In Sidi Bel Abbes'}
                        </span>
                        
                        <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
                          {isAr ? (
                            <span>متجر ملابس <span className="text-red-500">رجالية</span> فاخرة ومعاصرة</span>
                          ) : (
                            <span>Premium & Contemporary <span className="text-red-500">Menswear</span> Boutique</span>
                          )}
                        </h1>

                        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg">
                          {isAr 
                            ? 'نقدم لك التشكيلة الأرقى من الجاكيتات الفخمة، الأطقم الرياضية، القمصان الصيفية المريحة والإكسسوارات الإيطالية للرجال فقط. جودة عالمية، فحص قبل الدفع وتوصيل لباب دارك!' 
                            : 'Discover our handpicked collection of high-end jackets, sporty tracksuits, premium linen shirts, and Italian luxury accessories for men. Pay cash-on-delivery only after size verification.'}
                        </p>

                        <div className="pt-4 flex flex-wrap gap-4 items-center">
                          <button
                            onClick={() => {
                              setActiveCategory('jackets');
                              const element = document.getElementById('garments-showroom');
                              element?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-2xl text-xs shadow-xl shadow-red-600/25 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                          >
                            {isAr ? 'تسوق تشكيلة الجاكيتات' : 'Explore Jackets'}
                          </button>
                          
                          <div className="flex items-center gap-2 text-xs text-slate-300 font-bold">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                            <span>{isAr ? 'التوصيل متوفر لـ 58 ولاية' : 'Shipping available to 58 wilayas'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Features grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl shrink-0">
                          <Truck className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{isAr ? 'توصيل ياليدين سريع' : 'Fast National Delivery'}</h4>
                          <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">{isAr ? 'شحن لبلعباس وكافة الولايات في زمن قياسي.' : 'Seamless shipping across Sidi Bel Abbes and 58 Algerian wilayas.'}</p>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl shrink-0">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{isAr ? 'فحص السلع قبل الدفع' : 'Inspect Before You Pay'}</h4>
                          <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">{isAr ? 'افتح الطرد وتأكد من جودة القماش والمقاس أولاً.' : 'Open your Yalidine parcel, verify fitting, then pay the courier.'}</p>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                        <div className="p-3 bg-red-50 text-red-600 rounded-xl shrink-0">
                          <Phone className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{isAr ? 'تأكيد طلب مرن بالواتساب' : 'WhatsApp Chat Orders'}</h4>
                          <p className="text-slate-500 text-[11px] leading-relaxed mt-0.5">{isAr ? 'إرسال تفاصيل السلة ومقاساتك مباشرة للمحل بنقرة واحدة.' : 'Confirm products, sizes, and colors directly with the seller.'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Visual Categories Grid */}
                    <div className="space-y-4 pt-4">
                      <div className="flex flex-col gap-1">
                        <h2 className="text-lg sm:text-xl font-black text-slate-900">
                          {isAr ? 'تسوق الفئات الرجالية الفاخرة' : 'Shop Premium Menswear Categories'}
                        </h2>
                        <p className="text-xs text-slate-400">
                          {isAr ? 'اختر تصنيفاً لاستكشاف أحدث صيحات الموضة والأناقة الرجالية' : 'Select a category to explore the latest trends in gentlemen’s styling'}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { value: 'jackets', labelAr: 'جاكيتات ومعاطف 🧥', labelEn: 'Coats & Jackets', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=80', descAr: 'جاكيتات جلدية ثقيلة ومقاومة للبرد والرياح', descEn: 'Heavy duty leather & winter parkas' },
                          { value: 'hoodies', labelAr: 'أطقم وهوديز 👕', labelEn: 'Tracksuits & Hoodies', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=80', descAr: 'أطقم كلاسيكية ورياضية وهوديز مريحة للغاية', descEn: 'Cozy organic hoodies & matching joggers' },
                          { value: 'shirts', labelAr: 'قمصان صيفية فاخرة 👔', labelEn: 'Premium Shirts', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500&auto=format&fit=crop&q=80', descAr: 'قمصان كتان باردة ومناسبة لمختلف المناسبات', descEn: 'Lightweight linen & smart-casual shirts' },
                          { value: 'accessories', labelAr: 'إكسسوارات وساعات 🕶️', labelEn: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=80', descAr: 'ساعات كوارتز كرونوغراف ونظارات إيطالية مميزة', descEn: 'Elegant quartz watches & designer eyewear' },
                        ].map((cat) => (
                          <div
                            key={cat.value}
                            onClick={() => {
                              setActiveCategory(cat.value as any);
                              const element = document.getElementById('garments-showroom');
                              element?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={`group relative h-48 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 shadow-md ${
                              activeCategory === cat.value
                                ? 'border-red-600 ring-4 ring-red-600/10 scale-[1.02]'
                                : 'border-slate-100 hover:border-red-400 hover:scale-[1.02]'
                            }`}
                          >
                            <img
                              src={cat.image}
                              alt={cat.labelEn}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                            
                            {/* Labels */}
                            <div className="absolute bottom-3 left-3 right-3 text-white">
                              <span className="bg-red-600 text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full mb-1 inline-block">
                                {products.filter(p => p.category === cat.value).length} {isAr ? 'منتج' : 'items'}
                              </span>
                              <h3 className="font-extrabold text-xs sm:text-sm text-white drop-shadow-sm leading-tight">
                                {isAr ? cat.labelAr : cat.labelEn}
                              </h3>
                              <p className="text-[9px] text-slate-300 font-medium line-clamp-1 mt-0.5 opacity-90">
                                {isAr ? cat.descAr : cat.descEn}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Showroom filter toolbar */}
                    <div className="pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-t border-slate-200" id="garments-showroom">
                      <div>
                        <h2 className="text-lg sm:text-xl font-black text-slate-900">
                          {isAr ? 'أحدث موديلاتنا المعروضة' : 'Browse Our Showroom'}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {isAr ? `نعرض ${filteredProducts.length} قطعة فاخرة ملائمة لذوقك.` : `Discover ${filteredProducts.length} premium styled garments.`}
                        </p>
                      </div>

                      {/* Filter category chips and Sort selectors */}
                      <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          className="bg-white border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl outline-none text-slate-700 cursor-pointer font-bold focus:border-red-600 focus:ring-4 focus:ring-red-600/5 transition-all"
                        >
                          <option value="featured">{isAr ? 'ترتيب: المقترحة' : 'Sort: Featured'}</option>
                          <option value="lowToHigh">{isAr ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
                          <option value="highToLow">{isAr ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
                          <option value="newest">{isAr ? 'الموديل: الأحدث' : 'Sort: Newest'}</option>
                        </select>
                      </div>
                    </div>

                    {/* Product Grid showroom */}
                    {filteredProducts.length === 0 ? (
                      <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200 p-8">
                        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                        <h3 className="font-extrabold text-slate-700 text-sm">
                          {isAr ? 'لا توجد منتجات مطابقة للبحث' : 'No garments match your search'}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                          {isAr 
                            ? 'جرب البحث بكلمات أخرى أو اختر تصنيفاً مغايراً لرؤية الملابس المتوفرة.' 
                            : 'Try adjusting your search filters or browse other clothing categories.'}
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {filteredProducts.map((product) => (
                          <ProductCard
                            key={product.id}
                            product={product}
                            language={language}
                            onProductClick={handleOpenProductDetails}
                            onQuickAdd={handleQuickAdd}
                          />
                        ))}
                      </div>
                    )}

                    {/* Testimonials section */}
                    <div className="mt-16 bg-slate-900 text-white p-6 sm:p-10 rounded-3xl border border-slate-850 relative overflow-hidden shadow-2xl">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-3xl" />
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-100/5 rounded-full blur-3xl" />
                      
                      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-white/10 pb-6">
                        <div>
                          <div className="flex items-center gap-1.5 bg-red-600 text-white text-[9px] font-black uppercase px-2.5 py-1 rounded-full w-fit mb-2">
                            <Star className="w-3 h-3 fill-white" />
                            <span>{isAr ? 'آراء زبائننا الموثقة في بلعباس' : 'Verified Sidi Bel Abbes Reviews'}</span>
                          </div>
                          <h2 className="text-xl sm:text-2xl font-black">
                            {isAr ? 'ماذا يقول زبائننا عن جودة ملابسنا؟ ⭐' : 'What Our Buyers Say about Garments Quality? ⭐'}
                          </h2>
                          <p className="text-xs text-slate-400 mt-1">
                            {isAr ? 'فخورون بخدمة مئات العائلات الراقية في سيدي بلعباس ومختلف الولايات بدفع آمن بعد المعاينة.' : 'Proud to serve hundreds of elegant families with cash-on-delivery inspection.'}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10 shrink-0">
                          <span className="text-red-500 font-black text-lg">4.9/5</span>
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                          </div>
                          <span className="text-[10px] text-slate-300 font-bold">({isAr ? '١٥٠+ زبون سعيد' : '150+ Happy Shoppers'})</span>
                        </div>
                      </div>

                      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {MOCK_REVIEWS.map((review) => (
                          <div key={review.id} className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl flex flex-col justify-between hover:border-red-500/50 hover:bg-white/10 transition-all duration-300 group">
                            <div>
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-extrabold text-sm text-white group-hover:text-red-400 transition-colors">{review.customerName}</h4>
                                  <span className="text-[9px] text-red-500 font-black flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-3 h-3 shrink-0" />
                                    {isAr ? review.locationAr : review.locationEn}
                                  </span>
                                </div>
                                <div className="flex text-amber-400 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                                  {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} className="w-2.5 h-2.5 fill-current" />
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed italic">
                                "{isAr ? review.commentAr : review.commentEn}"
                              </p>
                            </div>
                            <div className="text-[8px] text-slate-500 font-mono mt-4 text-left">
                              {review.date}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              }

              if (currentView === 'checkout') {
                return (
                  <motion.div
                    key="checkout-view"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="py-4"
                  >
                    <CheckoutForm
                      language={language}
                      cartItems={cart}
                      storeSettings={storeSettings}
                      onBackToCart={() => setCurrentView('storefront')}
                      onSubmitOrder={handlePlaceOrder}
                    />
                  </motion.div>
                );
              }

              if (currentView === 'order-success') {
                return (
                  <motion.div
                    key="success-container"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="max-w-2xl mx-auto py-8 text-center space-y-6"
                  >
                    {/* Confetti & congrats */}
                    <div className="inline-flex p-4 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 shadow-xl animate-bounce">
                      <Sparkles className="w-10 h-10 animate-spin" />
                    </div>

                    <div className="space-y-2">
                      <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                        {isAr ? 'تهانينا! تم إرسال طلبك بنجاح 🎉' : 'Congratulations! Order Dispatched 🎉'}
                      </h1>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                        {isAr 
                          ? 'لقد سجلنا طلبك بنجاح في نظام متجر Veges. سيقوم موظف تأكيد المبيعات بالاتصال بك قريباً هاتفياً لتجهيز ملابسك للشحن.' 
                          : 'Your order was successfully submitted in our database. We will phone you soon to verify garment measurements.'}
                      </p>
                    </div>

                    {/* Receipt ticket widget */}
                    {lastPlacedOrder && (
                      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl text-right sm:text-left overflow-hidden max-w-md mx-auto relative border-t-8 border-t-red-600">
                        {/* Cut dashed styling decoration */}
                        <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-slate-200" />
                        <div className="absolute -left-3 top-1/2 w-6 h-6 rounded-full bg-slate-50 border border-slate-200 -mt-3" />
                        <div className="absolute -right-3 top-1/2 w-6 h-6 rounded-full bg-slate-50 border border-slate-200 -mt-3" />

                        {/* Top half: Receipt details */}
                        <div className="p-5 space-y-3">
                          <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase">
                            <span>{isAr ? 'تذكرة طلب شراء Veges' : 'Veges Shopping Ticket'}</span>
                            <span className="font-mono text-slate-900">{lastPlacedOrder.id}</span>
                          </div>

                          <div className="space-y-1.5 text-xs">
                            <span className="block text-[9px] font-bold text-slate-400 uppercase">{isAr ? 'المشتري' : 'Buyer'}</span>
                            <h4 className="font-black text-slate-900">{lastPlacedOrder.customerName}</h4>
                            <span className="block text-slate-500 font-medium">{lastPlacedOrder.customerPhone}</span>
                          </div>

                          <div className="space-y-1.5 text-xs pt-1">
                            <span className="block text-[9px] font-bold text-slate-400 uppercase">{isAr ? 'عنوان الشحن والتوصيل' : 'Shipping Address'}</span>
                            <h4 className="font-black text-slate-900">{lastPlacedOrder.customerWilaya} • {lastPlacedOrder.customerCommune}</h4>
                            <span className="block text-slate-500 font-medium">{lastPlacedOrder.customerAddress}</span>
                          </div>
                        </div>

                        {/* Bottom half: Financial summaries */}
                        <div className="p-5 pt-8 space-y-4">
                          <div className="space-y-2 text-xs">
                            <span className="block text-[9px] font-bold text-slate-400 uppercase mb-1">{isAr ? 'الملابس المقتناة:' : 'Purchased Styles:'}</span>
                            {lastPlacedOrder.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-baseline gap-2 text-xs">
                                <span className="text-slate-600 line-clamp-1">{item.quantity}x {isAr ? item.productNameAr : item.productNameEn} (مـقاس {item.selectedSize})</span>
                                <span className="font-mono font-bold text-slate-900 shrink-0">{item.price * item.quantity} DA</span>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-slate-100 pt-3 space-y-1.5 text-xs">
                            <div className="flex justify-between text-slate-500 font-semibold">
                              <span>{isAr ? 'مجموع السلع:' : 'Subtotal:'}</span>
                              <span className="font-mono">{lastPlacedOrder.subtotal} DA</span>
                            </div>
                            <div className="flex justify-between text-slate-500 font-semibold">
                              <span>{isAr ? 'تكلفة الشحن:' : 'Delivery fee:'}</span>
                              <span className="font-mono">+{lastPlacedOrder.deliveryFee} DA</span>
                            </div>
                            <div className="flex justify-between items-baseline text-sm font-black text-slate-950 pt-2 border-t border-slate-100/50">
                              <span>{isAr ? 'الحساب المستحق للدفع:' : 'Grand Total Due:'}</span>
                              <span className="text-red-600 font-mono text-base">{lastPlacedOrder.total} DA</span>
                            </div>
                          </div>

                          {/* Dummy barcode decoration for world-class design look */}
                          <div className="pt-2 flex flex-col items-center justify-center">
                            <div className="h-8 bg-slate-900 w-full rounded flex items-end justify-between px-2 text-[6px] text-white opacity-80" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #111, #111 2px, #fff 2px, #fff 6px)' }} />
                            <span className="text-[8px] font-mono font-bold text-slate-400 tracking-widest mt-1.5">VEGES-SBA-2026-ORDER</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* WhatsApp checkup helper */}
                    <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl max-w-md mx-auto text-xs text-emerald-800 flex flex-col sm:flex-row items-center gap-3">
                      <div className="p-2.5 bg-emerald-600 text-white rounded-full">
                        <MessageSquare className="w-5 h-5 animate-pulse" />
                      </div>
                      <div className="text-center sm:text-right">
                        <span className="font-bold text-emerald-950 block">{isAr ? 'هل قمت بإرسال طلب الواتساب؟' : 'Did you send the WhatsApp draft?'}</span>
                        <p className="mt-1 text-emerald-700 leading-relaxed">
                          {isAr 
                            ? 'إذا لم تنفتح نافذة الواتساب تلقائياً، يمكنك إرسال الطلب مجدداً مباشرة للتواصل المباشر مع صاحب المحل لتأكيد المقاسات وتجهيزها.' 
                            : 'If your pop-up was blocked, feel free to send the order manually to open a direct line with the seller.'}
                        </p>
                        
                        {lastPlacedOrder && (
                          <button
                            onClick={() => window.open(generateWhatsAppLink(lastPlacedOrder), '_blank')}
                            className="mt-3.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] rounded-xl transition-all cursor-pointer shadow-md"
                          >
                            {isAr ? 'إعادة الإرسال عبر واتساب الآن' : 'Re-send via WhatsApp Now'}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        onClick={() => {
                          setLastPlacedOrder(null);
                          setCurrentView('storefront');
                        }}
                        className="px-6 py-3 bg-slate-900 hover:bg-slate-950 text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer shadow-md hover:scale-102"
                      >
                        {isAr ? 'العودة للمتجر للتسوق مجدداً' : 'Continue Shopping'}
                      </button>
                    </div>
                  </motion.div>
                );
              }
            })()
          )}
        </AnimatePresence>
      </main>

      {/* Cart side Drawer slide */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        language={language}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckoutClick={() => {
          setIsCartOpen(false);
          setCurrentView('checkout');
        }}
      />

      {/* Product detail overlays */}
      <ProductModal
        product={selectedProductForModal}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProductForModal(null);
        }}
        language={language}
        onAddToCart={handleAddToCart}
      />

      {/* Footer copyright */}
      <footer className="bg-slate-950 text-slate-400 py-10 mt-16 border-t border-white/5 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex justify-center items-center gap-1 text-base sm:text-lg select-none">
            <span className="text-red-500 font-sans font-black">V</span>
            <span className="text-white font-sans font-black">eges</span>
          </div>
          
          <p className="max-w-md mx-auto leading-relaxed text-slate-500">
            {isAr 
              ? 'متجر ملابس عصري راقي لزبائننا في ولاية سيدي بلعباس والوطن. أحدث تصميمات الملابس بأجود الخامات الدفع بعد القياس والتحقق.' 
              : 'The ultimate luxury garment boutique for customers in Sidi Bel Abbes and nationwide. Inspect fabric, try sizing, and enjoy Cash on Delivery.'}
          </p>

          <div className="pt-4 border-t border-white/5 text-[10px] text-slate-600 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span>© {new Date().getFullYear()} VEGES CLOTHING SBA. All Rights Reserved.</span>
            <div className="flex gap-4 font-bold text-slate-500">
              <span className="hover:text-white cursor-pointer">{isAr ? 'سيدي بلعباس - الجزائر' : 'Sidi Bel Abbes, Algeria'}</span>
              <span>•</span>
              <span className="hover:text-white cursor-pointer">{storeSettings.contactPhone}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
