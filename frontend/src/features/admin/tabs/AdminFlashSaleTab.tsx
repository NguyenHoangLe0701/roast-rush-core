import React, { useMemo, useState } from 'react';
import { Clock, Flame, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useRoastRush } from '../../../context/RoastRushContext';
import { formatVnd } from '../../../data/mockData';
import { FlashSaleItem, ReservationStatus, StockReservation } from '../../../types/domain.types';
import { CustomDropdown } from '../../../components/common/CustomDropdown';
import { formatCountdown } from '../../../components/layout/ReservationHoldBanner';

interface AdminFlashSaleTabProps {
  filteredFlashSaleItems: FlashSaleItem[];
}

const DEMO_HISTORY_RESERVATIONS: StockReservation[] = [
  {
    reservationId: 'res-hist-901',
    orderCode: 'RR1118-8821',
    userId: 'usr-demo-1',
    skuId: 'sku-panama-geisha-250',
    flashSaleItemId: 'fs-item-01',
    quantity: 1,
    status: ReservationStatus.CONFIRMED,
    lockedPriceVnd: 890000,
    reservedAt: new Date(Date.now() - 3600 * 1000 * 2).toISOString(),
    expiresAt: new Date(Date.now() - 3600 * 1000 * 2 + 900 * 1000).toISOString(),
    remainingSeconds: 0,
  },
  {
    reservationId: 'res-hist-902',
    orderCode: 'RR1118-6012',
    userId: 'usr-demo-9',
    skuId: 'sku-caudat-yellow-bourbon-250',
    flashSaleItemId: 'fs-item-03',
    quantity: 2,
    status: ReservationStatus.EXPIRED,
    lockedPriceVnd: 269000,
    reservedAt: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
    expiresAt: new Date(Date.now() - 3600 * 1000 * 4 + 900 * 1000).toISOString(),
    remainingSeconds: 0,
  },
];

