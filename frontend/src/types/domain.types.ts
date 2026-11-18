/**
 * ============================================================================
 * ROASTRUSH - CORE DOMAIN TYPES (Synchronized with Spring Boot Backend DDD)
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// 1. COMMON & API ENVELOPE TYPES
// ----------------------------------------------------------------------------

export type ISODateString = string; // e.g., "2026-11-18T10:25:01+07:00"
export type UUID = string;

export interface ApiResponse<T> {
  success: boolean;
  code: string; // e.g., "SUCCESS", "ERR_FLASH_SALE_SOLD_OUT", "ERR_RESERVATION_EXPIRED"
  message: string;
  data: T;
  timestamp: ISODateString;
  traceId?: string;
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

// ----------------------------------------------------------------------------
// 2. SPECIALTY COFFEE PRODUCT & INVENTORY DOMAIN
// ----------------------------------------------------------------------------

export enum RoastLevel {
  LIGHT = 'LIGHT',                 // Pour-over / Filter
  MEDIUM_LIGHT = 'MEDIUM_LIGHT',   // Filter / Modern Espresso
  MEDIUM = 'MEDIUM',               // Balanced Espresso / Moka Pot
  MEDIUM_DARK = 'MEDIUM_DARK',     // Traditional Espresso
  DARK = 'DARK',                   // Phin / Cold Brew
}

export enum ProcessMethod {
  WASHED = 'WASHED',
  NATURAL = 'NATURAL',
  HONEY = 'HONEY',
  ANAEROBIC_FERMENTATION = 'ANAEROBIC_FERMENTATION',
  CARBONIC_MACERATION = 'CARBONIC_MACERATION',
}

export enum GrindOption {
  WHOLE_BEAN = 'WHOLE_BEAN',
  ESPRESSO = 'ESPRESSO',
  POUR_OVER_V60 = 'POUR_OVER_V60',
  FRENCH_PRESS = 'FRENCH_PRESS',
  VIETNAMESE_PHIN = 'VIETNAMESE_PHIN',
}

export interface CoffeeMetadata {
  originCountry: string;           // e.g., "Ethiopia", "Vietnam (Cầu Đất)"
  region: string;                  // e.g., "Yirgacheffe"
  varietal: string;                // e.g., "Geisha", "Bourbon", "Catimor"
  altitudeMasl: string;            // e.g., "1900 - 2100m"
  roastLevel: RoastLevel;
  processMethod: ProcessMethod;
  cuppingScore: number;            // SCA Score, e.g., 88.5
  tastingNotes: string[];          // e.g., ["Jasmine", "Bergamot", "Peach"]
  roastDate: ISODateString;
}

export interface ProductSku {
  id: UUID;
  productId: UUID;
  skuCode: string;                 // e.g., "ETH-GEISHA-250G-WB"
  weightGrams: number;             // 250, 500, 1000
  grindOption: GrindOption;
  basePriceVnd: number;
  availableStock: number;          // Kho thường (Regular Inventory)
  reservedStock: number;           // Kho đang bị giữ chỗ (15m hold)
  version: number;                 // Optimistic Locking (@Version in JPA)
}

export interface Product {
  id: UUID;
  slug: string;
  name: string;
  shortDescription: string;
  storyMarkdown: string;
  thumbnailUrl: string;
  galleryUrls: string[];
  coffeeMetadata: CoffeeMetadata;
  skus: ProductSku[];
  active: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

// ----------------------------------------------------------------------------
// 3. FLASH SALE & RESERVATION (15-MINUTE HOLD) DOMAIN
// ----------------------------------------------------------------------------

export enum FlashSaleStatus {
  UPCOMING = 'UPCOMING',
  ACTIVE = 'ACTIVE',
  ENDED = 'ENDED',
  CANCELLED = 'CANCELLED',
}

export enum ReservationStatus {
  HOLDING = 'HOLDING',             // Đang giữ chỗ trong 15 phút (Redis TTL + Kafka Delay)
  CONFIRMED = 'CONFIRMED',         // Đã thanh toán thành công -> trừ kho thật
  EXPIRED = 'EXPIRED',             // Quá 15 phút không thanh toán -> Kafka Consumer nhả kho
  RELEASED = 'RELEASED',           // User chủ động hủy đơn -> nhả kho ngay
}

export interface FlashSaleItem {
  id: UUID;
  campaignId: UUID;
  skuId: UUID;
  productName: string;
  skuCode: string;
  thumbnailUrl: string;
  originalPriceVnd: number;
  salePriceVnd: number;
  totalAllocatedStock: number;     // Tổng số suất Flash Sale phân bổ lên Redis
  remainingStock: number;          // Số suất còn lại realtime từ Redis
  maxPerCustomer: number;          // Chống đầu cơ (e.g., tối đa 2 túi Geisha/user)
}

export interface FlashSaleCampaign {
  id: UUID;
  title: string;
  bannerUrl: string;
  startTime: ISODateString;
  endTime: ISODateString;
  status: FlashSaleStatus;
  serverCurrentTime: ISODateString; // Đồng bộ đồng hồ đếm ngược chống lệch giờ client
  items: FlashSaleItem[];
}

/**
 * Token giữ chỗ trả về khi User bấm "Săn Flash Sale" hoặc "Checkout" thành công qua Redis Lock
 */
