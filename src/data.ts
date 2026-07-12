import { Product, Review, StoreSettings } from './types';

export const ALGERIA_WILAYAS = [
  { code: '22', nameAr: '22 - سيدي بلعباس', nameEn: '22 - Sidi Bel Abbes' },
  { code: '16', nameAr: '16 - الجزائر العاصمة', nameEn: '16 - Algiers' },
  { code: '31', nameAr: '31 - وهران', nameEn: '31 - Oran' },
  { code: '25', nameAr: '25 - قسنطينة', nameEn: '25 - Constantine' },
  { code: '13', nameAr: '13 - تلمسان', nameEn: '13 - Tlemcen' },
  { code: '29', nameAr: '29 - معسكر', nameEn: '29 - Mascara' },
  { code: '27', nameAr: '27 - مستغانم', nameEn: '27 - Mostaganem' },
  { code: '02', nameAr: '02 - الشلف', nameEn: '02 - Chlef' },
  { code: '05', nameAr: '05 - باتنة', nameEn: '05 - Batna' },
  { code: '06', nameAr: '06 - بجاية', nameEn: '06 - Bejaia' },
  { code: '09', nameAr: '09 - البليدة', nameEn: '09 - Blida' },
  { code: '15', nameAr: '15 - تيزي وزو', nameEn: '15 - Tizi Ouzou' },
  { code: '19', nameAr: '19 - سطيف', nameEn: '19 - Setif' },
  { code: '30', nameAr: '30 - ورقلة', nameEn: '30 - Ouargla' },
  { code: '35', nameAr: '35 - بومرداس', nameEn: '35 - Boumerdes' },
  { code: '39', nameAr: '39 - الوادي', nameEn: '39 - El Oued' },
  { code: '47', nameAr: '47 - غرداية', nameEn: '47 - Ghardaia' },
  { code: '48', nameAr: '48 - غليزان', nameEn: '48 - Relizane' }
];

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  whatsappNumber: '+213663899208', // can be customized in Owner Admin
  contactPhone: '0663 89 92 08',
  storeAddressAr: 'شارع مكة (المكتة)، مقابل ساحة أول نوفمبر، سيدي بلعباس',
  storeAddressEn: 'Mecta Street, opposite 1st November Square, Sidi Bel Abbes',
  deliveryFeeBelAbbes: 300, // 300 DA for local delivery
  deliveryFeeOtherWilayas: 600 // 600 DA for other wilayas
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    nameAr: 'جاكيت جلدي كلاسيكي فاخر',
    nameEn: 'Classic Premium Leather Jacket',
    descriptionAr: 'جاكيت جلدي فاخر مصنوع من الجلد الصناعي عالي الجودة المقاوم للماء والرياح. تصميم عصري وأنيق يناسب فصلي الخريف والشتاء، ومثالي للمظهر اليومي الأنيق والراقي للرجل العصري.',
    descriptionEn: 'Premium leather jacket crafted with top-tier windproof and water-resistant materials. A timeless classic design perfect for autumn and winter, offering a stylish, comfortable, and modern look for the elegant gentleman.',
    price: 6800,
    originalPrice: 8500,
    category: 'jackets',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=600&auto=format&fit=crop&q=80'
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { nameAr: 'أسود داكن', nameEn: 'Jet Black', hex: '#111827' },
      { nameAr: 'بني عسلي', nameEn: 'Tan Brown', hex: '#7c2d12' }
    ],
    rating: 4.8,
    reviewsCount: 24,
    inStock: true,
    isFeatured: true,
    isNew: false,
    salesCount: 42
  },
  {
    id: 'p2',
    nameAr: 'هودي قطني ناعم مريح',
    nameEn: 'Ultra-Soft Cotton Hoodie',
    descriptionAr: 'هودي مصنوع من القطن الطبيعي 100%، دافئ وناعم للغاية من الداخل. يتميز بجيب أمامي واسع وغطاء رأس قابل للتعديل برباط، وهو الخيار الأمثل للراحة اليومية الكاجوال والإطلالة الرياضية الأنيقة.',
    descriptionEn: 'Made with 100% breathable organic cotton, brushed interior for maximum warmth. Features an adjustable drawstring hood and a spacious kangaroo pocket, ideal for daily casual wear.',
    price: 3400,
    originalPrice: 4200,
    category: 'hoodies',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { nameAr: 'رمادي ميلانغ', nameEn: 'Melange Grey', hex: '#9ca3af' },
      { nameAr: 'أزرق كحلي', nameEn: 'Navy Blue', hex: '#1e3a8a' },
      { nameAr: 'أسود', nameEn: 'Black', hex: '#111827' }
    ],
    rating: 4.6,
    reviewsCount: 18,
    inStock: true,
    isFeatured: false,
    isNew: true,
    salesCount: 12
  },
  {
    id: 'p3',
    nameAr: 'قميص كتان صيفي فاخر',
    nameEn: 'Premium Summer Linen Shirt',
    descriptionAr: 'قميص رجالي مصنوع من ألياف الكتان الطبيعية 100%، خفيف للغاية وبارد ومناسب للأجواء الحارة والخرجات الصيفية الأنيقة والمناسبات غير الرسمية.',
    descriptionEn: 'Premium linen shirt for men crafted from 100% natural linen fibers. Extremely light, breathable, and highly comfortable, perfect for summer outings and smart-casual looks.',
    price: 5200,
    originalPrice: 5900,
    category: 'shirts',
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { nameAr: 'أبيض أنيق', nameEn: 'Elegant White', hex: '#f8fafc' },
      { nameAr: 'أزرق سماوي', nameEn: 'Sky Blue', hex: '#bae6fd' }
    ],
    rating: 4.9,
    reviewsCount: 31,
    inStock: true,
    isFeatured: true,
    isNew: true,
    salesCount: 56
  },
  {
    id: 'p4',
    nameAr: 'سترة جينز رجالية عصرية',
    nameEn: 'Classic Denim Men Jacket',
    descriptionAr: 'سترة جينز متينة ومريحة للغاية بتصميم كلاسيكي عصري جذاب. مصنوعة من قماش الدنيم الفاخر المغسول وتتميز بجيوب أمامية وأزرار معدنية متينة، مثالية للتنسيق مع التيشرتات والقمصان.',
    descriptionEn: 'Timeless heavy-duty denim jacket for men with a classic vintage wash design. Features functional chest pockets and button closures, making it a highly versatile styling layer.',
    price: 4500,
    category: 'jackets',
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { nameAr: 'أزرق كلاسيكي', nameEn: 'Classic Denim Blue', hex: '#3b82f6' }
    ],
    rating: 4.7,
    reviewsCount: 15,
    inStock: true,
    isFeatured: false,
    isNew: false,
    salesCount: 22
  },
  {
    id: 'p5',
    nameAr: 'بدلة قطنية رياضية فاخرة',
    nameEn: 'Premium Cotton Tracksuit Set',
    descriptionAr: 'طقم رجالي قطني رياضي يتكون من هودي دافئ مع سروال رياضي مطابق. مصمم لراحة مطلقة أثناء التمارين أو المشي والخرجات اليومية، ومقاوم للغسيل المتكرر مع الحفاظ على النعومة والألوان.',
    descriptionEn: 'Elegant premium organic cotton athletic set for men, featuring a relaxed hoodie and matching joggers. Engineered for maximum comfort, breathability, and everyday sporty styles.',
    price: 5800,
    originalPrice: 6500,
    category: 'hoodies',
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80'
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { nameAr: 'أسود فحمي', nameEn: 'Charcoal Black', hex: '#1e293b' },
      { nameAr: 'رمادي رياضي', nameEn: 'Sporty Grey', hex: '#cbd5e1' }
    ],
    rating: 4.5,
    reviewsCount: 9,
    inStock: true,
    isFeatured: false,
    isNew: true,
    salesCount: 8
  },
  {
    id: 'p6',
    nameAr: 'معطف شتوي ثقيل عازل للبرد',
    nameEn: 'Men Warm Winter Parka',
    descriptionAr: 'معطف سميك ومقاوم للماء للرجال، مزود ببطانة صوفية دافئة للغاية وقبعة فرو مبطنة عازلة للبرد الشديد والرياح والأمطار. مثالي للأجواء الباردة جداً والسفر والخرجات الشتوية.',
    descriptionEn: 'Insulated waterproof winter parka for men. Features thick thermal lining, robust zipper closures, and a cozy faux-fur trim hood to protect from cold winds during winter days.',
    price: 8900,
    category: 'jackets',
    images: [
      'https://images.unsplash.com/photo-1544923246-77307dd654cb?w=600&auto=format&fit=crop&q=80'
    ],
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { nameAr: 'أسود كلاسيكي', nameEn: 'Classic Black', hex: '#0f172a' },
      { nameAr: 'أخضر زيتي', nameEn: 'Olive Green', hex: '#3f6212' }
    ],
    rating: 4.8,
    reviewsCount: 14,
    inStock: true,
    isFeatured: true,
    isNew: false,
    salesCount: 19
  },
  {
    id: 'p7',
    nameAr: 'ساعة كوارتز كرونوغراف كلاسيكية',
    nameEn: 'Classic Chronograph Quartz Watch',
    descriptionAr: 'ساعة يد كلاسيكية فاخرة بهيكل من الفولاذ المقاوم للصدأ وحزام جلدي طبيعي فاخر. مقاومة للماء والخدوش وتتميز بعرض التاريخ وساعة توقيت مدمجة لمظهر شديد الجاذبية والأناقة للرجل القيادي.',
    descriptionEn: 'Luxury quartz wristwatch featuring a solid stainless steel case, genuine stitched leather strap, scratch-resistant mineral glass, and date and stopwatch complications. A perfect gift.',
    price: 8900,
    originalPrice: 11500,
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
    ],
    sizes: ['One Size'],
    colors: [
      { nameAr: 'بني ملكي', nameEn: 'Royal Brown', hex: '#78350f' },
      { nameAr: 'أسود ملكي', nameEn: 'Royal Black', hex: '#0f172a' }
    ],
    rating: 4.9,
    reviewsCount: 40,
    inStock: true,
    isFeatured: true,
    isNew: false,
    salesCount: 61
  },
  {
    id: 'p8',
    nameAr: 'نظارات شمسية ذات تصميم إيطالي',
    nameEn: 'Luxury Italian-Design Sunglasses',
    descriptionAr: 'نظارات شمسية عصرية مستوحاة من الموضة الإيطالية الفاخرة للرجال، توفر حماية بنسبة 100% من الأشعة فوق البنفسجية UV400. هيكل متين للغاية وخفيف الوزن يمنحك راحة وثقة عالية.',
    descriptionEn: 'Chic designer sunglasses with 100% UV400 polarised lenses to protect your eyes. Extremely lightweight, heavy-duty frame designed for all-day comfort and a bold, polished appearance.',
    price: 3200,
    category: 'accessories',
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80'
    ],
    sizes: ['One Size'],
    colors: [
      { nameAr: 'أسود كلاسيكي', nameEn: 'Classic Dark Black', hex: '#1e293b' },
      { nameAr: 'بني منقط', nameEn: 'Tortoise Brown', hex: '#451a03' }
    ],
    rating: 4.7,
    reviewsCount: 21,
    inStock: true,
    isFeatured: false,
    isNew: true,
    salesCount: 30
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    customerName: 'سفيان بن عيسى',
    rating: 5,
    commentAr: 'الجاكيت الجلدي الذي اشتريته من متجر Veges ذو جودة رائعة وخدمة التوصيل سريعة جداً هنا في سيدي بلعباس (وصلني لباب البيت في سيدي الجيلالي في أقل من 3 ساعات!). أنصح بالتعامل معهم بشدة.',
    commentEn: 'The leather jacket I bought from Veges has stellar quality, and their local delivery in Sidi Bel Abbes is lightning fast (arrived in Sidi Djillali in less than 3 hours!). Highly recommended!',
    date: '2026-07-01',
    locationAr: 'حي سيدي الجيلالي، بلعباس',
    locationEn: 'Sidi Djillali, Bel Abbes'
  },
  {
    id: 'r2',
    customerName: 'بلال دحماني',
    rating: 5,
    commentAr: 'قميص الكتان الصيفي رائع للغاية وقماشه بارد ومريح جداً في الصيف، والمقاس مضبوط تماماً. قمت بالدفع عند الاستلام والمعاملة كانت قمة في الاحترام.',
    commentEn: 'The linen summer shirt is amazing, fabric is light and highly comfortable, and sizing was absolutely spot on. Paid cash on delivery and the treatment was super respectful!',
    date: '2026-07-08',
    locationAr: 'وسط المدينة، بلعباس',
    locationEn: 'Downtown, Bel Abbes'
  },
  {
    id: 'r3',
    customerName: 'عادل منصوري',
    rating: 4,
    commentAr: 'ساعة يد ممتازة وتغليف راقي جداً يصلح كهدية فاخرة. قمت بالطلب عن طريق الواتساب وتم الرد وتأكيد الطلب فوراً. تحياتي لمتجر فيجيس.',
    commentEn: 'Excellent watch, premium packaging suitable for luxury gifting. I ordered via WhatsApp and the response was instant. Congratulations on the world-class execution, Veges!',
    date: '2026-07-10',
    locationAr: 'سيدي ياسين، بلعباس',
    locationEn: 'Sidi Yacine, Bel Abbes'
  }
];
