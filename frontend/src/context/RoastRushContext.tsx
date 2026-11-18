import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  CartItem,
  FlashSaleCampaign,
  FlashSaleItem,
  GrindOption,
  Order,
  OrderStatus,
  PaymentProvider,
  PaymentStatus,
  PaymentTransaction,
  ProcessMethod,
  Product,
  ReservationStatus,
  RoastLevel,
  StockReservation,
} from '../types/domain.types';
import {
  formatVnd,
  INITIAL_FLASH_SALE_CAMPAIGN,
  SPECIALTY_PRODUCTS,
} from '../data/mockData';
import { generateIdempotencyKey } from '../lib/http/axiosClient';
import { AdminTab } from '../components/layout/admin/AdminSidebar';

export type ActivePage =
  | 'HOME'
  | 'FLASH_SALE'
  | 'CATALOG'
  | 'PRODUCT_DETAIL'
  | 'CHECKOUT'
  | 'ORDERS'
  | 'PROFILE'
  | 'LOGIN'
  | 'REGISTER'
  | 'ADMIN_DASHBOARD';

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  defaultAddress: string;
  role: 'CUSTOMER' | 'ADMIN';
  memberTier: 'MEMBER' | 'GOLD' | 'ROASTER_VIP';
}

export interface ToastNotification {
  type: 'success' | 'error' | 'warn';
  text: string;
}

export interface NewProductInput {
  name: string;
  originCountry: string;
  region: string;
  varietal: string;
  altitudeMasl: string;
  cuppingScore: number;
  basePriceVnd: number;
  availableStock: number;
  shortDescription: string;
  tastingNotes: string[];
  thumbnailUrl: string;
}

export interface CustomerReview {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  brewMethod: string;
  comment: string;
  createdAt: string;
}

export interface VoucherInfo {
  code: string;
  description: string;
  discountType: 'FIXED' | 'PERCENT';
  value: number;
  minOrderVnd: number;
  maxDiscountVnd?: number;
}

export const AVAILABLE_VOUCHERS: VoucherInfo[] = [
  {
    code: 'ROAST50K',
    description: 'Giảm 50.000₫ cho đơn từ 400.000₫',
    discountType: 'FIXED',
    value: 50000,
    minOrderVnd: 400000,
  },
  {
    code: 'GEISHA10',
    description: 'Giảm 10% tối đa 150.000₫ cho đơn từ 600.000₫',
    discountType: 'PERCENT',
    value: 10,
    minOrderVnd: 600000,
    maxDiscountVnd: 150000,
  },
  {
    code: 'NEWMEMBER',
    description: 'Giảm 30.000₫ chào mừng thành viên mới',
    discountType: 'FIXED',
    value: 30000,
    minOrderVnd: 200000,
  },
];

const INITIAL_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-01',
    authorName: 'Trần Hoàng Nam',
    rating: 5,
    brewMethod: 'Pour Over V60 (92°C)',
    comment: 'Hương hoa nhài và cam Bergamot lên cực kỳ rõ ngay từ lúc bloom. Hậu vị ngọt sâu như trà Ô long.',
    createdAt: '16/11/2026',
  },
  {
    id: 'rev-2',
    productId: 'prod-01',
    authorName: 'Lê Thu Hà',
    rating: 5,
    brewMethod: 'Origami Dripper',
    comment: 'Mẻ rang rất đều, hạt sáng đẹp. Khi nguội dần hương đào trắng nổi bật, đáng đồng tiền bát gạo!',
    createdAt: '17/11/2026',
  },
  {
    id: 'rev-3',
    productId: 'prod-02',
    authorName: 'Phạm Quốc Bảo',
    rating: 5,
    brewMethod: 'Espresso & V60',
    comment: 'Anaerobic 96h của Ethiopia Alo thực sự bùng nổ mùi dâu tây chín và rượu vang nhiệt đới.',
    createdAt: '17/11/2026',
  },
];

const INITIAL_DEMO_ORDERS: Order[] = [
  {
    id: 'ord-demo-1001',
    orderCode: 'RR1118-8821',
    userId: 'usr-demo-1',
    status: OrderStatus.PAID,
    items: [
      {
        id: 'oi-1',
        orderId: 'RR1118-8821',
        skuId: 'sku-panama-geisha-250',
        productName: 'Panama Boquete Hacienda Geisha (SCA 91.5)',
        skuCode: 'PNM-GEISHA-250G-WB',
        weightGrams: 250,
        grindOption: GrindOption.WHOLE_BEAN,
        quantity: 1,
        unitPriceVnd: 890000,
        subtotalVnd: 890000,
        flashSaleItemId: 'fs-item-01',
      },
    ],
    shippingAddress: {
      recipientName: 'Nguyễn Minh Quân',
      recipientPhone: '0908123456',
      province: 'TP. Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Phường Bến Nghé',
      streetAddress: '68 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
      deliveryNote: 'Giao giờ hành chính, giữ nguyên hạt',
    },
    subtotalAmountVnd: 890000,
    shippingFeeVnd: 0,
    discountAmountVnd: 50000,
    totalPayableVnd: 840000,
    createdAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    paidAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
  },
  {
    id: 'ord-demo-1002',
    orderCode: 'RR1118-7640',
    userId: 'usr-demo-2',
    status: OrderStatus.ROASTING_PACKING,
    items: [
      {
        id: 'oi-2',
        orderId: 'RR1118-7640',
        skuId: 'sku-ethiopia-alo-250',
        productName: 'Ethiopia Alo Village Anaerobic 96h (SCA 89.2)',
        skuCode: 'ETH-ALO-250G-WB',
        weightGrams: 250,
        grindOption: GrindOption.POUR_OVER_V60,
        quantity: 2,
        unitPriceVnd: 680000,
        subtotalVnd: 1360000,
      },
    ],
    shippingAddress: {
      recipientName: 'Lê Thu Hà',
      recipientPhone: '0987654321',
      province: 'Hà Nội',
      district: 'Quận Hoàn Kiếm',
      ward: 'Phường Tràng Tiền',
      streetAddress: '45 Lý Thường Kiệt, Quận Hoàn Kiếm, Hà Nội',
    },
    subtotalAmountVnd: 1360000,
    shippingFeeVnd: 0,
    discountAmountVnd: 0,
    totalPayableVnd: 1360000,
    createdAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
    paidAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
  },
];

