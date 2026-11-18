import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowUpRight,
  Eye,
  Globe2,
} from 'lucide-react';
import { useRoastRush } from '../../../context/RoastRushContext';
import { formatVnd } from '../../../data/mockData';
import { Order } from '../../../types/domain.types';
import { AdminTab } from '../../../components/layout/admin/AdminSidebar';
import { AnalyticsRange } from '../api/admin.api';

interface AdminOverviewTabProps {
  setActiveTab: (tab: AdminTab) => void;
  filteredOrders: Order[];
  onInspectOrder: (order: Order) => void;
}

const REVENUE_BY_RANGE: Record<
  AnalyticsRange,
  { totalLabel: string; bars: Array<{ day: string; amount: number; percent: number }> }
> = {
  TODAY: {
    totalLabel: 'Hôm nay: 12.450.000 ₫',
    bars: [
      { day: '08h', amount: 1200000, percent: 25 },
      { day: '10h', amount: 2800000, percent: 55 },
      { day: '12h', amount: 1950000, percent: 40 },
      { day: '14h', amount: 1500000, percent: 32 },
      { day: '16h', amount: 2200000, percent: 45 },
      { day: '18h', amount: 3400000, percent: 78 },
      { day: '20h', amount: 4800000, percent: 96 },
    ],
  },
  '7D': {
    totalLabel: '7 ngày qua: 46.400.000 ₫',
    bars: [
      { day: 'T2', amount: 4200000, percent: 48 },
      { day: 'T3', amount: 5800000, percent: 65 },
      { day: 'T4', amount: 5100000, percent: 58 },
      { day: 'T5', amount: 7400000, percent: 82 },
      { day: 'T6', amount: 6900000, percent: 76 },
      { day: 'T7', amount: 8900000, percent: 98 },
      { day: 'CN', amount: 8100000, percent: 90 },
    ],
  },
  '30D': {
    totalLabel: '30 ngày qua: 184.200.000 ₫',
    bars: [
      { day: 'Tuần 1', amount: 36500000, percent: 62 },
      { day: 'Tuần 2', amount: 44200000, percent: 78 },
      { day: 'Tuần 3', amount: 51800000, percent: 92 },
      { day: 'Tuần 4', amount: 51700000, percent: 90 },
    ],
  },
};

