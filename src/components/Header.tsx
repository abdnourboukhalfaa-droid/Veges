import React from 'react';
import { ShoppingBag, Search, ShieldCheck, Globe, Settings, MapPin, Menu, X } from 'lucide-react';
import { CategoryType } from '../types';

interface HeaderProps {
  language: 'ar' | 'en';
  setLanguage: (lang: 'ar' | 'en') => void;
  activeCategory: CategoryType | 'all';
  setActiveCategory: (cat: CategoryType | 'all') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartCount: number;
  onCartClick: () => void;
  isAdminMode: boolean;
  setIsAdminMode: (mode: boolean) => void;
}

export default function Header({
  language,
  setLanguage,
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  cartCount,
  onCartClick,
  isAdminMode,
  setIsAdminMode,
}: HeaderProps) {
  const isAr = language === 'ar';
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const categories: { value: CategoryType | 'all'; labelAr: string; labelEn: string }[] = [
    { value: 'all', labelAr: 'الكل', labelEn: 'All' },
    { value: 'jackets', labelAr: 'جاكيتات ومعاطف 🧥', labelEn: 'Coats & Jackets' },
    { value: 'hoodies', labelAr: 'أطقم وهوديز 👕', labelEn: 'Tracksuits & Hoodies' },
    { value: 'shirts', labelAr: 'قمصان فاخرة 👔', labelEn: 'Premium Shirts' },
    { value: 'accessories', labelAr: 'إكسسوارات وساعات 🕶️', labelEn: 'Accessories' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950 text-white shadow-xl" id="veges-navbar">
      {/* Top micro-bar */}
      <div className="bg-red-600 px-4 py-1.5 text-center text-[11px] font-medium tracking-wider flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-1 text-white">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{isAr ? 'توصيل متوفر لولاية سيدي بلعباس و 58 ولاية • الدفع عند الاستلام' : 'Delivery to Sidi Bel Abbes & 58 Wilayas • Cash on Delivery'}</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span className="opacity-85">{isAr ? 'اطلب مباشرة عبر واتساب' : 'Order directly via WhatsApp'}</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
        {/* Logo and SBA Badge */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              setActiveCategory('all');
              setIsAdminMode(false);
            }} 
            className="flex items-center gap-1 select-none cursor-pointer"
          >
            {/* The V is in RED and eges is in WHITE */}
            <span className="text-4xl font-black tracking-tight font-sans text-red-600">V</span>
            <span className="text-3xl font-black tracking-tight font-sans text-white">eges</span>
          </button>
          
          <div className="hidden md:flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full border border-white/15 text-[10px] font-bold text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-red-500 animate-bounce" />
            <span>{isAr ? 'سيدي بلعباس' : 'Sidi Bel Abbes'}</span>
          </div>
        </div>

        {/* Desktop Category Navigation */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2 py-1">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setActiveCategory(cat.value);
                setIsAdminMode(false);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat.value && !isAdminMode
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {isAr ? cat.labelAr : cat.labelEn}
            </button>
          ))}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-3 flex-1 max-w-xs md:max-w-sm lg:max-w-xs justify-end">
          {/* Search bar */}
          <div className="relative w-full hidden sm:block">
            <input
              type="text"
              placeholder={isAr ? 'ابحث عن ملابس...' : 'Search clothing...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/15 text-xs text-white px-3.5 py-2.5 pl-9 rounded-full outline-none focus:border-red-500 focus:bg-white/15 focus:ring-4 focus:ring-red-500/10 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          {/* Language toggle */}
          <button
            onClick={() => setLanguage(isAr ? 'en' : 'ar')}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all cursor-pointer text-slate-300 hover:text-white flex items-center justify-center"
            title={isAr ? 'English' : 'العربية'}
          >
            <Globe className="w-4.5 h-4.5" />
          </button>

          {/* Seller / Admin Button */}
          <button
            onClick={() => setIsAdminMode(!isAdminMode)}
            className={`p-2.5 rounded-full border transition-all cursor-pointer flex items-center justify-center ${
              isAdminMode 
                ? 'bg-red-600 border-red-500 text-white animate-pulse'
                : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300 hover:text-white'
            }`}
            title={isAr ? 'لوحة تحكم البائع' : 'Seller Dashboard'}
          >
            <Settings className="w-4.5 h-4.5" />
          </button>

          {/* Cart Icon Button with Floating Badge */}
          <button
            onClick={onCartClick}
            className="relative p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all cursor-pointer shadow-lg shadow-red-600/25 hover:scale-105 active:scale-95 flex items-center justify-center"
          >
            <ShoppingBag className="w-4.5 h-4.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-white text-red-600 text-[10px] font-black w-5 h-5 rounded-full border-2 border-slate-950 flex items-center justify-center animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all cursor-pointer text-slate-300 hover:text-white lg:hidden flex items-center justify-center"
          >
            {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-white/10 px-4 py-4 space-y-4">
          {/* Mobile Search */}
          <div className="relative w-full sm:hidden">
            <input
              type="text"
              placeholder={isAr ? 'ابحث عن ملابس...' : 'Search clothing...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/15 text-xs text-white px-3.5 py-2.5 pl-9 rounded-full outline-none focus:border-red-500 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          {/* Category List */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold uppercase text-slate-500 px-3">{isAr ? 'التصنيفات' : 'Categories'}</span>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => {
                  setActiveCategory(cat.value);
                  setIsAdminMode(false);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-right sm:text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                  activeCategory === cat.value && !isAdminMode
                    ? 'bg-red-600 text-white font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{isAr ? cat.labelAr : cat.labelEn}</span>
                {activeCategory === cat.value && !isAdminMode && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
              </button>
            ))}
          </div>

          {/* SBA Location Badges and Settings */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>{isAr ? 'سيدي بلعباس، الجزائر' : 'Sidi Bel Abbes, Algeria'}</span>
            </div>
            <button
              onClick={() => {
                setIsAdminMode(!isAdminMode);
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-1 text-slate-300 font-bold bg-white/5 px-2.5 py-1 rounded-lg border border-white/15"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{isAr ? 'لوحة البائع' : 'Seller Admin'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
