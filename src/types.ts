export type CategoryType = 'jackets' | 'hoodies' | 'shirts' | 'accessories';

export interface ProductColor {
  nameAr: string;
  nameEn: string;
  hex: string;
}

export interface Product {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number; // in DZD (DA)
  originalPrice?: number; // for displaying original price prior to sale/discount
  category: CategoryType;
  images: string[]; // URLs of elegant high-quality clothing images
  sizes: string[]; // e.g. ['S', 'M', 'L', 'XL', 'XXL']
  colors: ProductColor[];
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  salesCount?: number;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: ProductColor;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  productNameAr: string;
  productNameEn: string;
  price: number;
  quantity: number;
  selectedSize: string;
  selectedColor: ProductColor;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerWilaya: string;
  customerCommune: string;
  customerAddress: string;
  deliveryType: 'home' | 'office';
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  commentAr: string;
  commentEn: string;
  date: string;
  locationAr: string;
  locationEn: string;
}

export interface StoreSettings {
  whatsappNumber: string;
  contactPhone: string;
  storeAddressAr: string;
  storeAddressEn: string;
  deliveryFeeBelAbbes: number;
  deliveryFeeOtherWilayas: number;
}
