import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'ar' | 'en';
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, size: string, colorHex: string, delta: number) => void;
  onRemoveItem: (productId: string, size: string, colorHex: string) => void;
  onCheckoutClick: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  language,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutClick,
}: CartDrawerProps) {
  const isAr = language === 'ar';
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-shell">
          {/* Dark overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950 cursor-pointer"
          />

          {/* Drawer Body */}
          <div className={`absolute inset-y-0 max-w-md w-full bg-white shadow-2xl flex flex-col ${isAr ? 'left-0' : 'right-0'}`}>
            {/* Slide-in motion container */}
            <motion.div
              initial={{ x: isAr ? '-100%' : '100%' }}
              animate={{ x: 0 }}
              exit={{ x: isAr ? '-100%' : '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="h-full flex flex-col justify-between"
            >
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-red-50 text-red-600 rounded-xl">
                    <ShoppingBag className="w-5 h-5" />
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">
                    {isAr ? 'سلة المشتريات' : 'Shopping Cart'}
                  </h2>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                    <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                      <ShoppingBag className="w-9 h-9" />
                    </div>
                    <h3 className="font-bold text-slate-700 text-sm">
                      {isAr ? 'سلة المشتريات فارغة' : 'Your cart is empty'}
                    </h3>
                    <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                      {isAr 
                        ? 'تصفح تشكيلة ملابس Veges الراقية وأضف ما يعجبك لتسوق ممتع.' 
                        : 'Explore our latest collection and add elegant pieces to your shopping cart.'}
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md shadow-red-600/15"
                    >
                      {isAr ? 'ابدأ التسوق الآن' : 'Start Shopping'}
                    </button>
                  </div>
                ) : (
                  cartItems.map((item, idx) => (
                    <div
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.hex}`}
                      className="flex gap-3 pb-4 border-b border-slate-100 last:border-b-0"
                    >
                      {/* Product Thumbnail */}
                      <div className="w-16 h-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={isAr ? item.product.nameAr : item.product.nameEn}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Product Item info and controls */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <h4 className="font-bold text-slate-800 text-xs line-clamp-1">
                              {isAr ? item.product.nameAr : item.product.nameEn}
                            </h4>
                            <button
                              onClick={() => onRemoveItem(item.product.id, item.selectedSize, item.selectedColor.hex)}
                              className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                              title={isAr ? 'حذف من السلة' : 'Remove item'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Selected characteristics */}
                          <div className="flex items-center gap-2 mt-1 flex-wrap text-[10px]">
                            <span className="text-slate-400 font-bold bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                              {isAr ? 'المقاس:' : 'Size:'} <span className="text-slate-700 font-black">{item.selectedSize}</span>
                            </span>
                            <span className="flex items-center gap-1 text-slate-400 font-bold bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                              <span>{isAr ? 'اللون:' : 'Color:'}</span>
                              <span className="w-2.5 h-2.5 rounded-full border border-slate-300" style={{ backgroundColor: item.selectedColor.hex }}></span>
                              <span className="text-slate-700 font-black">{isAr ? item.selectedColor.nameAr : item.selectedColor.nameEn}</span>
                            </span>
                          </div>
                        </div>

                        {/* Quantity and Price row */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
                          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.selectedColor.hex, -1)}
                              className="p-1 hover:bg-white hover:text-slate-900 rounded cursor-pointer transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-black px-2.5 text-slate-950 font-mono">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.selectedSize, item.selectedColor.hex, 1)}
                              className="p-1 hover:bg-white hover:text-slate-900 rounded cursor-pointer transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-xs font-black text-slate-900 font-mono">
                            {item.product.price * item.quantity} DA
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Drawer Footer and Checkout buttons */}
              {cartItems.length > 0 && (
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-500">{isAr ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                    <span className="text-base font-black text-slate-950 font-mono">{subtotal} DA</span>
                  </div>

                  <p className="text-[10px] text-slate-400 text-center leading-relaxed font-semibold">
                    {isAr 
                      ? 'يتم حساب رسوم التوصيل لبلعباس وباقي الولايات في خطوة تأكيد الطلب.' 
                      : 'Delivery fees are calculated based on your Wilaya in the next checkout step.'}
                  </p>

                  <button
                    onClick={onCheckoutClick}
                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-2xl transition-all duration-300 shadow-xl shadow-red-600/25 flex items-center justify-center gap-2 hover:scale-[1.01] cursor-pointer"
                  >
                    <span>{isAr ? 'المتابعة لإتمام الطلب' : 'Proceed to Checkout'}</span>
                    {isAr ? <ArrowLeft className="w-4 h-4 text-red-200" /> : <ArrowRight className="w-4 h-4 text-red-200" />}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