export const AdminFlashSaleTab: React.FC<AdminFlashSaleTabProps> = ({
  filteredFlashSaleItems,
}) => {
  const {
    products,
    campaign,
    activeReservation,
    updateFlashSaleStock,
    updateFlashSaleItemConfig,
    createNewFlashSaleItem,
    warmupFlashSaleRedis,
    manualReleaseReservation,
  } = useRoastRush();

  const [showAddFsModal, setShowAddFsModal] = useState(false);
  const [fsProductId, setFsProductId] = useState<string>(products[0]?.id || 'prod-01');
  const [fsSalePrice, setFsSalePrice] = useState<string>('390000');
  const [fsAllocatedStock, setFsAllocatedStock] = useState<string>('40');
  const [fsMaxPerCustomer, setFsMaxPerCustomer] = useState<string>('2');

  const handleAddFlashSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createNewFlashSaleItem({
      productId: fsProductId,
      salePriceVnd: parseInt(fsSalePrice, 10) || 350000,
      totalAllocatedStock: parseInt(fsAllocatedStock, 10) || 30,
      maxPerCustomer: parseInt(fsMaxPerCustomer, 10) || 2,
    });
    setShowAddFsModal(false);
  };

  const reservationRows = useMemo(() => {
    const list: StockReservation[] = [];
    if (activeReservation) {
      list.push(activeReservation);
    }
    return [...list, ...DEMO_HISTORY_RESERVATIONS];
  }, [activeReservation]);

  return (
    <div className="space-y-6">
      {/* 1. Flash Sale Campaign Management Table */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-stone-900">{campaign.title}</h2>
            <p className="text-xs text-stone-500">
              Điều phối giá Flash Sale, hạn mức mỗi khách và đồng bộ tồn kho từ MySQL lên Redis
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={warmupFlashSaleRedis}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition shadow-sm"
              title="Đồng bộ lại toàn bộ số suất Flash Sale lên Redis Cluster"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Đồng bộ lại Redis Stock (Warm-up)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowAddFsModal(!showAddFsModal)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm mặt hàng Flash Sale</span>
            </button>
          </div>
        </div>

        {showAddFsModal && (
          <form
            onSubmit={handleAddFlashSaleSubmit}
            className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4 text-xs"
          >
            <h3 className="text-sm font-bold text-stone-900">
              Đưa sản phẩm từ kho vào chiến dịch Flash Sale
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div className="sm:col-span-2">
                <label className="font-semibold text-stone-700 block mb-1">
                  Chọn dòng hạt trong kho
                </label>
                <CustomDropdown
                  value={fsProductId}
                  options={products.map((p) => ({
                    value: p.id,
                    label: `${p.name} (Giá gốc: ${formatVnd(p.skus[0].basePriceVnd)})`,
                  }))}
                  onChange={(val) => setFsProductId(val)}
                  align="left"
                  buttonClassName="h-9 px-3 rounded-lg text-xs font-semibold shadow-sm"
                />
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Giá Flash Sale (VNĐ)
                </label>
                <input
                  type="number"
                  step={10000}
                  value={fsSalePrice}
                  onChange={(e) => setFsSalePrice(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-stone-300 bg-white font-bold text-red-600"
                />
              </div>
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Số suất phân bổ Redis
                </label>
                <input
                  type="number"
                  min={1}
                  value={fsAllocatedStock}
                  onChange={(e) => setFsAllocatedStock(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-stone-300 bg-white font-bold"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Giới hạn tối đa / khách
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={fsMaxPerCustomer}
                  onChange={(e) => setFsMaxPerCustomer(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-stone-300 bg-white font-bold"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAddFsModal(false)}
                className="px-4 py-2 rounded-lg bg-stone-200 text-stone-700 font-semibold"
              >
                Đóng
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-800 text-white font-bold"
              >
                Kích hoạt lên Redis
              </button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 uppercase">
                <th className="py-3 font-semibold">Mã SKU</th>
                <th className="py-3 font-semibold">Tên sản phẩm</th>
                <th className="py-3 font-semibold">Giá Flash Sale (VNĐ)</th>
                <th className="py-3 font-semibold">Giới hạn / khách</th>
                <th className="py-3 font-semibold">Suất còn lại</th>
                <th className="py-3 font-semibold text-right">Bổ sung suất</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredFlashSaleItems.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50">
                  <td className="py-4 font-mono font-semibold text-stone-700">{item.skuCode}</td>
                  <td className="py-4 font-bold text-stone-900">{item.productName}</td>
                  <td className="py-4">
                    <input
                      type="number"
                      step={10000}
                      value={item.salePriceVnd}
                      onChange={(e) =>
                        updateFlashSaleItemConfig(
                          item.id,
                          Number(e.target.value),
                          item.maxPerCustomer
                        )
                      }
                      className="w-28 px-2.5 py-1.5 rounded-lg border border-stone-300 font-bold text-red-600"
                    />
                  </td>
                  <td className="py-4">
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={item.maxPerCustomer}
                      onChange={(e) =>
                        updateFlashSaleItemConfig(
                          item.id,
                          item.salePriceVnd,
                          Number(e.target.value)
                        )
                      }
                      className="w-16 px-2.5 py-1.5 rounded-lg border border-stone-300 font-bold text-stone-800"
                    />
                  </td>
                  <td className="py-4 font-bold text-stone-900">
                    {item.remainingStock} / {item.totalAllocatedStock} túi
                  </td>
                  <td className="py-4 text-right">
                    <button
                      type="button"
                      onClick={() => updateFlashSaleStock(item.id, item.remainingStock + 5)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-800 hover:bg-amber-900 text-white font-bold transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>+5 suất</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Live 15-Minute StockReservation Monitor (Redis TTL + Kafka Delay Queue) */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Giám sát Phiên Giữ Chỗ 15 Phút (StockReservation Monitor)
              </h3>
              <p className="text-xs text-stone-500">
                Theo dõi các lượt giữ chỗ trên Redis TTL & Kafka topic{' '}
                <code className="font-mono text-amber-800">roastrush.reservation.delay.15m</code>
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-700 text-xs font-bold">
            <Flame className="w-3.5 h-3.5 text-red-600" />
            <span>
              {activeReservation && activeReservation.status === ReservationStatus.HOLDING
                ? '1 phiên đang HOLDING'
                : '0 phiên đang HOLDING'}
            </span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500 uppercase">
                <th className="py-3 font-semibold">Reservation ID</th>
                <th className="py-3 font-semibold">Mã đơn</th>
                <th className="py-3 font-semibold">SKU & SL</th>
                <th className="py-3 font-semibold">Giá khóa</th>
                <th className="py-3 font-semibold">TTL còn lại</th>
                <th className="py-3 font-semibold">Trạng thái</th>
                <th className="py-3 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {reservationRows.map((res) => {
                const isHolding = res.status === ReservationStatus.HOLDING;
                const isConfirmed = res.status === ReservationStatus.CONFIRMED;
                return (
                  <tr key={res.reservationId} className="hover:bg-stone-50">
                    <td className="py-3.5 font-mono text-stone-600">{res.reservationId}</td>
                    <td className="py-3.5 font-mono font-bold text-stone-900">{res.orderCode}</td>
                    <td className="py-3.5 text-stone-700">
                      <span className="font-mono">{res.skuId}</span> (x{res.quantity})
                    </td>
                    <td className="py-3.5 font-bold text-stone-900">
                      {formatVnd(res.lockedPriceVnd)}
                    </td>
                    <td className="py-3.5 font-mono font-bold text-amber-800">
                      {isHolding ? formatCountdown(res.remainingSeconds) : '00:00'}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          isHolding
                            ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse'
                            : isConfirmed
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {res.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      {isHolding ? (
                        <button
                          type="button"
                          onClick={manualReleaseReservation}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Thu hồi giữ chỗ (Force Release)</span>
                        </button>
                      ) : (
                        <span className="text-stone-400">Đã xử lý</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