const ORIGIN_REVENUE_SHARES = [
  { origin: 'Panama Boquete (Geisha SCA 91.5)', share: 45, amountVnd: 20880000, barColor: 'bg-amber-800' },
  { origin: 'Ethiopia Sidama (Anaerobic 96h)', share: 30, amountVnd: 13920000, barColor: 'bg-amber-600' },
  { origin: 'Colombia Cauca (Double Anaerobic)', share: 15, amountVnd: 6960000, barColor: 'bg-orange-500' },
  { origin: 'Vietnam Cầu Đất (Yellow Bourbon)', share: 10, amountVnd: 4640000, barColor: 'bg-stone-600' },
];

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({
  setActiveTab,
  filteredOrders,
  onInspectOrder,
}) => {
  const { campaign, products } = useRoastRush();
  const [range, setRange] = useState<AnalyticsRange>('7D');

  const chartData = REVENUE_BY_RANGE[range];

  const lowStockProducts = useMemo(
    () => products.filter((p) => (p.skus[0]?.availableStock ?? 0) < 30),
    [products]
  );

  return (
    <div className="space-y-6">
      {/* Row 1: Visual Revenue Chart + Origin Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-stone-900">Biểu đồ Doanh thu Bán hàng</h2>
              <p className="text-xs text-stone-500">{chartData.totalLabel}</p>
            </div>

            {/* Time Range Filter Pills */}
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
              {[
                { id: 'TODAY' as AnalyticsRange, label: 'Hôm nay' },
                { id: '7D' as AnalyticsRange, label: '7 ngày qua' },
                { id: '30D' as AnalyticsRange, label: '30 ngày qua' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setRange(opt.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    range === opt.id
                      ? 'bg-white text-amber-900 shadow-sm'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2 border-b border-stone-100 pb-2">
            {chartData.bars.map((bar) => (
              <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="text-[10px] font-bold text-stone-600 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  {(bar.amount / 1000000).toFixed(1)}M
                </div>
                <div className="w-full max-w-[44px] bg-stone-100 rounded-t-lg h-32 flex items-end overflow-hidden">
                  <div
                    className="w-full bg-gradient-to-t from-amber-800 to-amber-600 rounded-t-lg transition-all duration-500"
                    style={{ height: `${bar.percent}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-stone-600">{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Origin Breakdown */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-amber-800" />
              <h2 className="text-base font-bold text-stone-900">Tỷ trọng theo Vùng trồng</h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('PRODUCTS')}
              className="text-xs font-bold text-amber-800 hover:underline"
            >
              Xem kho hạt
            </button>
          </div>

          <div className="space-y-3.5 pt-1">
            {ORIGIN_REVENUE_SHARES.map((row) => (
              <div key={row.origin} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-800 truncate pr-2">{row.origin}</span>
                  <span className="font-bold text-stone-900 shrink-0">
                    {row.share}% ({formatVnd(row.amountVnd)})
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${row.barColor}`}
                    style={{ width: `${row.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Flash Sale Monitor + Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">Tiến độ Flash Sale trên Redis</h2>
            <button
              type="button"
              onClick={() => setActiveTab('FLASH_SALE')}
              className="text-xs font-bold text-amber-800 hover:underline"
            >
              Điều phối Redis →
            </button>
          </div>

          <div className="space-y-3">
            {campaign.items.map((item) => {
              const sold = item.totalAllocatedStock - item.remainingStock;
              const percent = Math.round((sold / item.totalAllocatedStock) * 100);
              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-stone-900">
                    <span className="line-clamp-1">{item.productName}</span>
                    <span className="text-red-600 shrink-0">
                      Còn {item.remainingStock}/{item.totalAllocatedStock} suất
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-amber-600 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Alert Card */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h2 className="text-base font-bold text-stone-900">Cảnh báo Tồn kho Mẻ rang</h2>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-bold">
              {lowStockProducts.length} SKU cần chú ý
            </span>
          </div>

          <div className="space-y-2.5">
            {lowStockProducts.length === 0 ? (
              <div className="text-xs text-stone-400 py-6 text-center">
                Toàn bộ dòng hạt trong kho đang ở mức an toàn.
              </div>
            ) : (
              lowStockProducts.map((p) => {
                const sku = p.skus[0];
                const isCritical = sku.availableStock < 10;
                return (
                  <div
                    key={p.id}
                    className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-stone-900 truncate">{p.name}</div>
                      <div className="font-mono text-[11px] text-stone-500">{sku.skuCode}</div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full font-bold shrink-0 ${
                        isCritical
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      Còn {sku.availableStock} túi
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Row 3: Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900">Đơn hàng mới nhất</h2>
          <button
            type="button"
            onClick={() => setActiveTab('ORDERS')}
            className="text-xs font-bold text-amber-800 hover:underline flex items-center gap-1"
          >
            <span>Quản lý tất cả đơn hàng</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 uppercase">
                <th className="py-3 font-semibold">Mã đơn</th>
                <th className="py-3 font-semibold">Khách hàng</th>
                <th className="py-3 font-semibold">Tổng tiền</th>
                <th className="py-3 font-semibold">Trạng thái</th>
                <th className="py-3 font-semibold text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.slice(0, 5).map((ord) => (
                <tr key={ord.id} className="hover:bg-stone-50">
                  <td className="py-3.5 font-mono font-bold text-stone-900">{ord.orderCode}</td>
                  <td className="py-3.5 text-stone-700">{ord.shippingAddress.recipientName}</td>
                  <td className="py-3.5 font-bold text-stone-900">{formatVnd(ord.totalPayableVnd)}</td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => onInspectOrder(ord)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xem</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

