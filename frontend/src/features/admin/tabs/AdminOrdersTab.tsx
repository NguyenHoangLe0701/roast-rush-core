import React, { useMemo, useState } from 'react';
import { CheckSquare, Download, Eye, Flame, Truck } from 'lucide-react';
import { useRoastRush } from '../../../context/RoastRushContext';
import { formatVnd } from '../../../data/mockData';
import { Order, OrderStatus } from '../../../types/domain.types';
import { CustomDropdown, DropdownOption } from '../../../components/common/CustomDropdown';
import { PaginationBar } from '../../../components/common/PaginationBar';

const ADMIN_ORDER_STATUS_OPTIONS: DropdownOption<OrderStatus>[] = [
  { value: OrderStatus.PAID, label: 'PAID (Đã thanh toán)' },
  { value: OrderStatus.ROASTING_PACKING, label: 'ROASTING_PACKING (Đang rang)' },
  { value: OrderStatus.SHIPPING, label: 'SHIPPING (Đang giao)' },
  { value: OrderStatus.DELIVERED, label: 'DELIVERED (Hoàn tất)' },
  { value: OrderStatus.CANCELLED, label: 'CANCELLED (Đã hủy)' },
];

interface AdminOrdersTabProps {
  filteredOrders: Order[];
  orderStatusFilter: 'ALL' | OrderStatus;
  setOrderStatusFilter: (status: 'ALL' | OrderStatus) => void;
  onExportCsv: () => void;
  onInspectOrder: (order: Order) => void;
}

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({
  filteredOrders,
  orderStatusFilter,
  setOrderStatusFilter,
  onExportCsv,
  onInspectOrder,
}) => {
  const { updateOrderStatus, bulkUpdateOrderStatus } = useRoastRush();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const pagedOrders = useMemo(() => {
    const start = page * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, page, pageSize]);

  const allOnPageSelected =
    pagedOrders.length > 0 && pagedOrders.every((o) => selectedIds.includes(o.id));

  const toggleSelectAllOnPage = () => {
    if (allOnPageSelected) {
      const pageIds = new Set(pagedOrders.map((o) => o.id));
      setSelectedIds((prev) => prev.filter((id) => !pageIds.has(id)));
    } else {
      const merged = new Set([...selectedIds, ...pagedOrders.map((o) => o.id)]);
      setSelectedIds(Array.from(merged));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBulkStatus = (status: OrderStatus) => {
    bulkUpdateOrderStatus(selectedIds, status);
    setSelectedIds([]);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-stone-900">Danh sách toàn bộ đơn hàng</h2>
          <p className="text-xs text-stone-500">
            Tích chọn nhiều đơn để duyệt hàng loạt, lọc theo trạng thái và xuất báo cáo CSV
          </p>
        </div>

        <button
          type="button"
          onClick={onExportCsv}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-amber-800 text-white text-xs font-bold transition shadow-sm self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Xuất CSV</span>
        </button>
      </div>

      {/* Order Status Filter Pills */}
      <div className="flex flex-wrap gap-1.5">
        {[
          { id: 'ALL', label: 'Tất cả' },
          { id: OrderStatus.PAID, label: 'Đã thanh toán' },
          { id: OrderStatus.ROASTING_PACKING, label: 'Đang rang' },
          { id: OrderStatus.SHIPPING, label: 'Đang giao' },
          { id: OrderStatus.DELIVERED, label: 'Hoàn tất' },
          { id: OrderStatus.CANCELLED, label: 'Đã hủy' },
        ].map((tab) => (
          <button
            type="button"
            key={tab.id}
            onClick={() => {
              setOrderStatusFilter(tab.id as 'ALL' | OrderStatus);
              setPage(0);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              orderStatusFilter === tab.id
                ? 'bg-amber-800 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 font-bold text-amber-950">
            <CheckSquare className="w-4 h-4 text-amber-800" />
            <span>Đã chọn {selectedIds.length} đơn hàng</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleBulkStatus(OrderStatus.ROASTING_PACKING)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-bold transition"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Chuyển sang Đang rang</span>
            </button>

            <button
              type="button"
              onClick={() => handleBulkStatus(OrderStatus.SHIPPING)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold transition"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Bàn giao Vận chuyển</span>
            </button>

            <button
              type="button"
              onClick={() => handleBulkStatus(OrderStatus.CANCELLED)}
              className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold transition"
            >
              Hủy đơn loạt
            </button>

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1.5 text-stone-500 hover:text-stone-800 font-semibold"
            >
              Bỏ chọn
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-stone-200 text-stone-500 uppercase">
              <th className="py-3 pr-3 w-8">
                <input
                  type="checkbox"
                  checked={allOnPageSelected}
                  onChange={toggleSelectAllOnPage}
                  className="rounded border-stone-300 text-amber-800 focus:ring-amber-800"
                />
              </th>
              <th className="py-3 font-semibold">Mã đơn</th>
              <th className="py-3 font-semibold">Khách hàng & SĐT</th>
              <th className="py-3 font-semibold">Sản phẩm đặt</th>
              <th className="py-3 font-semibold">Tổng thanh toán</th>
              <th className="py-3 font-semibold">Cập nhật trạng thái</th>
              <th className="py-3 font-semibold text-right">Phiếu đơn</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {pagedOrders.map((ord) => (
              <tr key={ord.id} className="hover:bg-stone-50">
                <td className="py-4 pr-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(ord.id)}
                    onChange={() => toggleSelectOne(ord.id)}
                    className="rounded border-stone-300 text-amber-800 focus:ring-amber-800"
                  />
                </td>
                <td className="py-4 font-mono font-bold text-stone-900">{ord.orderCode}</td>
                <td className="py-4">
                  <div className="font-bold text-stone-900">{ord.shippingAddress.recipientName}</div>
                  <div className="text-stone-500">{ord.shippingAddress.recipientPhone}</div>
                </td>
                <td className="py-4">
                  {ord.items.map((i) => (
                    <div key={i.id} className="text-stone-700">
                      • {i.productName} ({i.weightGrams}g - x{i.quantity})
                    </div>
                  ))}
                </td>
                <td className="py-4 font-bold text-amber-800">{formatVnd(ord.totalPayableVnd)}</td>
                <td className="py-4">
                  <CustomDropdown
                    value={ord.status}
                    options={ADMIN_ORDER_STATUS_OPTIONS}
                    onChange={(val) => updateOrderStatus(ord.id, val)}
                    className="w-56"
                    buttonClassName="h-9 px-3.5 rounded-full text-xs font-semibold shadow-sm"
                  />
                </td>
                <td className="py-4 text-right">
                  <button
                    type="button"
                    onClick={() => onInspectOrder(ord)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Chi tiết</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationBar
        page={page}
        size={pageSize}
        totalElements={filteredOrders.length}
        onPageChange={setPage}
        onSizeChange={(s) => {
          setPageSize(s);
          setPage(0);
        }}
      />
    </div>
  );
};

