import React from 'react';
import { motion } from 'motion/react';
import { Star, Eye, Plus } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string | number;
  product: Product;
  language: 'ar' | 'en';
  onProductClick: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export default function ProductCard({
  product,
  language,
  onProductClick,
  onQuickAdd,
}: ProductCardProps) {
  const isAr = language === 'ar';
  
  // Calculate discount percentage if original price is available
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-200 transition-all duration-300 flex flex-col relative"
      id={`product-card-${product.id}`}
    >
      {/* Product Badges (Discount, New, Stock) */}
      <div className="absolute top-3 z-10 flex flex-col gap-1.5 px-3">
        {product.isNew && (
          <span className="bg-slate-900 text-white text-[9px] font-bold px-2 py-1 rounded-md uppercase tracking-wider shadow-sm">
            {isAr ? 'جديد' : 'New'}
          </span>
        )}
        {discountPercent > 0 && (
          <span className="bg-red-600 text-white text-[9px] font-extrabold px-2 py-1 rounded-md shadow-sm">
            -{discountPercent}%
          </span>
        )}
        {!product.inStock && (
          <span className="bg-slate-400 text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-sm">
            {isAr ? 'نفذت الكمية' : 'Out of Stock'}
          </span>
        )}
      </div>

      {/* Product Image Area */}
      <div 
        className="relative overflow-hidden aspect-[4/5] bg-slate-100 cursor-pointer"
        onClick={() => onProductClick(product)}
      >
        <img
          src={product.images[0]}
          alt={isAr ? product.nameAr : product.nameEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
          id={`product-img-${product.id}`}
        />
        
        {/* Hover quick action overlay */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onProductClick(product);
            }}
            className="p-3 bg-white hover:bg-slate-900 hover:text-white text-slate-900 rounded-full shadow-lg hover:scale-115 transition-all cursor-pointer"
            title={isAr ? 'عرض التفاصيل' : 'Quick View'}
          >
            <Eye className="w-4 h-4" />
          </button>
          
          {product.inStock && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAdd(product);
              }}
              className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:scale-115 transition-all cursor-pointer"
              title={isAr ? 'إضافة سريعة' : 'Quick Add'}
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Label */}
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">
            {isAr 
              ? product.category === 'jackets' ? 'جاكيتات ومعاطف' : product.category === 'hoodies' ? 'أطقم وهوديز' : product.category === 'shirts' ? 'قمصان فاخرة' : 'إكسسوارات وساعات'
              : product.category === 'jackets' ? 'Jackets & Coats' : product.category === 'hoodies' ? 'Tracksuits & Hoodies' : product.category === 'shirts' ? 'Premium Shirts' : 'Accessories'}
          </span>

          {/* Title */}
          <h3 
            className="font-bold text-slate-800 text-xs sm:text-sm group-hover:text-red-600 transition-colors cursor-pointer line-clamp-2 leading-tight"
            onClick={() => onProductClick(product)}
          >
            {isAr ? product.nameAr : product.nameEn}
          </h3>

          {/* Sizing Indicator Previews */}
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {product.sizes.map((size) => (
              <span key={size} className="text-[8px] font-bold px-1.5 py-0.5 rounded border border-slate-100 text-slate-500 bg-slate-50/50">
                {size}
              </span>
            ))}
          </div>
        </div>

        {/* Pricing, rating & Add button */}
        <div className="mt-3.5 pt-3.5 border-t border-slate-50 flex items-end justify-between">
          <div className="flex flex-col">
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through leading-none">
                {product.originalPrice} DA
              </span>
            )}
            <span className="text-xs sm:text-sm font-black text-slate-900 font-mono mt-0.5">
              {product.price} DA
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] font-black text-slate-700 flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100/50">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500 shrink-0" />
              {product.rating}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