const INITIAL_DEMO_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: 'tx-demo-9001',
    orderCode: 'RR1118-8821',
    transactionRef: 'VNPAY-20261118-882104',
    providerTransactionNo: '145892014',
    provider: PaymentProvider.VNPAY,
    amountVnd: 840000,
    status: PaymentStatus.SUCCESS,
    idempotencyKey: 'a9e41d22-7c1b-4c51-b9a8-2b6e410c8821',
    signatureVerified: true,
    processedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
  },
  {
    id: 'tx-demo-9002',
    orderCode: 'RR1118-7640',
    transactionRef: 'MOMO-20261118-764099',
    providerTransactionNo: '4109283741',
    provider: PaymentProvider.MOMO,
    amountVnd: 1360000,
    status: PaymentStatus.SUCCESS,
    idempotencyKey: 'f23b90a1-18d4-4390-9f11-88c219a07640',
    signatureVerified: true,
    processedAt: new Date(Date.now() - 3600 * 1000 * 5).toISOString(),
  },
];

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export interface NewFlashSaleItemInput {
  productId: string;
  salePriceVnd: number;
  totalAllocatedStock: number;
  maxPerCustomer: number;
}

interface RoastRushContextValue {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  adminActiveTab: AdminTab;
  setAdminActiveTab: (tab: AdminTab) => void;
  selectedProduct: Product | null;
  openProductDetail: (product: Product) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  // Wishlist
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  // Mini Cart Drawer
  isMiniCartOpen: boolean;
  setIsMiniCartOpen: (open: boolean) => void;
  // Auth & Profile
  currentUser: UserProfile | null;
  loginUser: (email: string, password: string, asAdmin?: boolean) => void;
  registerUser: (fullName: string, email: string, phone: string, password: string) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  logoutUser: () => void;
  // Products & Flash Sale
  campaign: FlashSaleCampaign;
  products: Product[];
  selectedGrind: Record<string, GrindOption>;
  setGrindForProduct: (productId: string, grind: GrindOption) => void;
  updateProductStock: (productId: string, newAvailableStock: number) => void;
  updateProductPriceAndStatus: (productId: string, newPriceVnd: number, active: boolean) => void;
  updateFullProduct: (
    productId: string,
    updates: Partial<Product>,
    skuUpdates?: { basePriceVnd?: number; availableStock?: number }
  ) => void;
  createNewProduct: (input: NewProductInput) => void;
  updateFlashSaleStock: (flashSaleItemId: string, newRemainingStock: number) => void;
  updateFlashSaleItemConfig: (
    flashSaleItemId: string,
    salePriceVnd: number,
    maxPerCustomer: number
  ) => void;
  createNewFlashSaleItem: (input: NewFlashSaleItemInput) => void;
  warmupFlashSaleRedis: () => void;
  // Reviews
  reviews: CustomerReview[];
  addProductReview: (productId: string, rating: number, brewMethod: string, comment: string) => void;
  // Cart, Voucher, Payments & Order
  cartItems: CartItem[];
  cartSubtotal: number;
  vouchers: VoucherInfo[];
  createVoucher: (v: VoucherInfo) => void;
  deleteVoucher: (code: string) => void;
  appliedVoucher: VoucherInfo | null;
  voucherDiscountAmount: number;
  applyVoucherCode: (code: string) => boolean;
  removeVoucher: () => void;
  totalCartQuantity: number;
  updateCartItemQuantity: (itemTarget: CartItem, delta: number) => void;
  removeCartItem: (itemTarget: CartItem) => void;
  userFlashSaleQuota: Record<string, number>;
  activeReservation: StockReservation | null;
  currentOrder: Order | null;
  orderHistory: Order[];
  paymentTransactions: PaymentTransaction[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  bulkUpdateOrderStatus: (orderIds: string[], status: OrderStatus) => void;
  cancelOrderByCustomer: (orderId: string) => void;
  selectedProvider: PaymentProvider;
  setSelectedProvider: (provider: PaymentProvider) => void;
  toastMessage: ToastNotification | null;
  dismissToast: () => void;
  // Core Actions
  rushFlashSaleItem: (item: FlashSaleItem) => void;
  addCatalogProductToCart: (product: Product, customQuantity?: number, customWeight?: number) => void;
  manualReleaseReservation: () => void;
  processIdempotentPayment: (customShipping?: {
    recipientName: string;
    recipientPhone: string;
    streetAddress: string;
    deliveryNote?: string;
  }) => void;
}

const PAGE_TO_PATH: Record<ActivePage, string> = {
  HOME: '/',
  FLASH_SALE: '/flash-sale',
  CATALOG: '/catalog',
  PRODUCT_DETAIL: '/products',
  CHECKOUT: '/checkout',
  ORDERS: '/orders',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
  ADMIN_DASHBOARD: '/admin',
};

const ADMIN_TAB_TO_PATH: Record<AdminTab, string> = {
  OVERVIEW: '/admin',
  ORDERS: '/admin/orders',
  PRODUCTS: '/admin/products',
  FLASH_SALE: '/admin/flash-sale',
  PAYMENTS: '/admin/payments',
  VOUCHERS: '/admin/vouchers',
  CUSTOMERS: '/admin/customers',
  SETTINGS: '/admin/settings',
};

const parseAdminSubRoute = (cleanPath: string): AdminTab => {
  if (cleanPath === '/admin/orders') return 'ORDERS';
  if (cleanPath === '/admin/products') return 'PRODUCTS';
  if (cleanPath === '/admin/flash-sale') return 'FLASH_SALE';
  if (cleanPath === '/admin/payments') return 'PAYMENTS';
  if (cleanPath === '/admin/vouchers') return 'VOUCHERS';
  if (cleanPath === '/admin/customers') return 'CUSTOMERS';
  if (cleanPath === '/admin/settings') return 'SETTINGS';
  return 'OVERVIEW';
};

const parsePathToPageAndSlug = (
  pathname: string,
  allProducts: Product[]
): { page: ActivePage; product: Product | null; adminTab: AdminTab } => {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/flash-sale') return { page: 'FLASH_SALE', product: null, adminTab: 'OVERVIEW' };
  if (clean === '/catalog') return { page: 'CATALOG', product: null, adminTab: 'OVERVIEW' };
  if (clean === '/checkout') return { page: 'CHECKOUT', product: null, adminTab: 'OVERVIEW' };
  if (clean === '/orders') return { page: 'ORDERS', product: null, adminTab: 'OVERVIEW' };
  if (clean === '/profile') return { page: 'PROFILE', product: null, adminTab: 'OVERVIEW' };
  if (clean === '/login') return { page: 'LOGIN', product: null, adminTab: 'OVERVIEW' };
  if (clean === '/register') return { page: 'REGISTER', product: null, adminTab: 'OVERVIEW' };
  if (clean === '/admin' || clean.startsWith('/admin/')) {
    return { page: 'ADMIN_DASHBOARD', product: null, adminTab: parseAdminSubRoute(clean) };
  }
  if (clean.startsWith('/products/')) {
    const slug = clean.replace('/products/', '');
    const found = allProducts.find((p) => p.slug === slug || p.id === slug) || allProducts[0];
    return { page: 'PRODUCT_DETAIL', product: found, adminTab: 'OVERVIEW' };
  }
  return { page: 'HOME', product: null, adminTab: 'OVERVIEW' };
};

const RoastRushContext = createContext<RoastRushContextValue | undefined>(undefined);

export const RoastRushProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() =>
    loadFromStorage<Product[]>('roastrush_products', SPECIALTY_PRODUCTS)
  );

  const initialRoute = useMemo(
    () =>
      typeof window !== 'undefined'
        ? parsePathToPageAndSlug(window.location.pathname, products)
        : { page: 'HOME' as ActivePage, product: SPECIALTY_PRODUCTS[0], adminTab: 'OVERVIEW' as AdminTab },
    []
  );

  const [activePage, setActivePageState] = useState<ActivePage>(initialRoute.page);
  const [adminActiveTab, setAdminActiveTabState] = useState<AdminTab>(initialRoute.adminTab);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    initialRoute.product || products[0]
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMiniCartOpen, setIsMiniCartOpen] = useState<boolean>(false);

  // Sync activePage -> Browser URL (pushState)
  const setActivePage = (page: ActivePage) => {
    setActivePageState(page);
    if (typeof window !== 'undefined') {
      const targetPath =
        page === 'PRODUCT_DETAIL' && selectedProduct
          ? `/products/${selectedProduct.slug}`
          : page === 'ADMIN_DASHBOARD'
          ? ADMIN_TAB_TO_PATH[adminActiveTab] || '/admin'
          : PAGE_TO_PATH[page] || '/';
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ page }, '', targetPath);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Sync adminActiveTab -> Browser Sub-route URL
  const setAdminActiveTab = (tab: AdminTab) => {
    setAdminActiveTabState(tab);
    setActivePageState('ADMIN_DASHBOARD');
    if (typeof window !== 'undefined') {
      const targetPath = ADMIN_TAB_TO_PATH[tab] || '/admin';
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ page: 'ADMIN_DASHBOARD', adminTab: tab }, '', targetPath);
      }
    }
  };

  // Listen to Browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const parsed = parsePathToPageAndSlug(window.location.pathname, products);
      setActivePageState(parsed.page);
      setAdminActiveTabState(parsed.adminTab);
      if (parsed.product) {
        setSelectedProduct(parsed.product);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products]);

  // Persistent States (Bug 1 Fixed: Survives F5 refresh)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() =>
    loadFromStorage<UserProfile | null>('roastrush_user', null)
  );
  const [campaign, setCampaign] = useState<FlashSaleCampaign>(() =>
    loadFromStorage<FlashSaleCampaign>('roastrush_campaign', INITIAL_FLASH_SALE_CAMPAIGN)
  );
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    loadFromStorage<CartItem[]>('roastrush_cart', [])
  );
  const [userFlashSaleQuota, setUserFlashSaleQuota] = useState<Record<string, number>>(() =>
    loadFromStorage<Record<string, number>>('roastrush_fs_quota', {})
  );
  const [orderHistory, setOrderHistory] = useState<Order[]>(() =>
    loadFromStorage<Order[]>('roastrush_orders', INITIAL_DEMO_ORDERS)
  );
  const [reviews, setReviews] = useState<CustomerReview[]>(() =>
    loadFromStorage<CustomerReview[]>('roastrush_reviews', INITIAL_REVIEWS)
  );
  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    loadFromStorage<string[]>('roastrush_wishlist', ['prod-01'])
  );
  const [vouchers, setVouchers] = useState<VoucherInfo[]>(() =>
    loadFromStorage<VoucherInfo[]>('roastrush_vouchers', AVAILABLE_VOUCHERS)
  );
  const [paymentTransactions, setPaymentTransactions] = useState<PaymentTransaction[]>(() =>
    loadFromStorage<PaymentTransaction[]>('roastrush_transactions', INITIAL_DEMO_TRANSACTIONS)
  );
  const [activeReservation, setActiveReservation] = useState<StockReservation | null>(() => {
    const saved = loadFromStorage<StockReservation | null>('roastrush_reservation', null);
    if (!saved || saved.status !== ReservationStatus.HOLDING) return null;
    const diffSec = Math.floor((new Date(saved.expiresAt).getTime() - Date.now()) / 1000);
    if (diffSec <= 0) return null;
    return { ...saved, remainingSeconds: diffSec };
  });

  const [selectedGrind, setSelectedGrind] = useState<Record<string, GrindOption>>({});
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherInfo | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>(PaymentProvider.VNPAY);
  const [currentIdempotencyKey, setCurrentIdempotencyKey] = useState<string>(generateIdempotencyKey());
  const [processedIdempotencyKeys, setProcessedIdempotencyKeys] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<ToastNotification | null>(null);

  // Sync changes to localStorage
  useEffect(() => {
    if (currentUser) localStorage.setItem('roastrush_user', JSON.stringify(currentUser));
    else localStorage.removeItem('roastrush_user');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('roastrush_campaign', JSON.stringify(campaign));
  }, [campaign]);

  useEffect(() => {
    localStorage.setItem('roastrush_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('roastrush_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('roastrush_fs_quota', JSON.stringify(userFlashSaleQuota));
  }, [userFlashSaleQuota]);

  useEffect(() => {
    localStorage.setItem('roastrush_orders', JSON.stringify(orderHistory));
  }, [orderHistory]);

  useEffect(() => {
    localStorage.setItem('roastrush_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('roastrush_wishlist', JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  useEffect(() => {
    localStorage.setItem('roastrush_vouchers', JSON.stringify(vouchers));
  }, [vouchers]);

  useEffect(() => {
    localStorage.setItem('roastrush_transactions', JSON.stringify(paymentTransactions));
  }, [paymentTransactions]);

  useEffect(() => {
    if (activeReservation) {
      localStorage.setItem('roastrush_reservation', JSON.stringify(activeReservation));
    } else {
      localStorage.removeItem('roastrush_reservation');
    }
  }, [activeReservation]);

  const showToast = (type: ToastNotification['type'], text: string) => {
    setToastMessage({ type, text });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4000);
  };

  const dismissToast = () => setToastMessage(null);

  const openProductDetail = (product: Product) => {
    setSelectedProduct(product);
    setActivePageState('PRODUCT_DETAIL');
    if (typeof window !== 'undefined') {
      const targetPath = `/products/${product.slug}`;
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ page: 'PRODUCT_DETAIL', slug: product.slug }, '', targetPath);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ============================================================================
  // AUTHENTICATION & USER PROFILE
  // ============================================================================
  const loginUser = (email: string, _password: string, asAdmin = false) => {
    const isAdminAccount = asAdmin || email.toLowerCase().includes('admin');
    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName: isAdminAccount ? 'Quản Trị Viên RoastRush' : 'Nguyễn Minh Quân',
      email,
      phone: '0908123456',
      defaultAddress: '68 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      role: isAdminAccount ? 'ADMIN' : 'CUSTOMER',
      memberTier: isAdminAccount ? 'ROASTER_VIP' : 'GOLD',
    };
    setCurrentUser(user);
    localStorage.setItem('roastrush_access_token', `mock-jwt-${Date.now()}`);
    showToast('success', `Xin chào ${user.fullName}! Đăng nhập thành công.`);
    setActivePage(isAdminAccount ? 'ADMIN_DASHBOARD' : 'HOME');
  };

  const registerUser = (fullName: string, email: string, phone: string, _password: string) => {
    const user: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName,
      email,
      phone,
      defaultAddress: '68 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
      role: 'CUSTOMER',
      memberTier: 'MEMBER',
    };
    setCurrentUser(user);
    localStorage.setItem('roastrush_access_token', `mock-jwt-${Date.now()}`);
    showToast('success', `Đăng ký tài khoản thành công! Chào mừng ${fullName}.`);
    setActivePage('HOME');
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => (prev ? { ...prev, ...updates } : null));
    showToast('success', 'Đã lưu thông tin hồ sơ tài khoản!');
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('roastrush_access_token');
    showToast('warn', 'Bạn đã đăng xuất khỏi hệ thống.');
    setActivePage('HOME');
  };

  const setGrindForProduct = (productId: string, grind: GrindOption) => {
    setSelectedGrind((prev) => ({ ...prev, [productId]: grind }));
  };

  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      const prod = products.find((p) => p.id === productId);
      if (exists) {
        showToast('warn', `Đã bỏ "${prod?.name || 'sản phẩm'}" khỏi danh sách Yêu thích.`);
        return prev.filter((id) => id !== productId);
      }
      showToast('success', `Đã lưu "${prod?.name || 'sản phẩm'}" vào danh sách Yêu thích!`);
      return [...prev, productId];
    });
  };

  // ============================================================================
  // REVIEWS & ADMIN OPERATIONS
  // ============================================================================
  const addProductReview = (productId: string, rating: number, brewMethod: string, comment: string) => {
    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      productId,
      authorName: currentUser?.fullName || 'Khách hàng yêu cà phê',
      rating,
      brewMethod,
      comment,
      createdAt: new Date().toLocaleDateString('vi-VN'),
    };
    setReviews((prev) => [newRev, ...prev]);
    showToast('success', 'Cảm ơn bạn đã gửi đánh giá hương vị cho mẻ rang này!');
  };

  const updateProductStock = (productId: string, newAvailableStock: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              skus: p.skus.map((s, idx) =>
                idx === 0 ? { ...s, availableStock: Math.max(0, newAvailableStock), version: s.version + 1 } : s
              ),
            }
          : p
      )
    );
    showToast('success', 'Đã cập nhật tồn kho sản phẩm thành công!');
  };

  const updateProductPriceAndStatus = (productId: string, newPriceVnd: number, active: boolean) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              active,
              skus: p.skus.map((s, idx) =>
                idx === 0 ? { ...s, basePriceVnd: Math.max(10000, newPriceVnd), version: s.version + 1 } : s
              ),
            }
          : p
      )
    );
    showToast('success', 'Đã cập nhật giá bán và trạng thái kinh doanh!');
  };

  const updateFullProduct = (
    productId: string,
    updates: Partial<Product>,
    skuUpdates?: { basePriceVnd?: number; availableStock?: number }
  ) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== productId) return p;
        return {
          ...p,
          ...updates,
          coffeeMetadata: updates.coffeeMetadata
            ? { ...p.coffeeMetadata, ...updates.coffeeMetadata }
            : p.coffeeMetadata,
          skus: skuUpdates
            ? p.skus.map((s, idx) =>
                idx === 0
                  ? {
                      ...s,
                      basePriceVnd:
                        skuUpdates.basePriceVnd !== undefined
                          ? Math.max(10000, skuUpdates.basePriceVnd)
                          : s.basePriceVnd,
                      availableStock:
                        skuUpdates.availableStock !== undefined
                          ? Math.max(0, skuUpdates.availableStock)
                          : s.availableStock,
                      version: s.version + 1,
                    }
                  : s
              )
            : p.skus,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    showToast('success', 'Đã lưu thông tin chi tiết sản phẩm & tăng phiên bản JPA @Version!');
  };

  const createNewProduct = (input: NewProductInput) => {
    const id = `prod-${Date.now()}`;
    const skuCode = `RR-${input.originCountry.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newProd: Product = {
      id,
      slug: input.name.toLowerCase().replace(/\s+/g, '-'),
      name: input.name,
      shortDescription: input.shortDescription,
      storyMarkdown: input.shortDescription,
      thumbnailUrl:
        input.thumbnailUrl ||
        'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
      galleryUrls: [],
      coffeeMetadata: {
        originCountry: input.originCountry,
        region: input.region,
        varietal: input.varietal,
        altitudeMasl: input.altitudeMasl,
        roastLevel: RoastLevel.LIGHT,
        processMethod: ProcessMethod.WASHED,
        cuppingScore: input.cuppingScore,
        tastingNotes: input.tastingNotes.length > 0 ? input.tastingNotes : ['Floral', 'Sweet Citrus'],
        roastDate: new Date().toISOString(),
      },
      skus: [
        {
          id: `sku-${Date.now()}`,
          productId: id,
          skuCode,
          weightGrams: 250,
          grindOption: GrindOption.WHOLE_BEAN,
          basePriceVnd: input.basePriceVnd,
          availableStock: input.availableStock,
          reservedStock: 0,
          version: 1,
        },
      ],
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProducts((prev) => [newProd, ...prev]);
    showToast('success', `Đã thêm sản phẩm "${input.name}" vào danh mục!`);
  };

  const updateFlashSaleStock = (flashSaleItemId: string, newRemainingStock: number) => {
    setCampaign((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === flashSaleItemId
          ? {
              ...item,
              remainingStock: Math.max(0, Math.min(item.totalAllocatedStock, newRemainingStock)),
            }
          : item
      ),
    }));
    showToast('success', 'Đã cập nhật số suất Flash Sale trên Redis!');
  };

  const updateFlashSaleItemConfig = (
    flashSaleItemId: string,
    salePriceVnd: number,
    maxPerCustomer: number
  ) => {
    setCampaign((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === flashSaleItemId
          ? {
              ...item,
              salePriceVnd: Math.max(10000, salePriceVnd),
              maxPerCustomer: Math.max(1, maxPerCustomer),
            }
          : item
      ),
    }));
    showToast('success', 'Đã lưu cấu hình giá Flash Sale và hạn mức mua!');
  };

  const createNewFlashSaleItem = (input: NewFlashSaleItemInput) => {
    const prod = products.find((p) => p.id === input.productId);
    if (!prod) return;
    const sku = prod.skus[0];

    const newItem: FlashSaleItem = {
      id: `fs-item-${Date.now()}`,
      campaignId: campaign.id,
      skuId: sku.id,
      productName: `${prod.name} (SCA ${prod.coffeeMetadata.cuppingScore})`,
      skuCode: sku.skuCode,
      thumbnailUrl: prod.thumbnailUrl,
      originalPriceVnd: sku.basePriceVnd,
      salePriceVnd: Math.min(sku.basePriceVnd - 10000, Math.max(10000, input.salePriceVnd)),
      totalAllocatedStock: Math.max(1, input.totalAllocatedStock),
      remainingStock: Math.max(1, input.totalAllocatedStock),
      maxPerCustomer: Math.max(1, input.maxPerCustomer),
    };

    setCampaign((prev) => ({
      ...prev,
      items: [newItem, ...prev.items],
    }));
    showToast('success', `Đã kích hoạt Flash Sale cho "${prod.name}" lên Redis!`);
  };

  const warmupFlashSaleRedis = () => {
    setCampaign((prev) => ({
      ...prev,
      items: prev.items.map((item) => ({
        ...item,
        remainingStock: item.totalAllocatedStock,
      })),
    }));
    setUserFlashSaleQuota({});
    showToast('success', 'Đã đồng bộ (Warm-up) toàn bộ suất tồn kho Flash Sale lên Redis Cluster!');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrderHistory((prev) => prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord)));
    showToast('success', `Đã chuyển trạng thái đơn hàng sang ${status}.`);
  };

  const bulkUpdateOrderStatus = (orderIds: string[], status: OrderStatus) => {
    if (orderIds.length === 0) return;
    const idSet = new Set(orderIds);
    setOrderHistory((prev) =>
      prev.map((ord) => (idSet.has(ord.id) ? { ...ord, status } : ord))
    );
    showToast('success', `Đã cập nhật hàng loạt ${orderIds.length} đơn hàng sang ${status}!`);
  };

  const createVoucher = (v: VoucherInfo) => {
    const normalizedCode = v.code.trim().toUpperCase();
    if (!normalizedCode) return;
    setVouchers((prev) => {
      const filtered = prev.filter((item) => item.code !== normalizedCode);
      return [{ ...v, code: normalizedCode }, ...filtered];
    });
    showToast('success', `Đã tạo mới mã giảm giá ${normalizedCode}!`);
  };

  const deleteVoucher = (code: string) => {
    setVouchers((prev) => prev.filter((v) => v.code !== code));
    if (appliedVoucher?.code === code) {
      setAppliedVoucher(null);
    }
    showToast('warn', `Đã xóa mã giảm giá ${code}.`);
  };

  const cancelOrderByCustomer = (orderId: string) => {
    setOrderHistory((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: OrderStatus.CANCELLED } : ord))
    );
    showToast('warn', 'Đã hủy đơn hàng theo yêu cầu của bạn.');
  };

  // ============================================================================
  // 15-MINUTE RESERVATION COUNTDOWN TIMER
  // ============================================================================
  useEffect(() => {
    if (!activeReservation || activeReservation.status !== ReservationStatus.HOLDING) {
      return;
    }

    const timer = setInterval(() => {
      setActiveReservation((prev) => {
        if (!prev || prev.status !== ReservationStatus.HOLDING) return prev;

        if (prev.remainingSeconds <= 1) {
          handleExpireReservation(prev);
          return {
            ...prev,
            remainingSeconds: 0,
            status: ReservationStatus.EXPIRED,
          };
        }

        return {
          ...prev,
          remainingSeconds: prev.remainingSeconds - 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeReservation?.reservationId, activeReservation?.status]);

  const handleExpireReservation = (reservation: StockReservation) => {
    if (reservation.flashSaleItemId) {
      setCampaign((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === reservation.flashSaleItemId
            ? { ...item, remainingStock: item.remainingStock + reservation.quantity }
            : item
        ),
      }));

      setUserFlashSaleQuota((prev) => ({
        ...prev,
        [reservation.flashSaleItemId!]: Math.max(
          0,
          (prev[reservation.flashSaleItemId!] || 0) - reservation.quantity
        ),
      }));
    }

    setCurrentOrder((prev) =>
      prev ? { ...prev, status: OrderStatus.EXPIRED, expiredAt: new Date().toISOString() } : prev
    );
    showToast(
      'error',
      `Đã hết thời gian giữ đơn hàng (15 phút). Sản phẩm Flash Sale đã được hoàn lại kho.`
    );
  };

  // ============================================================================
  // FLASH SALE & SHOPPING CART ACTIONS (Bug 3 Fixed: Composite Item Identity)
  // ============================================================================
  const isSameCartLine = (a: CartItem, b: CartItem): boolean =>
    a.skuId === b.skuId &&
    a.isFlashSaleApplied === b.isFlashSaleApplied &&
    a.grindOption === b.grindOption &&
    a.weightGrams === b.weightGrams;

  const rushFlashSaleItem = (item: FlashSaleItem) => {
    const boughtCount = userFlashSaleQuota[item.id] || 0;

    if (boughtCount + 1 > item.maxPerCustomer) {
      showToast('warn', `Sản phẩm ưu đãi này giới hạn tối đa ${item.maxPerCustomer} túi mỗi khách hàng.`);
      return;
    }

    if (item.remainingStock <= 0) {
      showToast('error', 'Sản phẩm này vừa hết suất Flash Sale.');
      return;
    }

    setCampaign((prev) => ({
      ...prev,
      items: prev.items.map((x) =>
        x.id === item.id ? { ...x, remainingStock: x.remainingStock - 1 } : x
      ),
    }));

    setUserFlashSaleQuota((prev) => ({
      ...prev,
      [item.id]: (prev[item.id] || 0) + 1,
    }));

    const newLine: CartItem = {
      skuId: item.skuId,
      productId: item.id,
      productName: item.productName,
      skuCode: item.skuCode,
      thumbnailUrl: item.thumbnailUrl,
      weightGrams: 250,
      grindOption: GrindOption.WHOLE_BEAN,
      quantity: 1,
      unitPriceVnd: item.salePriceVnd,
      isFlashSaleApplied: true,
      flashSaleItemId: item.id,
      subtotalVnd: item.salePriceVnd,
      maxAllowedQuantity: item.maxPerCustomer,
    };

    setCartItems((prev) => {
      const existing = prev.find((c) => isSameCartLine(c, newLine));
      if (existing) {
        return prev.map((c) =>
          isSameCartLine(c, newLine)
            ? {
                ...c,
                quantity: c.quantity + 1,
                subtotalVnd: (c.quantity + 1) * c.unitPriceVnd,
              }
            : c
        );
      }
      return [...prev, newLine];
    });

    const now = new Date();
    const expires = new Date(now.getTime() + 15 * 60 * 1000);
    const orderCode = `RR${String(now.getMonth() + 1).padStart(2, '0')}${String(
      now.getDate()
    ).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const reservation: StockReservation = {
      reservationId: `res-${Date.now()}`,
      orderCode,
      userId: currentUser?.id || 'guest',
      skuId: item.skuId,
      flashSaleItemId: item.id,
      quantity: 1,
      status: ReservationStatus.HOLDING,
      lockedPriceVnd: item.salePriceVnd,
      reservedAt: now.toISOString(),
      expiresAt: expires.toISOString(),
      remainingSeconds: 15 * 60,
    };

    setActiveReservation(reservation);
    setCurrentIdempotencyKey(generateIdempotencyKey());
    setIsMiniCartOpen(true);

    showToast(
      'success',
      `Đã thêm "${item.productName}" vào giỏ! Đơn hàng được giữ giá ưu đãi trong 15 phút.`
    );
  };

  const addCatalogProductToCart = (product: Product, customQuantity = 1, customWeight = 250) => {
    const sku = product.skus[0];
    const grind = selectedGrind[product.id] || GrindOption.WHOLE_BEAN;
    const weightMultiplier = customWeight === 500 ? 1.9 : customWeight === 1000 ? 3.6 : 1;
    const unitPrice = Math.round(sku.basePriceVnd * weightMultiplier);

    const newLine: CartItem = {
      skuId: sku.id,
      productId: product.id,
      productName: product.name,
      skuCode: sku.skuCode,
      thumbnailUrl: product.thumbnailUrl,
      weightGrams: customWeight,
      grindOption: grind,
      quantity: customQuantity,
      unitPriceVnd: unitPrice,
      isFlashSaleApplied: false,
      subtotalVnd: unitPrice * customQuantity,
      maxAllowedQuantity: sku.availableStock,
    };

    setCartItems((prev) => {
      const existing = prev.find((c) => isSameCartLine(c, newLine));
      if (existing) {
        const nextQty = existing.quantity + customQuantity;
        return prev.map((c) =>
          isSameCartLine(c, newLine)
            ? { ...c, quantity: nextQty, subtotalVnd: nextQty * c.unitPriceVnd }
            : c
        );
      }
      return [...prev, newLine];
    });

    const now = new Date();
    const orderCode =
      currentOrder?.orderCode ||
      `RR${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(
        2,
        '0'
      )}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (!activeReservation || activeReservation.status !== ReservationStatus.HOLDING) {
      setActiveReservation({
        reservationId: `res-${Date.now()}`,
        orderCode,
        userId: currentUser?.id || 'guest',
        skuId: sku.id,
        quantity: customQuantity,
        status: ReservationStatus.HOLDING,
        lockedPriceVnd: unitPrice,
        reservedAt: now.toISOString(),
        expiresAt: new Date(now.getTime() + 15 * 60 * 1000).toISOString(),
        remainingSeconds: 15 * 60,
      });
    }

    setIsMiniCartOpen(true);
    showToast('success', `Đã thêm ${customQuantity} túi "${product.name}" (${customWeight}g) vào giỏ hàng.`);
  };

  const updateCartItemQuantity = (itemTarget: CartItem, delta: number) => {
    const nextQty = itemTarget.quantity + delta;

    if (nextQty <= 0) {
      removeCartItem(itemTarget);
      return;
    }

    if (nextQty > itemTarget.maxAllowedQuantity) {
      showToast('warn', `Tối đa ${itemTarget.maxAllowedQuantity} sản phẩm cho mặt hàng này.`);
      return;
    }

    // If Flash Sale item, sync Redis remainingStock & userQuota
    if (itemTarget.isFlashSaleApplied && itemTarget.flashSaleItemId) {
      const fsItem = campaign.items.find((x) => x.id === itemTarget.flashSaleItemId);
      if (delta > 0 && fsItem && fsItem.remainingStock < delta) {
        showToast('error', 'Đã hết suất Flash Sale tồn kho cho sản phẩm này!');
        return;
      }

      setCampaign((prev) => ({
        ...prev,
        items: prev.items.map((x) =>
          x.id === itemTarget.flashSaleItemId
            ? { ...x, remainingStock: Math.max(0, x.remainingStock - delta) }
            : x
        ),
      }));

      setUserFlashSaleQuota((prev) => ({
        ...prev,
        [itemTarget.flashSaleItemId!]: Math.max(
          0,
          (prev[itemTarget.flashSaleItemId!] || 0) + delta
        ),
      }));
    }

    setCartItems((prev) =>
      prev.map((item) =>
        isSameCartLine(item, itemTarget)
          ? {
              ...item,
              quantity: nextQty,
              subtotalVnd: nextQty * item.unitPriceVnd,
            }
          : item
      )
    );
  };

  const removeCartItem = (itemTarget: CartItem) => {
    if (itemTarget.isFlashSaleApplied && itemTarget.flashSaleItemId) {
      setCampaign((prev) => ({
        ...prev,
        items: prev.items.map((x) =>
          x.id === itemTarget.flashSaleItemId
            ? { ...x, remainingStock: x.remainingStock + itemTarget.quantity }
            : x
        ),
      }));
      setUserFlashSaleQuota((prev) => ({
        ...prev,
        [itemTarget.flashSaleItemId!]: Math.max(
          0,
          (prev[itemTarget.flashSaleItemId!] || 0) - itemTarget.quantity
        ),
      }));
    }

    setCartItems((prev) => prev.filter((i) => !isSameCartLine(i, itemTarget)));
  };

  const manualReleaseReservation = () => {
    // Return all Flash Sale items in cart back to campaign stock
    cartItems.forEach((c) => {
      if (c.isFlashSaleApplied && c.flashSaleItemId) {
        setCampaign((prev) => ({
          ...prev,
          items: prev.items.map((item) =>
            item.id === c.flashSaleItemId
              ? { ...item, remainingStock: item.remainingStock + c.quantity }
              : item
          ),
        }));
      }
    });

    setUserFlashSaleQuota({});
    setActiveReservation(null);
    setCartItems([]);
    setAppliedVoucher(null);
    showToast('warn', 'Đã xóa giỏ hàng và hoàn lại các suất giữ chỗ.');
  };

  const cartSubtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.subtotalVnd, 0),
    [cartItems]
  );

  const totalCartQuantity = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  // ============================================================================
  // VOUCHER / COUPON SYSTEM
  // ============================================================================
  const voucherDiscountAmount = useMemo(() => {
    if (!appliedVoucher || cartSubtotal < appliedVoucher.minOrderVnd) return 0;
    if (appliedVoucher.discountType === 'FIXED') {
      return appliedVoucher.value;
    }
    const rawPercent = Math.round((cartSubtotal * appliedVoucher.value) / 100);
    return appliedVoucher.maxDiscountVnd
      ? Math.min(rawPercent, appliedVoucher.maxDiscountVnd)
      : rawPercent;
  }, [appliedVoucher, cartSubtotal]);

  const applyVoucherCode = (code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    const found = vouchers.find((v) => v.code === normalized);
    if (!found) {
      showToast('error', `Mã giảm giá "${normalized}" không tồn tại hoặc đã hết hạn.`);
      return false;
    }
    if (cartSubtotal < found.minOrderVnd) {
      showToast(
        'warn',
        `Mã ${found.code} yêu cầu đơn hàng tối thiểu ${formatVnd(found.minOrderVnd)}.`
      );
      return false;
    }
    setAppliedVoucher(found);
    showToast('success', `Áp dụng mã ${found.code} thành công!`);
    return true;
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    showToast('warn', 'Đã gỡ mã giảm giá.');
  };

  const processIdempotentPayment = (customShipping?: {
    recipientName: string;
    recipientPhone: string;
    streetAddress: string;
    deliveryNote?: string;
  }) => {
    if (cartItems.length === 0) {
      showToast('error', 'Giỏ hàng của bạn đang trống!');
      return;
    }

    if (activeReservation && activeReservation.status === ReservationStatus.EXPIRED) {
      showToast('error', 'Thời gian giữ chỗ ưu đãi 15 phút đã hết hạn. Vui lòng đặt lại.');
      return;
    }

    if (processedIdempotencyKeys.has(currentIdempotencyKey)) {
      showToast('warn', 'Đơn hàng đang được xử lý, vui lòng không bấm thanh toán nhiều lần.');
      return;
    }

    const shippingFee = cartSubtotal >= 500000 ? 0 : 30000;
    const totalAmount = Math.max(0, cartSubtotal + shippingFee - voucherDiscountAmount);
    const now = new Date();
    const orderCode =
      activeReservation?.orderCode ||
      `RR${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(
        2,
        '0'
      )}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderCode,
      userId: currentUser?.id || 'guest',
      status: OrderStatus.PAID,
      items: cartItems.map((c, index) => ({
        id: `oi-${Date.now()}-${index}`,
        orderId: orderCode,
        skuId: c.skuId,
        productName: c.productName,
        skuCode: c.skuCode,
        weightGrams: c.weightGrams,
        grindOption: c.grindOption,
        quantity: c.quantity,
        unitPriceVnd: c.unitPriceVnd,
        subtotalVnd: c.subtotalVnd,
        flashSaleItemId: c.flashSaleItemId,
      })),
      shippingAddress: {
        recipientName: customShipping?.recipientName || currentUser?.fullName || 'Khách hàng RoastRush',
        recipientPhone: customShipping?.recipientPhone || currentUser?.phone || '0908123456',
        province: 'TP. Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Phường Bến Nghé',
        streetAddress:
          customShipping?.streetAddress ||
          currentUser?.defaultAddress ||
          '68 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
        deliveryNote: customShipping?.deliveryNote,
      },
      subtotalAmountVnd: cartSubtotal,
      shippingFeeVnd: shippingFee,
      discountAmountVnd: voucherDiscountAmount,
      totalPayableVnd: totalAmount,
      createdAt: now.toISOString(),
      paidAt: now.toISOString(),
    };

    const newTx: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      orderCode,
      transactionRef: `${selectedProvider}-${now.getFullYear()}${String(now.getMonth() + 1).padStart(
        2,
        '0'
      )}${String(now.getDate()).padStart(2, '0')}-${Math.floor(100000 + Math.random() * 900000)}`,
      providerTransactionNo: `${Math.floor(100000000 + Math.random() * 900000000)}`,
      provider: selectedProvider,
      amountVnd: totalAmount,
      status: PaymentStatus.SUCCESS,
      idempotencyKey: currentIdempotencyKey,
      signatureVerified: true,
      processedAt: now.toISOString(),
    };

    setProcessedIdempotencyKeys((prev) => new Set(prev).add(currentIdempotencyKey));
    setPaymentTransactions((prev) => [newTx, ...prev]);
    setOrderHistory((prev) => [newOrder, ...prev]);
    setCurrentOrder(newOrder);
    setActiveReservation(null);
    setCartItems([]);
    setAppliedVoucher(null);
    setCurrentIdempotencyKey(generateIdempotencyKey());

    showToast(
      'success',
      `Đặt hàng & Thanh toán qua ${selectedProvider} thành công (${formatVnd(totalAmount)})!`
    );
    setActivePage('ORDERS');
  };

  return (
    <RoastRushContext.Provider
      value={{
        activePage,
        setActivePage,
        adminActiveTab,
        setAdminActiveTab,
        selectedProduct,
        openProductDetail,
        searchQuery,
        setSearchQuery,
        wishlistIds,
        toggleWishlist,
        isMiniCartOpen,
        setIsMiniCartOpen,
        currentUser,
        loginUser,
        registerUser,
        updateUserProfile,
        logoutUser,
        campaign,
        products,
        selectedGrind,
        setGrindForProduct,
        updateProductStock,
        updateProductPriceAndStatus,
        updateFullProduct,
        createNewProduct,
        updateFlashSaleStock,
        updateFlashSaleItemConfig,
        createNewFlashSaleItem,
        warmupFlashSaleRedis,
        reviews,
        addProductReview,
        cartItems,
        cartSubtotal,
        vouchers,
        createVoucher,
        deleteVoucher,
        appliedVoucher,
        voucherDiscountAmount,
        applyVoucherCode,
        removeVoucher,
        totalCartQuantity,
        updateCartItemQuantity,
        removeCartItem,
        userFlashSaleQuota,
        activeReservation,
        currentOrder,
        orderHistory,
        paymentTransactions,
        updateOrderStatus,
        bulkUpdateOrderStatus,
        cancelOrderByCustomer,
        selectedProvider,
        setSelectedProvider,
        toastMessage,
        dismissToast,
        rushFlashSaleItem,
        addCatalogProductToCart,
        manualReleaseReservation,
        processIdempotentPayment,
      }}
    >
      {children}
    </RoastRushContext.Provider>
  );
};

export const useRoastRush = (): RoastRushContextValue => {
  const context = useContext(RoastRushContext);
  if (!context) {
    throw new Error('useRoastRush must be used within a RoastRushProvider');
  }
  return context;
};
