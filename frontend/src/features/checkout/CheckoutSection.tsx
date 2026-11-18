import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Gift,
  Minus,
  Plus,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { useRoastRush } from '../../context/RoastRushContext';
import { formatVnd } from '../../data/mockData';
import { PaymentProvider, ReservationStatus } from '../../types/domain.types';
import { formatCountdown } from '../../components/layout/ReservationHoldBanner';
import { CustomDropdown, DropdownOption } from '../../components/common/CustomDropdown';

const PROVINCE_OPTIONS: DropdownOption<string>[] = [
  { value: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh (Giao hỏa tốc 2h)' },
  { value: 'Hà Nội', label: 'Thủ đô Hà Nội (Giao nhanh 24h)' },
  { value: 'Đà Nẵng', label: 'TP. Đà Nẵng (Giao nhanh 24h)' },
  { value: 'Lâm Đồng - Đà Lạt', label: 'Lâm Đồng - Đà Lạt' },
  { value: 'Tỉnh / Thành khác', label: 'Tỉnh / Thành phố khác' },
];

export const CheckoutSection: React.FC = () => {
  const {
    currentUser,
    activeReservation,
    cartItems,
    cartSubtotal,
    vouchers,
    appliedVoucher,
    voucherDiscountAmount,
    applyVoucherCode,
    removeVoucher,
    totalCartQuantity,
    updateCartItemQuantity,
    removeCartItem,
    selectedProvider,
    setSelectedProvider,
    setActivePage,
    manualReleaseReservation,
    processIdempotentPayment,
  } = useRoastRush();

  const [recipientName, setRecipientName] = useState(currentUser?.fullName || 'Nguyễn Minh Quân');
  const [recipientPhone, setRecipientPhone] = useState(currentUser?.phone || '0908123456');
  const [province, setProvince] = useState('TP. Hồ Chí Minh');
  const [address, setAddress] = useState(
    currentUser?.defaultAddress || '68 Nguyễn Huệ, Phường Bến Nghé, Quận 1'
  );
  const [giftWrap, setGiftWrap] = useState(false);
  const [note, setNote] = useState('');
  const [voucherInput, setVoucherInput] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);

  const shippingFee = cartItems.length > 0 ? (cartSubtotal >= 500000 ? 0 : 30000) : 0;
  const finalTotal = Math.max(0, cartSubtotal + shippingFee - voucherDiscountAmount);

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherInput.trim()) return;
    if (applyVoucherCode(voucherInput)) {
      setVoucherInput('');
    }
  };

  const handleConfirmQrPaid = () => {
    setShowQrModal(false);
    const fullNote = [giftWrap ? '[Đóng hộp quà tặng Specialty]' : '', note.trim()]
      .filter(Boolean)
      .join(' - ');
    processIdempotentPayment({
      recipientName,
      recipientPhone,
      streetAddress: `${address}, ${province}`,
      deliveryNote: fullNote || undefined,
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 space-y-4">
        <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">Giỏ hàng của bạn đang trống</h2>
        <p className="text-sm text-stone-500">
          Hãy khám phá các dòng hạt Cà phê Đặc sản hoặc săn ưu đãi Flash Sale giới hạn ngay hôm nay.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setActivePage('FLASH_SALE')}
            className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition"
          >
            Xem Flash Sale
          </button>
          <button
            onClick={() => setActivePage('CATALOG')}
            className="px-5 py-2.5 rounded-full bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs transition"
          >
            Khám phá Cà phê Đặc sản
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Cart Items & Shipping Information */}
        <div className="lg:col-span-7 space-y-6">
          {/* 15-Minute Reservation Notice */}
          {activeReservation && activeReservation.status === ReservationStatus.HOLDING && (
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-800 shrink-0" />
                <div className="text-xs sm:text-sm text-amber-950">
                  Suất mua ưu đãi trong giỏ hàng đang được giữ chỗ cho bạn trong{' '}
                  <strong className="font-mono text-amber-900 underline">
                    {formatCountdown(activeReservation.remainingSeconds)}
                  </strong>
                </div>
              </div>
              <button
                onClick={manualReleaseReservation}
                className="text-xs text-stone-500 hover:text-red-600 font-semibold shrink-0"
              >
                Xóa giỏ hàng
              </button>
            </div>
          )}

          {/* Cart Items List */}
          <div className="rounded-2xl bg-white border border-stone-200 p-6 space-y-4 shadow-sm">
            <h2 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
              Sản phẩm trong giỏ ({totalCartQuantity})
            </h2>

            <div className="divide-y divide-stone-100">
              {cartItems.map((item, idx) => (
                <div
                  key={`${item.skuId}-${item.grindOption}-${item.weightGrams}-${idx}`}
                  className="py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.productName}
                      className="w-16 h-16 rounded-xl object-cover bg-stone-100 border border-stone-200"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-stone-900">{item.productName}</h4>
                        {item.isFlashSaleApplied && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200 font-bold">
                            Flash Sale
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-stone-500">
                        Túi {item.weightGrams}g • Cỡ xay: {item.grindOption}
                      </div>
                      <div className="text-xs font-semibold text-amber-800">
                        {formatVnd(item.unitPriceVnd)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-stone-200 rounded-lg">
                      <button
                        onClick={() => updateCartItemQuantity(item, -1)}
                        className="p-1.5 text-stone-500 hover:text-stone-900"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2.5 text-xs font-bold text-stone-800">{item.quantity}</span>
                      <button
                        onClick={() => updateCartItemQuantity(item, 1)}
                        className="p-1.5 text-stone-500 hover:text-stone-900"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[95px]">
                      <div className="text-sm font-bold text-stone-900">{formatVnd(item.subtotalVnd)}</div>
                    </div>

                    <button
                      onClick={() => removeCartItem(item)}
                      className="text-stone-400 hover:text-red-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address Form */}
          <div className="rounded-2xl bg-white border border-stone-200 p-6 space-y-4 shadow-sm">
            <h3 className="text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
              Thông tin giao hàng
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Họ và tên người nhận</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-amber-800"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Số điện thoại</label>
                <input
                  type="tel"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-amber-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Tỉnh / Thành phố</label>
                <CustomDropdown
                  value={province}
                  options={PROVINCE_OPTIONS}
                  onChange={(val) => setProvince(val)}
                  align="left"
                  buttonClassName="h-10 px-3.5 rounded-xl text-xs font-semibold shadow-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-stone-700">Địa chỉ số nhà, tên đường</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-amber-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700">Ghi chú đơn hàng (Tùy chọn)</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-amber-800"
              />
            </div>

            {/* Complimentary Specialty Gift Box Option (Task 3.1) */}
            <label className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between gap-3 cursor-pointer">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={(e) => setGiftWrap(e.target.checked)}
                  className="rounded border-amber-400 text-amber-800 focus:ring-amber-800"
                />
                <div className="text-xs">
                  <span className="font-bold text-amber-950 flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-amber-800" />
                    Đóng hộp quà tặng Specialty & Thiệp hướng dẫn pha chế
                  </span>
                  <span className="text-stone-500 block mt-0.5">
                    Kèm túi giấy ép kim sang trọng & sổ tay công thức Pour Over
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-white text-amber-900 border border-amber-200 text-[11px] font-extrabold shrink-0">
                Miễn phí
              </span>
            </label>
          </div>
        </div>

        {/* Right: Voucher, Payment Method & Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl bg-white border border-stone-200 p-6 space-y-5 shadow-sm sticky top-28">
            {/* Voucher Section */}
            <div className="space-y-3 border-b border-stone-100 pb-5">
              <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
                <Tag className="w-4 h-4 text-amber-800" />
                <span>Mã giảm giá / Ưu đãi</span>
              </div>

              <form onSubmit={handleApplyVoucher} className="flex gap-2">
                <input
                  type="text"
                  value={voucherInput}
                  onChange={(e) => setVoucherInput(e.target.value)}
                  placeholder="Nhập mã (VD: ROAST50K, GEISHA10)..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 uppercase focus:outline-none focus:border-amber-800"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-amber-800 text-white text-xs font-bold transition"
                >
                  Áp dụng
                </button>
              </form>

              {/* Quick Select Available Vouchers */}
              <div className="flex flex-wrap gap-1.5">
                {vouchers.map((v) => (
                  <button
                    key={v.code}
                    type="button"
                    onClick={() => applyVoucherCode(v.code)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold transition ${
                      appliedVoucher?.code === v.code
                        ? 'bg-amber-800 text-white border-amber-800'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:border-amber-800'
                    }`}
                    title={v.description}
                  >
                    {v.code}
                  </button>
                ))}
              </div>

              {appliedVoucher && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                  <span>
                    Đã áp dụng <strong>{appliedVoucher.code}</strong> (-{formatVnd(voucherDiscountAmount)})
                  </span>
                  <button onClick={removeVoucher} className="text-emerald-700 hover:text-rose-600 font-bold">
                    Gỡ
                  </button>
                </div>
              )}
            </div>

            <h3 className="text-base font-bold text-stone-900">Phương thức thanh toán</h3>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setSelectedProvider(PaymentProvider.VNPAY)}
                className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition ${
                  selectedProvider === PaymentProvider.VNPAY
                    ? 'bg-blue-50/60 border-blue-600 text-stone-900'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="text-sm font-bold text-blue-900">Cổng thanh toán VNPay QR / Thẻ ATM</div>
                  <div className="text-xs text-stone-500 mt-0.5">
                    Quét mã QR ngân hàng hoặc thẻ nội địa/quốc tế
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center">
                  {selectedProvider === PaymentProvider.VNPAY && (
                    <div className="w-2 h-2 rounded-full bg-blue-600" />
                  )}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedProvider(PaymentProvider.MOMO)}
                className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition ${
                  selectedProvider === PaymentProvider.MOMO
                    ? 'bg-pink-50/60 border-pink-600 text-stone-900'
                    : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="text-sm font-bold text-pink-700">Ví điện tử MoMo</div>
                  <div className="text-xs text-stone-500 mt-0.5">Thanh toán siêu tốc qua ứng dụng MoMo</div>
                </div>
                <div className="w-4 h-4 rounded-full border-2 border-pink-600 flex items-center justify-center">
                  {selectedProvider === PaymentProvider.MOMO && (
                    <div className="w-2 h-2 rounded-full bg-pink-600" />
                  )}
                </div>
              </button>
            </div>

            <div className="space-y-2.5 text-sm border-t border-stone-100 pt-4">
              <div className="flex justify-between text-stone-600">
                <span>Tạm tính ({totalCartQuantity} sản phẩm):</span>
                <span className="font-semibold text-stone-900">{formatVnd(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Phí vận chuyển:</span>
                <span className="font-semibold text-stone-900">
                  {shippingFee === 0 ? 'Miễn phí' : formatVnd(shippingFee)}
                </span>
              </div>
              {voucherDiscountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Giảm giá Voucher ({appliedVoucher?.code}):</span>
                  <span>-{formatVnd(voucherDiscountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-stone-900 pt-3 border-t border-stone-100">
                <span>Tổng cộng:</span>
                <span className="text-xl text-amber-800">{formatVnd(finalTotal)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowQrModal(true)}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition"
            >
              <QrCode className="w-4 h-4" />
              <span>Thanh toán qua {selectedProvider} ({formatVnd(finalTotal)})</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-stone-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Bảo mật chữ ký số HMAC • Chống trừ tiền 2 lần</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          VNPAY / MOMO QR PAYMENT GATEWAY MODAL (Task 2.3)
      ===================================================================== */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowQrModal(false)}
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs"
          />

          <div className="relative z-10 w-full max-w-md rounded-3xl bg-white border border-stone-200 shadow-2xl p-6 space-y-5 text-center">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                  selectedProvider === PaymentProvider.VNPAY
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-pink-50 text-pink-700'
                }`}
              >
                Cổng Thanh Toán {selectedProvider}
              </span>
              <button
                onClick={() => setShowQrModal(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-stone-500">Số tiền cần thanh toán</div>
              <div className="text-2xl font-black text-stone-900">{formatVnd(finalTotal)}</div>
            </div>

            {/* Simulated QR Code Visual */}
            <div className="w-52 h-52 mx-auto rounded-2xl bg-stone-50 border-2 border-dashed border-stone-300 flex flex-col items-center justify-center p-4 space-y-2">
              <QrCode
                className={`w-28 h-28 ${
                  selectedProvider === PaymentProvider.VNPAY ? 'text-blue-900' : 'text-pink-700'
                }`}
              />
              <span className="text-[11px] font-semibold text-stone-500">
                Quét mã bằng ứng dụng {selectedProvider === PaymentProvider.VNPAY ? 'Ngân hàng / VNPay' : 'MoMo'}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1 text-left">
              <div className="flex justify-between">
                <span className="text-stone-500">Nội dung chuyển khoản:</span>
                <span className="font-mono font-bold text-stone-900">
                  {activeReservation?.orderCode || 'ROASTRUSH-PAY'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Đơn vị thụ hưởng:</span>
                <span className="font-bold text-stone-900">CTCP CA PHE DAC SAN ROASTRUSH</span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="flex-1 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition"
              >
                Đổi phương thức
              </button>
              <button
                type="button"
                onClick={handleConfirmQrPaid}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Xác nhận đã thanh toán</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
