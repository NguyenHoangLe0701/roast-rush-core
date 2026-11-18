import React, { useState } from 'react';
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Coffee,
  Flame,
  Mail,
  Mountain,
  PackageCheck,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { useRoastRush } from '../../context/RoastRushContext';
import { FlashSaleSection } from '../flash-sale/FlashSaleSection';
import { ProductCard } from '../catalog/CatalogSection';

export const HomeSection: React.FC = () => {
  const { setActivePage, products } = useRoastRush();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Show top 3 Featured Products in a balanced 3-column grid matching Flash Sale cards
  const featuredProducts = products.filter((p) => p.active !== false).slice(0, 3);

  return (
    <div className="space-y-14">
      {/* E-Commerce Hero Banner */}
      <section className="rounded-3xl bg-stone-50 border border-stone-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-center">
        <div className="lg:col-span-7 p-8 sm:p-12 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
            <Award className="w-4 h-4 text-amber-800" />
            100% Specialty Coffee Chuẩn SCA 85+
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-stone-900 tracking-tight leading-tight">
            Đánh Thức Hương Vị <br />
            <span className="text-amber-800">Cà Phê Đặc Sản Nguyên Bản</span>
          </h1>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl">
            Từ những trái cà phê chín mọng trên sườn núi lửa Boquete (Panama), vùng cao nguyên Sidama (Ethiopia) đến
            Cầu Đất (Đà Lạt) — Rang mộc mới mỗi tuần để giữ trọn vẹn tầng hương hoa quả tự nhiên.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setActivePage('CATALOG')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm transition shadow-sm whitespace-nowrap"
            >
              <span>Mua sắm ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setActivePage('FLASH_SALE')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-red-50 text-red-600 border border-red-200 font-bold text-sm transition whitespace-nowrap"
            >
              <Flame className="w-4 h-4 fill-red-600" />
              <span>Săn Flash Sale Hôm Nay</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 h-72 lg:h-full min-h-[340px] bg-stone-200">
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80"
            alt="Specialty Coffee Pour Over"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Store Value Propositions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-800 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">Tuyển chọn Micro-lot SCA 85+</h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Minh bạch 100% thông tin nông trại, độ cao, giống hạt và phương pháp sơ chế.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-800 shrink-0">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">Rang mới & Xay theo yêu cầu</h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Hỗ trợ xay chuẩn xác cho V60, Espresso, Phin hoặc giữ nguyên hạt (Whole Bean).
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-start gap-4">
          <div className="p-3 rounded-xl bg-amber-100 text-amber-800 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">Giữ giá ưu đãi & Thanh toán an toàn</h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Tự động giữ suất Flash Sale trong 15 phút khi đặt hàng, thanh toán nhanh qua VNPay & MoMo.
            </p>
          </div>
        </div>
      </section>

      {/* Flash Sale Section */}
      <FlashSaleSection />

      {/* Featured Roasts Showcase (Balanced 3-Column Grid matching Flash Sale above) */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>Best Sellers</span>
            </div>
            <h2 className="text-2xl font-black text-stone-900">Mẻ Rang Đặc Sản Nổi Bật</h2>
            <p className="text-sm text-stone-500 mt-1">
              Những dòng hạt được yêu thích nhất tuần này tại xưởng rang RoastRush
            </p>
          </div>

          <button
            type="button"
            onClick={() => setActivePage('CATALOG')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-50 hover:bg-amber-100 text-xs font-bold text-amber-900 transition whitespace-nowrap"
          >
            <span>Xem toàn bộ {products.filter((p) => p.active !== false).length} sản phẩm</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4-Step Roastery Craftsmanship Process (Task 2.2) */}
      <section className="rounded-3xl bg-stone-50 border border-stone-200 p-8 sm:p-10 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
            <Coffee className="w-3.5 h-3.5" />
            <span>From Farm To Cup</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
            Quy Trình 4 Bước Chế Tác Hạt Đặc Sản
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Mỗi túi cà phê RoastRush đều trải qua quy trình kiểm định khắt khe trước khi đến tay bạn
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              icon: <Mountain className="w-5 h-5 text-amber-800" />,
              title: 'Tuyển chọn Nông trại SCA 85+',
              desc: 'Thu mua trực tiếp các lô Micro-lot đạt trên 85 điểm SCA từ độ cao 1,650m – 2,350m.',
            },
            {
              step: '02',
              icon: <Flame className="w-5 h-5 text-amber-800" />,
              title: 'Rang mộc Mẻ nhỏ (Micro-Batch)',
              desc: 'Kiểm soát biểu đồ nhiệt chính xác từng giây để đánh thức hương hoa nhài và trái cây.',
            },
            {
              step: '03',
              icon: <PackageCheck className="w-5 h-5 text-amber-800" />,
              title: 'Đóng gói Van 1 chiều Thụy Sĩ',
              desc: 'Giúp hạt thoát khí CO2 tự nhiên sau rang mà không cho oxy xâm nhập làm giảm hương.',
            },
            {
              step: '04',
              icon: <Truck className="w-5 h-5 text-amber-800" />,
              title: 'Xay theo dụng cụ & Giao 24h',
              desc: 'Xay miễn phí chuẩn kích thước cho V60, Espresso hoặc Phin ngay trước khi bàn giao.',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white rounded-2xl border border-stone-200/90 p-5 space-y-3 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/70 flex items-center justify-center">
                  {item.icon}
                </div>
                <span className="text-xl font-black text-stone-200">{item.step}</span>
              </div>
              <h3 className="text-sm font-bold text-stone-900">{item.title}</h3>
              <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VIP Roastery Club Newsletter Banner (Task 2.2) */}
      <section className="rounded-3xl bg-stone-900 text-white p-8 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>RoastRush Specialty Club</span>
          </div>
          <h3 className="text-2xl font-black">
            Nhận thông báo sớm 30 phút trước mỗi đợt Flash Sale Geisha
          </h3>
          <p className="text-xs sm:text-sm text-stone-300">
            Đăng ký email để nhận mã giảm giá <strong>NEWMEMBER (-30.000₫)</strong> và lịch mở bán các mẻ rang giới hạn
            hằng tuần.
          </p>
        </div>

        {subscribed ? (
          <div className="px-5 py-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            <span>Đã đăng ký nhận thông báo sớm thành công!</span>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newsletterEmail.trim()) return;
              setSubscribed(true);
              setNewsletterEmail('');
            }}
            className="flex flex-col sm:flex-row gap-2.5 w-full lg:w-auto shrink-0"
          >
            <div className="relative min-w-[260px]">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Nhập email của bạn..."
                className="w-full h-11 pl-10 pr-4 rounded-full bg-white/10 border border-white/20 text-xs text-white placeholder:text-stone-400 focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              type="submit"
              className="h-11 px-6 rounded-full bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold transition whitespace-nowrap"
            >
              Đăng ký ngay
            </button>
          </form>
        )}
      </section>
    </div>
  );
};
