import React, { useEffect, useMemo, useState } from 'react';
import {
  Award,
  BarChart3,
  Clock,
  DollarSign,
  Flame,
  Package,
  ShieldCheck,
  TrendingUp,
  X,
} from 'lucide-react';
import { useRoastRush } from '../../context/RoastRushContext';
import { formatVnd } from '../../data/mockData';
import { Order, OrderStatus } from '../../types/domain.types';
import { AdminLayout } from '../../components/layout/admin/AdminLayout';
import { checkBackendHealth } from './api/admin.api';
import { AdminOverviewTab } from './tabs/AdminOverviewTab';
import { AdminOrdersTab } from './tabs/AdminOrdersTab';
import { AdminProductsTab } from './tabs/AdminProductsTab';
import { AdminFlashSaleTab } from './tabs/AdminFlashSaleTab';
import { AdminPaymentsTab } from './tabs/AdminPaymentsTab';
import { AdminVouchersTab } from './tabs/AdminVouchersTab';

const DEMO_MEMBERS = [
  {
    id: 'mem-01',
    name: 'Nguyễn Minh Quân',
    email: 'minhquan@roastrush.vn',
    phone: '0908123456',
    tier: 'ROASTER_VIP',
    totalSpent: 4850000,
    ordersCount: 6,
  },
  {
    id: 'mem-02',
    name: 'Trần Hoàng Nam',
    email: 'hoangnam@gmail.com',
    phone: '0912345678',
    tier: 'GOLD',
    totalSpent: 2450000,
    ordersCount: 3,
  },
  {
    id: 'mem-03',
    name: 'Lê Thu Hà',
    email: 'thuha.le@company.vn',
    phone: '0987654321',
    tier: 'GOLD',
    totalSpent: 1980000,
    ordersCount: 2,
  },
];

