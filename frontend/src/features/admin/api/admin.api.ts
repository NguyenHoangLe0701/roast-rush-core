import { axiosClient } from '../../../lib/http/axiosClient';
import {
  ApiResponse,
  Order,
  OrderStatus,
  PageResponse,
  PaymentTransaction,
  Product,
} from '../../../types/domain.types';

/**
 * ============================================================================
 * ADMIN BACKOFFICE REST API CLIENT (Ready for Spring Boot 3 DDD Backend)
 * ============================================================================
 */

export type AnalyticsRange = 'TODAY' | '7D' | '30D';

export interface AdminAnalyticsOverview {
  totalRevenueVnd: number;
  revenueGrowthPercent: number;
  totalOrders: number;
  flashSaleRemainingUnits: number;
  catalogAvailableUnits: number;
  dailyRevenue: Array<{ label: string; amountVnd: number; percent: number }>;
  originBreakdown: Array<{ origin: string; revenueSharePercent: number; totalVnd: number }>;
}

export interface AdminOrdersQuery {
  page?: number;
  size?: number;
  status?: 'ALL' | OrderStatus;
  keyword?: string;
}

export interface CreateFlashSaleItemPayload {
  skuId: string;
  salePriceVnd: number;
  totalAllocatedStock: number;
  maxPerCustomer: number;
}

/**
 * Helper kiểm tra nhanh trạng thái kết nối tới Backend API (Spring Boot Actuator / Health)
 */
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const res = await axiosClient.get('/actuator/health', { timeout: 2000 });
    return res.status === 200;
  } catch {
    return false;
  }
};

export const adminApi = {
  // 1. Analytics
  getAnalyticsOverview: async (
    range: AnalyticsRange = '7D'
  ): Promise<ApiResponse<AdminAnalyticsOverview>> => {
    const { data } = await axiosClient.get<ApiResponse<AdminAnalyticsOverview>>(
      '/admin/analytics/overview',
      { params: { range } }
    );
    return data;
  },

  // 2. Orders Management
  getOrdersPage: async (
    query: AdminOrdersQuery
  ): Promise<ApiResponse<PageResponse<Order>>> => {
    const { data } = await axiosClient.get<ApiResponse<PageResponse<Order>>>('/admin/orders', {
      params: {
        page: query.page ?? 0,
        size: query.size ?? 10,
        status: query.status && query.status !== 'ALL' ? query.status : undefined,
        q: query.keyword || undefined,
      },
    });
    return data;
  },

  updateOrderStatusApi: async (
    orderCode: string,
    status: OrderStatus
  ): Promise<ApiResponse<Order>> => {
    const { data } = await axiosClient.patch<ApiResponse<Order>>(
      `/admin/orders/${orderCode}/status`,
      { status }
    );
    return data;
  },

  bulkUpdateOrderStatusApi: async (
    orderCodes: string[],
    status: OrderStatus
  ): Promise<ApiResponse<number>> => {
    const { data } = await axiosClient.post<ApiResponse<number>>('/admin/orders/bulk-status', {
      orderCodes,
      status,
    });
    return data;
  },

  // 3. Catalog & Inventory Management
  createProductApi: async (payload: Partial<Product>): Promise<ApiResponse<Product>> => {
    const { data } = await axiosClient.post<ApiResponse<Product>>('/admin/products', payload);
    return data;
  },

  updateProductApi: async (
    productId: string,
    payload: Partial<Product>
  ): Promise<ApiResponse<Product>> => {
    const { data } = await axiosClient.put<ApiResponse<Product>>(
      `/admin/products/${productId}`,
      payload
    );
    return data;
  },

  updateSkuInventoryApi: async (
    skuId: string,
    availableStock: number,
    version: number
  ): Promise<ApiResponse<void>> => {
    const { data } = await axiosClient.patch<ApiResponse<void>>(`/admin/skus/${skuId}/stock`, {
      availableStock,
      version,
    });
    return data;
  },

  // 4. Flash Sale & Redis Stock Reservation
  addFlashSaleItemApi: async (
    campaignId: string,
    payload: CreateFlashSaleItemPayload
  ): Promise<ApiResponse<void>> => {
    const { data } = await axiosClient.post<ApiResponse<void>>(
      `/admin/flash-sales/${campaignId}/items`,
      payload
    );
    return data;
  },

  warmupFlashSaleRedisApi: async (campaignId: string): Promise<ApiResponse<void>> => {
    const { data } = await axiosClient.post<ApiResponse<void>>(
      `/admin/flash-sales/${campaignId}/warmup-redis`
    );
    return data;
  },

  forceReleaseReservationApi: async (reservationId: string): Promise<ApiResponse<void>> => {
    const { data } = await axiosClient.post<ApiResponse<void>>(
      `/admin/reservations/${reservationId}/release`
    );
    return data;
  },

  // 5. Payment & Webhook Audit
  getPaymentTransactionsApi: async (): Promise<ApiResponse<PageResponse<PaymentTransaction>>> => {
    const { data } = await axiosClient.get<ApiResponse<PageResponse<PaymentTransaction>>>(
      '/admin/payments/transactions'
    );
    return data;
  },
};

