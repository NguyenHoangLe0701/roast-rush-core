import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  Coffee,
  FileText,
  Flame,
  Package,
  Printer,
  QrCode,
  Search,
  Truck,
  X,
  XCircle,
} from 'lucide-react';
import { useRoastRush } from '../../context/RoastRushContext';
import { formatVnd } from '../../data/mockData';
import { Order, OrderStatus } from '../../types/domain.types';

const ORDER_STEPS: Array<{ status: OrderStatus; label: string }> = [
  { status: OrderStatus.PAID, label: 'Đã thanh toán' },
  { status: OrderStatus.ROASTING_PACKING, label: 'Đang rang & Đóng gói' },
  { status: OrderStatus.SHIPPING, label: 'Đang giao hàng' },
  { status: OrderStatus.DELIVERED, label: 'Giao thành công' },
];

const getStepIndex = (status: OrderStatus): number => {
  if (status === OrderStatus.PAID) return 0;
  if (status === OrderStatus.ROASTING_PACKING) return 1;
  if (status === OrderStatus.SHIPPING) return 2;
  if (status === OrderStatus.DELIVERED) return 3;
  return -1;
};

export const OrdersPage: React.FC = () => {
  const { orderHistory, setActivePage, cancelOrderByCustomer } = useRoastRush();
  const [orderSearch, setOrderSearch] = useState('');
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);

  const filtered = orderHistory.filter(
    (o) =>
      o.orderCode.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.shippingAddress.recipientPhone.includes(orderSearch)
  );

  if (orderHistory.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 space-y-4">
        <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
          <Package className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">Chưa có đơn hàng nào</h2>
        <p className="text-sm text-stone-500">
          Các đơn hàng Cà phê Đặc sản bạn đã đặt sẽ được hiển thị chi tiết tại đây.
        </p>
        <button
          onClick={() => setActivePage('HOME')}
          className="px-5 py-2.5 rounded-full bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs transition"
        >
          Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <>
      <section className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-stone-900">Tra Cứu & Lịch Sử Đơn Hàng</h1>
            <p className="text-sm text-stone-500 mt-1">
              Theo dõi trực tiếp tiến độ rang xay, xem hóa đơn và chứng nhận mẻ rang SCA 85+
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              placeholder="Nhập mã đơn (VD: RR1118)..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:border-amber-800"
            />
          </div>
        </div>

        <div className="space-y-5">
          {filtered.map((order) => {
            const isCancelled =
              order.status === OrderStatus.CANCELLED || order.status === OrderStatus.EXPIRED;
            const canCancel =
              order.status === OrderStatus.PAID || order.status === OrderStatus.PENDING_PAYMENT;
            const currentStepIdx = getStepIndex(order.status);

            return (
              <div
                key={order.id}
                className="rounded-2xl bg-white border border-stone-200 p-6 space-y-5 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-xs text-stone-500">Mã đơn hàng: </span>
                    <span className="font-mono font-bold text-stone-900 text-sm">{order.orderCode}</span>
                    <span className="mx-2 text-stone-300">•</span>
                    <span className="text-xs text-stone-500">
                      {new Date(order.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setInvoiceOrder(order)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Hóa đơn & Chứng nhận rang</span>
                    </button>

                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        isCancelled
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {isCancelled ? (
                        <XCircle className="w-3.5 h-3.5" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      <span>{order.status}</span>
                    </span>

                    {canCancel && (
                      <button
                        type="button"
                        onClick={() => cancelOrderByCustomer(order.id)}
                        className="text-xs px-3 py-1 rounded-full bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-600 font-semibold transition"
                      >
                        Hủy đơn
                      </button>
                    )}
                  </div>
                </div>

                {/* 4-Step Order Tracking Stepper */}
                {!isCancelled && currentStepIdx >= 0 && (
                  <div className="py-3 px-4 rounded-xl bg-stone-50 border border-stone-200/80">
                    <div className="grid grid-cols-4 gap-2">
                      {ORDER_STEPS.map((step, idx) => {
                        const isDone = idx <= currentStepIdx;
                        const isCurrent = idx === currentStepIdx;
                        return (
                          <div
                            key={step.status}
                            className="flex flex-col items-center text-center space-y-1.5"
                          >
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                                isDone
                                  ? 'bg-amber-800 text-white shadow-sm'
                                  : 'bg-stone-200 text-stone-500'
                              }`}
                            >
                              {idx === 1 ? (
                                <Flame className="w-3.5 h-3.5" />
                              ) : idx === 2 ? (
                                <Truck className="w-3.5 h-3.5" />
                              ) : (
                                idx + 1
                              )}
                            </div>
                            <span
                              className={`text-[11px] leading-tight ${
                                isCurrent
                                  ? 'font-extrabold text-amber-900'
                                  : isDone
                                  ? 'font-semibold text-stone-800'
                                  : 'text-stone-400'
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="divide-y divide-stone-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between text-sm">
                      <div>
                        <div className="font-bold text-stone-900">{item.productName}</div>
                        <div className="text-xs text-stone-500">
                          Túi {item.weightGrams}g • Cỡ xay: {item.grindOption} • Số lượng: x{item.quantity}
                        </div>
                      </div>
                      <div className="font-semibold text-stone-900">{formatVnd(item.subtotalVnd)}</div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-stone-100">
                  <div className="text-xs text-stone-500">
                    Giao đến: <strong className="text-stone-700">{order.shippingAddress.recipientName}</strong> (
                    {order.shippingAddress.recipientPhone}) — {order.shippingAddress.streetAddress}
                  </div>
                  <div className="text-right">
                    {order.discountAmountVnd > 0 && (
                      <div className="text-xs text-emerald-700 font-semibold">
                        Đã giảm Voucher: -{formatVnd(order.discountAmountVnd)}
                      </div>
                    )}
                    <div className="text-base font-black text-amber-800">
                      Tổng thanh toán: {formatVnd(order.totalPayableVnd)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          PRINTABLE ORDER INVOICE & ROAST CERTIFICATE MODAL (Task 3.2)
      ===================================================================== */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setInvoiceOrder(null)}
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm"
          />

          <div className="relative z-10 w-full max-w-lg rounded-3xl bg-white border border-stone-200 shadow-2xl p-6 sm:p-8 space-y-5 text-xs">
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-800 text-white flex items-center justify-center">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-black text-stone-900">ROASTRUSH SPECIALTY ROASTERY</div>
                  <div className="text-[11px] text-amber-800 font-bold">
                    PHIẾU HÓA ĐƠN & CHỨNG NHẬN MẺ RANG SCA 85+
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInvoiceOrder(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
              <div>
                <span className="text-stone-400 block">Mã hóa đơn:</span>
                <span className="font-mono font-bold text-stone-900 text-sm">
                  #{invoiceOrder.orderCode}
                </span>
              </div>
              <div>
                <span className="text-stone-400 block">Ngày rang & đóng gói:</span>
                <span className="font-bold text-stone-900">
                  {new Date(invoiceOrder.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="col-span-2 pt-1 border-t border-stone-200/70">
                <span className="text-stone-400">Khách hàng: </span>
                <strong className="text-stone-900">
                  {invoiceOrder.shippingAddress.recipientName} ({invoiceOrder.shippingAddress.recipientPhone})
                </strong>
                <div className="text-stone-500 mt-0.5">{invoiceOrder.shippingAddress.streetAddress}</div>
              </div>
            </div>

            <div className="divide-y divide-stone-100">
              {invoiceOrder.items.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between">
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

            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-800" />
                  <span>Chứng nhận Rang mộc Micro-batch 100%</span>
                </div>
                <div className="text-[11px] text-stone-600">
                  Head Roaster: Master Minh Quân • Degassing chuẩn 48h
                </div>
              </div>
              <QrCode className="w-9 h-9 text-amber-900 shrink-0" />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-200">
              <div>
                <span className="text-stone-500 block">Tổng thanh toán (Đã gồm VAT):</span>
                <span className="text-lg font-black text-amber-800">
                  {formatVnd(invoiceOrder.totalPayableVnd)}
                </span>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-amber-800 text-white font-bold transition"
              >
                <Printer className="w-4 h-4" />
                <span>In phiếu hóa đơn</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
