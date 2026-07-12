import React, { useState } from 'react';
import { X, Star, ShoppingBag, Check, Shield, Truck, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, ProductColor, Review } from '../types';
import { MOCK_REVIEWS } from '../data';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  language: 'ar' | 'en';
  onAddToCart: (product: Product, size: string, color: ProductColor, quantity: number) => void;
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
  language,
  onAddToCart,
}: ProductModalProps) {
  if (!product) return null;
  const isAr = language === 'ar';

  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'One Size');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [successMsg, setSuccessMsg] = useState(false);

  // Sync state if product changes
  React.useEffect(() => {
    setActiveImage(product.images[0]);
    setSelectedSize(product.sizes[0] || 'One Size');
    setSelectedColor(product.colors[0]);
    setQuantity(1);
    setSuccessMsg(false);
  }, [product]);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Filter reviews for this category or generate mock ones for the product
  const productReviews = MOCK_REVIEWS.slice(0, 3);

  const handleAddToCartSubmit = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4" id="product-modal-container">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950 cursor-pointer"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-800 hover:text-slate-900 rounded-full transition-all cursor-pointer z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Image Gallery */}
            <div className="flex flex-col gap-3">
              {/* Main Image */}
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                <img
                  src={activeImage}
                  alt={isAr ? product.nameAr : product.nameEn}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                {discountPercent > 0 && (
                  <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-lg">
                    -{discountPercent}% {isAr ? 'تخفيض' : 'OFF'}
                  </span>
                )}
              </div>

              {/* Gallery Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2.5">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden bg-slate-50 border transition-all cursor-pointer ${
                        activeImage === img ? 'border-red-600 ring-2 ring-red-600/10 scale-95' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}

              {/* Store guarantee items */}
              <div className="mt-4 p-3 bg-slate-50/50 rounded-xl border border-slate-100/50 space-y-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="font-medium">
                    {isAr 
                      ? 'الدفع عند الاستلام بعد معاينة السلع وقياسها!' 
                      : 'Cash on delivery: Pay only after verifying & trying on the garment!'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-red-600 shrink-0" />
                  <span className="font-medium">
                    {isAr 
                      ? 'منتجات أصلية ذات جودة ممتازة وضمان استبدال خلال 48 ساعة.' 
                      : '100% original premium garments, 48-hour easy exchange guarantee.'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Garment details & customization */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Categories */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {isAr ? 'متجر VEGES بلعباس' : 'VEGES SBA STORE'}
                  </span>
                  {product.isNew && (
                    <span className="text-[10px] font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded-full">
                      {isAr ? 'جديد' : 'NEW'}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  {isAr ? product.nameAr : product.nameEn}
                </h1>

                {/* Rating & reviews */}
                <div className="flex items-center gap-1.5 mt-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.floor(product.rating)
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-black text-slate-700 font-mono">
                    {product.rating}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500 font-medium">
                    {product.reviewsCount} {isAr ? 'تقييم من زبائننا' : 'customer reviews'}
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
                    {product.price} DA
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-slate-400 line-through font-medium">
                      {product.originalPrice} DA
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mt-4">
                  {isAr ? product.descriptionAr : product.descriptionEn}
                </p>

                {/* Custom Options selectors: Size Selector */}
                <div className="mt-5">
                  <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block mb-2">
                    {isAr ? 'اختر المقاس المتاح:' : 'Select Available Size:'}
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-10 h-10 px-3 rounded-xl text-xs font-black transition-all cursor-pointer border flex items-center justify-center ${
                          selectedSize === size
                            ? 'border-red-600 bg-red-600 text-white shadow-md shadow-red-600/20'
                            : 'border-slate-200 bg-white hover:border-slate-400 text-slate-800'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Selector */}
                <div className="mt-5">
                  <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block mb-2">
                    {isAr ? 'اختر اللون المتوفر:' : 'Select Available Color:'}
                  </span>
                  <div className="flex gap-3 flex-wrap">
                    {product.colors.map((color) => (
                      <button
                        key={color.hex}
                        onClick={() => setSelectedColor(color)}
                        className={`w-9 h-9 rounded-full border transition-all cursor-pointer flex items-center justify-center relative ${
                          selectedColor.hex === color.hex
                            ? 'ring-4 ring-red-600/25 border-red-600 scale-105'
                            : 'border-slate-200 hover:scale-105'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={isAr ? color.nameAr : color.nameEn}
                      >
                        {selectedColor.hex === color.hex && (
                          <Check className={`w-4 h-4 ${color.hex === '#111827' || color.hex === '#0f172a' ? 'text-white' : 'text-slate-900 font-bold'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1.5 block font-semibold">
                    {isAr ? 'اللون المحدد:' : 'Selected color:'} <span className="text-slate-700 font-bold">{isAr ? selectedColor.nameAr : selectedColor.nameEn}</span>
                  </span>
                </div>

                {/* Quantities indicator */}
                <div className="mt-5 flex items-center gap-3">
                  <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                    {isAr ? 'الكمية:' : 'Qty:'}
                  </span>
                  <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 border border-slate-150 flex items-center justify-center font-bold text-slate-800 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="text-xs font-black px-4 text-slate-900 font-mono">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-slate-50 border border-slate-150 flex items-center justify-center font-bold text-slate-800 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-5 border-t border-slate-100">
                <button
                  onClick={handleAddToCartSubmit}
                  className={`w-full py-4 rounded-2xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xl ${
                    successMsg
                      ? 'bg-emerald-600 text-white shadow-emerald-600/25'
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/25 hover:scale-[1.01] active:scale-95'
                  }`}
                >
                  {successMsg ? (
                    <React.Fragment>
                      <Check className="w-4 h-4 text-white" />
                      <span>{isAr ? 'تمت الإضافة للسلة بنجاح!' : 'Added to Cart Successfully!'}</span>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <ShoppingBag className="w-4 h-4 text-white" />
                      <span>{isAr ? `إضافة إلى السلة (${product.price * quantity} DA)` : `Add to Cart (${product.price * quantity} DA)`}</span>
                    </React.Fragment>
                  )}
                </button>
              </div>

              {/* Immersive Social Reviews */}
              <div className="mt-6 border-t border-slate-100 pt-5">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                  {isAr ? 'آراء زبائننا في بلعباس:' : 'Customer Feedbacks in SBA:'}
                </h4>
                <div className="space-y-3">
                  {productReviews.map((rev) => (
                    <div key={rev.id} className="bg-slate-50/50 border border-slate-100 p-2.5 rounded-xl text-[11px]">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-slate-800">{rev.customerName}</span>
                        <span className="text-[10px] text-red-600 font-bold">{isAr ? rev.locationAr : rev.locationEn}</span>
                      </div>
                      <div className="flex items-center gap-0.5 mb-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <p className="text-slate-600 leading-relaxed italic">
                        {isAr ? rev.commentAr : rev.commentEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