export const AdminDashboardPage: React.FC = () => {
  const {
    adminActiveTab,
    setAdminActiveTab,
    products,
    campaign,
    orderHistory,
  } = useRoastRush();

  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'ALL' | OrderStatus>('ALL');
  const [selectedOrderModal, setSelectedOrderModal] = useState<Order | null>(null);

  // API Readiness & Sync State
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const handleSyncData = async () => {
    setIsSyncing(true);
    const healthy = await checkBackendHealth();
    setIsBackendConnected(healthy);
    setTimeout(() => {
      setIsSyncing(false);
    }, 450);
  };

  useEffect(() => {
    handleSyncData();
  }, []);

  // CSV Export Helper
  const handleExportOrdersCsv = () => {
    const header = [
      'Ma_Don',
      'Khach_Hang',
      'So_Dien_Thoai',
      'Tong_Tien_VND',
      'Trang_Thai',
      'Ngay_Tao',
    ];
    const rows = orderHistory.map((o) => [
      o.orderCode,
      `"${o.shippingAddress.recipientName}"`,
      o.shippingAddress.recipientPhone,
      o.totalPayableVnd,
      o.status,
      o.createdAt,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `roastrush-orders-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalRevenue = useMemo(
    () =>
      orderHistory
        .filter((o) => o.status !== OrderStatus.CANCELLED && o.status !== OrderStatus.EXPIRED)
        .reduce((sum, ord) => sum + ord.totalPayableVnd, 0),
    [orderHistory]
  );

  const totalFlashSaleRemaining = useMemo(
    () => campaign.items.reduce((sum, item) => sum + item.remainingStock, 0),
    [campaign]
  );

  const totalCatalogStock = useMemo(
    () => products.reduce((sum, p) => sum + (p.skus[0]?.availableStock || 0), 0),
    [products]
  );

  const filteredOrders = useMemo(
    () =>
      orderHistory.filter((o) => {
        const q = searchKeyword.toLowerCase();
        const matchQuery =
          o.orderCode.toLowerCase().includes(q) ||
          o.shippingAddress.recipientName.toLowerCase().includes(q) ||
          o.shippingAddress.recipientPhone.includes(searchKeyword);

        const matchStatus = orderStatusFilter === 'ALL' || o.status === orderStatusFilter;
        return matchQuery && matchStatus;
      }),
    [orderHistory, searchKeyword, orderStatusFilter]
  );

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          p.skus[0]?.skuCode.toLowerCase().includes(searchKeyword.toLowerCase())
      ),
    [products, searchKeyword]
  );

  const filteredFlashSaleItems = useMemo(
    () =>
      campaign.items.filter(
        (item) =>
          item.productName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          item.skuCode.toLowerCase().includes(searchKeyword.toLowerCase())
      ),
    [campaign.items, searchKeyword]
  );

  const filteredMembers = useMemo(
    () =>
      DEMO_MEMBERS.filter(
        (m) =>
          m.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          m.email.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          m.phone.includes(searchKeyword)
      ),
    [searchKeyword]
  );

  return (
    <AdminLayout
      activeTab={adminActiveTab}
      setActiveTab={setAdminActiveTab}
      searchKeyword={searchKeyword}
      setSearchKeyword={setSearchKeyword}
      isBackendConnected={isBackendConnected}
      isSyncing={isSyncing}
      onSyncData={handleSyncData}
    >
      {/* =====================================================================
          KPI SUMMARY CARDS
      ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>TỔNG DOANH THU</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-stone-900">{formatVnd(totalRevenue)}</div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% so với tuần trước</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>ĐƠN HÀNG ĐÃ NHẬN</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-800">
              <Package className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-stone-900">{orderHistory.length} đơn</div>
          <div className="text-xs text-stone-500">100% đã xác thực thanh toán</div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>SUẤT FLASH SALE CÒN LẠI</span>
            <span className="p-2 rounded-xl bg-red-50 text-red-600">
              <Flame className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-red-600">{totalFlashSaleRemaining} túi</div>
          <div className="text-xs text-stone-500">Đang mở bán trên Redis Cluster</div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
            <span>TỒN KHO HẠT ĐẶC SẢN</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <BarChart3 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl font-black text-stone-900">{totalCatalogStock} túi</div>
          <div className="text-xs text-stone-500">{products.length} dòng Micro-lot SCA 85+</div>
        </div>
      </div>

      {/* =====================================================================
          DYNAMIC MODULAR TABS
      ===================================================================== */}
      {adminActiveTab === 'OVERVIEW' && (
        <AdminOverviewTab
          setActiveTab={setAdminActiveTab}
          filteredOrders={filteredOrders}
          onInspectOrder={setSelectedOrderModal}
        />
      )}

      {adminActiveTab === 'ORDERS' && (
        <AdminOrdersTab
          filteredOrders={filteredOrders}
          orderStatusFilter={orderStatusFilter}
          setOrderStatusFilter={setOrderStatusFilter}
          onExportCsv={handleExportOrdersCsv}
          onInspectOrder={setSelectedOrderModal}
        />
      )}

      {adminActiveTab === 'PRODUCTS' && (
        <AdminProductsTab filteredProducts={filteredProducts} />
      )}

      {adminActiveTab === 'FLASH_SALE' && (
        <AdminFlashSaleTab filteredFlashSaleItems={filteredFlashSaleItems} />
      )}

      {adminActiveTab === 'PAYMENTS' && (
        <AdminPaymentsTab searchKeyword={searchKeyword} />
      )}

      {adminActiveTab === 'VOUCHERS' && <AdminVouchersTab />}

      {adminActiveTab === 'CUSTOMERS' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-5">
          <div>
            <h2 className="text-base font-bold text-stone-900">Hội viên RoastRush Specialty Club</h2>
            <p className="text-xs text-stone-500">
              Danh sách khách hàng thân thiết và lịch sử tích lũy chi tiêu
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 uppercase">
                  <th className="py-3 font-semibold">Họ và tên</th>
                  <th className="py-3 font-semibold">Email & Điện thoại</th>
                  <th className="py-3 font-semibold">Hạng thẻ</th>
                  <th className="py-3 font-semibold">Số đơn đã mua</th>
                  <th className="py-3 font-semibold">Tổng chi tiêu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredMembers.map((mem) => (
                  <tr key={mem.id} className="hover:bg-stone-50">
                    <td className="py-4 font-bold text-stone-900">{mem.name}</td>
                    <td className="py-4 text-stone-600">
                      <div>{mem.email}</div>
                      <div className="text-stone-400">{mem.phone}</div>
                    </td>
                    <td className="py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-bold">
                        <Award className="w-3.5 h-3.5 text-amber-700" />
                        {mem.tier}
                      </span>
                    </td>
                    <td className="py-4 font-semibold text-stone-800">{mem.ordersCount} đơn</td>
                    <td className="py-4 font-bold text-amber-800">{formatVnd(mem.totalSpent)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {adminActiveTab === 'SETTINGS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-amber-800" />
              <h3 className="text-base font-bold text-stone-900">
                Cấu hình Giữ chỗ Flash Sale (Reservation)
              </h3>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Thiết lập thời gian giữ suất ưu đãi trên Redis TTL & Kafka Delay Queue trước khi tự động thu hồi kho.
            </p>
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-semibold text-stone-700">Thời gian giữ chỗ mặc định (TTL):</span>
                <span className="font-mono font-bold text-amber-800">15 phút (900 giây)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-semibold text-stone-700">Kafka Delay Topic:</span>
                <span className="font-mono text-stone-800">roastrush.reservation.delay.15m</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-stone-900">
                Cổng Thanh Toán & Bảo Mật Webhook
              </h3>
            </div>
            <p className="text-xs text-stone-500 leading-relaxed">
              Trạng thái kết nối chữ ký số HMAC và kiểm soát chống trùng lặp giao dịch (Idempotency).
            </p>
            <div className="space-y-3 pt-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-semibold text-stone-700">VNPay QR Gateway (HMAC-SHA512):</span>
                <span className="text-emerald-600 font-bold">Đã kích hoạt</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="font-semibold text-stone-700">MoMo E-Wallet (HMAC-SHA256):</span>
                <span className="text-emerald-600 font-bold">Đã kích hoạt</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          ORDER DETAIL MODAL FOR ADMIN
      ===================================================================== */}
      {selectedOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedOrderModal(null)}
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white border border-stone-200 shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-black text-stone-900">
                  Chi tiết đơn hàng #{selectedOrderModal.orderCode}
                </h3>
                <span className="text-stone-400">
                  Ngày tạo: {new Date(selectedOrderModal.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderModal(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <div className="font-bold text-stone-900">
                Người nhận: {selectedOrderModal.shippingAddress.recipientName} (
                {selectedOrderModal.shippingAddress.recipientPhone})
              </div>
              <div className="text-stone-600">
                Địa chỉ: {selectedOrderModal.shippingAddress.streetAddress}
              </div>
              {selectedOrderModal.shippingAddress.deliveryNote && (
                <div className="text-amber-800 font-semibold">
                  Ghi chú: {selectedOrderModal.shippingAddress.deliveryNote}
                </div>
              )}
            </div>

            <div className="divide-y divide-stone-100">
              {selectedOrderModal.items.map((item) => (
                <div key={item.id} className="py-2.5 flex justify-between">
                  <div>
                    <div className="font-bold text-stone-900">{item.productName}</div>
                    <div className="text-stone-500">
                      Túi {item.weightGrams}g • Cỡ xay: {item.grindOption} • SL: x{item.quantity}
                    </div>
                  </div>
                  <div className="font-bold text-stone-900">{formatVnd(item.subtotalVnd)}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 pt-3 flex items-center justify-between text-sm font-black text-stone-900">
              <span>Tổng thanh toán:</span>
              <span className="text-amber-800">{formatVnd(selectedOrderModal.totalPayableVnd)}</span>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
