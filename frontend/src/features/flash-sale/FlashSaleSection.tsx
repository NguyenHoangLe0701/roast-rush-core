import React, { useEffect, useState } from 'react';
import { Flame, ShoppingBag } from 'lucide-react';
import { useRoastRush } from '../../context/RoastRushContext';
import { formatVnd } from '../../data/mockData';
import { FlashSaleItem } from '../../types/domain.types';

export const FlashSaleCard: React.FC<{ item: FlashSaleItem }> = ({ item }) => {
  const { rushFlashSaleItem } = useRoastRush();

  const soldCount = item.totalAllocatedStock - item.remainingStock;
  const soldPercent = Math.min(100, Math.round((soldCount / item.totalAllocatedStock) * 100));
  const isSoldOut = item.remainingStock <= 0;
  const discountPercent = Math.round(
    ((item.originalPriceVnd - item.salePriceVnd) / item.originalPriceVnd) * 100
  );

  return (
    <div className="rounded-2xl bg-white border border-stone-200 hover:border-amber-700/40 hover:shadow-lg transition overflow-hidden flex flex-col justify-between group">
      <div>
        <div className="relative h-56 overflow-hidden bg-stone-100">
          <img
            src={item.thumbnailUrl}
            alt={item.productName}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur text-stone-700 text-[11px] font-semibold shadow-sm">
            Túi 250g • Nguyên hạt
          </div>
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-red-600 text-white text-xs font-extrabold shadow-sm">
            -{discountPercent}%
          </div>
        </div>

        <div className="p-5 space-y-3.5">
          <h3 className="text-base font-bold text-stone-900 line-clamp-2 min-h-[3rem]">
            {item.productName}
          </h3>

          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl font-black text-red-600">{formatVnd(item.salePriceVnd)}</span>
            <span className="text-sm text-stone-400 line-through">{formatVnd(item.originalPriceVnd)}</span>
          </div>

          {/* Stock Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className={item.remainingStock <= 5 ? 'text-red-600' : 'text-amber-800'}>
                {isSoldOut ? 'Đã hết suất ưu đãi' : `Còn lại ${item.remainingStock} túi giá sốc`}
              </span>
              <span className="text-stone-400">Đã bán {soldPercent}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isSoldOut ? 'bg-stone-300' : 'bg-gradient-to-r from-red-600 to-amber-500'
                }`}
                style={{ width: `${soldPercent}%` }}
              />
            </div>
          </div>

          <div className="text-[11px] text-stone-500 pt-1">
            Giới hạn ưu đãi: Tối đa {item.maxPerCustomer} túi / khách hàng
          </div>
        </div>
      </div>

      <div className="p-5 pt-0">
        <button
          onClick={() => rushFlashSaleItem(item)}
          disabled={isSoldOut}
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
            isSoldOut
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          {isSoldOut ? 'Tạm hết hàng' : 'Mua ngay giá Flash Sale'}
        </button>
      </div>
    </div>
  );
};

export const FlashSaleSection: React.FC = () => {
  const { campaign } = useRoastRush();
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    const diff = Math.floor((new Date(campaign.endTime).getTime() - Date.now()) / 1000);
    return diff > 0 ? diff : 7122;
  });

  // Live ticking countdown (Bug 2 Fixed)
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 7200));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
  const mins = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');

  return (
    <section className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-r from-amber-900 via-amber-800 to-stone-900 text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 fill-white" />
            Khung Giờ Vàng — Số Lượng Có Hạn
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Ưu Đãi Micro-lot Đặc Sản Trong Ngày
          </h2>
          <p className="text-sm text-amber-100/90 leading-relaxed">
            Săn ngay các dòng hạt Panama Geisha và Ethiopia Anaerobic với mức giá ưu đãi đặc biệt. Đơn hàng Flash Sale
            được giữ giá trong 15 phút để bạn hoàn tất thanh toán.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur border border-white/15 rounded-2xl px-6 py-4 text-center shrink-0">
          <div className="text-xs uppercase tracking-wider text-amber-200">Kết thúc sau</div>
          <div className="text-2xl font-mono font-black text-white mt-1">
            {hours} : {mins} : {secs}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {campaign.items.map((item) => (
          <FlashSaleCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
};
