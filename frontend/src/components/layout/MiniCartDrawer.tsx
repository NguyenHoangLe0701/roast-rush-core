import React from 'react';
import { ArrowRight, Clock, Minus, Plus, ShoppingBag, Trash2, Truck, X } from 'lucide-react';
import { useRoastRush } from '../../context/RoastRushContext';
import { formatVnd } from '../../data/mockData';
import { ReservationStatus } from '../../types/domain.types';
import { formatCountdown } from './ReservationHoldBanner';

export const MiniCartDrawer: React.FC = () => {
  const {
    isMiniCartOpen,
    setIsMiniCartOpen,
    cartItems,
    cartSubtotal,
    totalCartQuantity,
    updateCartItemQuantity,
    removeCartItem,
    activeReservation,
    setActivePage,
  } = useRoastRush();

  if (!isMiniCartOpen) return null;

  const freeshipThreshold = 500000;
  const remainingForFreeship = Math.max(0, freeshipThreshold - cartSubtotal);
  const freeshipProgress = Math.min(100, Math.round((cartSubtotal / freeshipThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsMiniCartOpen(false)}
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Slide-over Panel */}
      <div className="relative z-10 w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        {/* Drawer Header */}
        <div>
          <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-amber-800" />
              <h3 className="text-base font-black text-stone-900">
                Giỏ Hàng Của Bạn ({totalCartQuantity})
              </h3>
            </div>
            <button
              onClick={() => setIsMiniCartOpen(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-6 py-3 bg-stone-50 border-b border-stone-200 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
              <Truck className="w-4 h-4 text-amber-800 shrink-0" />
              {remainingForFreeship === 0 ? (
                <span className="text-emerald-700 font-bold">
                  🎉 Đơn hàng của bạn đã đủ điều kiện Miễn phí vận chuyển!
                </span>
              ) : (
                <span>
                  Mua thêm <strong className="text-amber-800">{formatVnd(remainingForFreeship)}</strong> để được{' '}
                  <strong>Miễn phí vận chuyển</strong>
                </span>
              )}
            </div>
            <div className="w-full h-1.5 rounded-full bg-stone-200 overflow-hidden">
              <div
                className="h-full bg-amber-800 rounded-full transition-all duration-300"
                style={{ width: `${freeshipProgress}%` }}
              />
            </div>
          </div>

          {/* 15-Minute Hold Notice inside Drawer */}
          {activeReservation && activeReservation.status === ReservationStatus.HOLDING && (
            <div className="px-6 py-2.5 bg-amber-50 border-b border-amber-200 flex items-center justify-between text-xs text-amber-950">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-800" />
                Thời gian giữ suất ưu đãi:
              </span>
              <span className="font-mono font-bold text-amber-900">
                {formatCountdown(activeReservation.remainingSeconds)}
              </span>
            </div>
          )}
        </div>

        {/* Cart Items Scroll Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-stone-100">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto" />
              <div className="text-sm font-bold text-stone-700">Chưa có sản phẩm nào trong giỏ</div>
              <p className="text-xs text-stone-400">
                Hãy chọn những túi Cà phê Đặc sản yêu thích của bạn nhé.
              </p>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div key={`${item.skuId}-${item.grindOption}-${item.weightGrams}-${idx}`} className="py-3.5 flex gap-3.5">
                <img
                  src={item.thumbnailUrl}
                  alt={item.productName}
                  className="w-16 h-16 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-stone-900 line-clamp-2">{item.productName}</h4>
                    <button
                      onClick={() => removeCartItem(item)}
                      className="text-stone-400 hover:text-rose-600 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[11px] text-stone-500">
                    Túi {item.weightGrams}g • {item.grindOption}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center border border-stone-200 rounded-lg">
                      <button
                        onClick={() => updateCartItemQuantity(item, -1)}
                        className="p-1 text-stone-500 hover:text-stone-900"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-stone-800">{item.quantity}</span>
                      <button
                        onClick={() => updateCartItemQuantity(item, 1)}
                        className="p-1 text-stone-500 hover:text-stone-900"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-black text-amber-800">
                      {formatVnd(item.subtotalVnd)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-stone-200 bg-stone-50/70 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-600 font-medium">Tạm tính:</span>
              <span className="text-lg font-black text-stone-900">{formatVnd(cartSubtotal)}</span>
            </div>

            <button
              onClick={() => {
                setIsMiniCartOpen(false);
                setActivePage('CHECKOUT');
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-sm"
            >
              <span>Tiến hành Thanh toán</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