export interface StockReservation {
  reservationId: UUID;
  orderCode: string;
  userId: UUID;
  skuId: UUID;
  flashSaleItemId?: UUID;
  quantity: number;
  status: ReservationStatus;
  lockedPriceVnd: number;
  reservedAt: ISODateString;
  expiresAt: ISODateString;        // reservedAt + 15 minutes
  remainingSeconds: number;        // Dùng cho UI Countdown 15:00
}

// ----------------------------------------------------------------------------
// 4. CART DOMAIN
// ----------------------------------------------------------------------------

export interface CartItem {
  skuId: UUID;
  productId: UUID;
  productName: string;
  skuCode: string;
  thumbnailUrl: string;
  weightGrams: number;
  grindOption: GrindOption;
  quantity: number;
  unitPriceVnd: number;
  isFlashSaleApplied: boolean;
  flashSaleItemId?: UUID;
  subtotalVnd: number;
  maxAllowedQuantity: number;
}

export interface Cart {
  userId?: UUID;
  items: CartItem[];
  totalQuantity: number;
  subtotalAmountVnd: number;
  discountAmountVnd: number;
  estimatedShippingVnd: number;
  finalAmountVnd: number;
}

// ----------------------------------------------------------------------------
// 5. ORDER DOMAIN
// ----------------------------------------------------------------------------

export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT', // Đang trong 15 phút giữ chỗ chờ thanh toán
  PAID = 'PAID',                       // Đã nhận IPN Webhook từ VNPay/MoMo
  ROASTING_PACKING = 'ROASTING_PACKING', // Đang rang/đóng gói
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  EXPIRED = 'EXPIRED',                 // Hết 15 phút giữ chỗ, đã hoàn kho
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export interface ShippingAddress {
  recipientName: string;
  recipientPhone: string;
  province: string;
  district: string;
  ward: string;
  streetAddress: string;
  deliveryNote?: string;
}

export interface OrderItem {
  id: UUID;
  orderId: UUID;
  skuId: UUID;
  productName: string;
  skuCode: string;
  weightGrams: number;
  grindOption: GrindOption;
  quantity: number;
  unitPriceVnd: number;
  subtotalVnd: number;
  flashSaleItemId?: UUID;
}

export interface Order {
  id: UUID;
  orderCode: string;               // e.g., "RR-20261118-8921"
  userId: UUID;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  subtotalAmountVnd: number;
  shippingFeeVnd: number;
  discountAmountVnd: number;
  totalPayableVnd: number;
  reservation?: StockReservation;  // Thông tin giữ chỗ 15 phút gắn liền với đơn hàng
  createdAt: ISODateString;
  paidAt?: ISODateString;
  expiredAt?: ISODateString;
}

// ----------------------------------------------------------------------------
// 6. PAYMENT & IDEMPOTENCY DOMAIN (VNPay / MoMo)
// ----------------------------------------------------------------------------

export enum PaymentProvider {
  VNPAY = 'VNPAY',
  MOMO = 'MOMO',
}

export enum PaymentStatus {
  INITIATED = 'INITIATED',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface InitiatePaymentRequest {
  orderCode: string;
  provider: PaymentProvider;
  idempotencyKey: string;          // Client-generated UUID chống double-click thanh toán
  returnUrl: string;
}

export interface InitiatePaymentResponse {
  transactionRef: string;          // vnp_TxnRef hoặc MoMo orderId
  paymentUrl: string;              // Redirect URL sang cổng VNPay / MoMo
  qrCodePayload?: string;
  expiresAt: ISODateString;        // Khớp với thời gian hết hạn giữ chỗ 15 phút
}

export interface PaymentTransaction {
  id: UUID;
  orderCode: string;
  transactionRef: string;
  providerTransactionNo?: string;  // vnp_TransactionNo / momo transId
  provider: PaymentProvider;
  amountVnd: number;
  status: PaymentStatus;
  idempotencyKey: string;          // Unique Index dưới DB + Redis Lock chống cộng/trừ tiền 2 lần
  signatureVerified: boolean;
  processedAt?: ISODateString;
}

