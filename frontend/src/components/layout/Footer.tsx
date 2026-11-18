import React from 'react';
import { Coffee, Mail, MapPin, Phone } from 'lucide-react';
import { useRoastRush } from '../../context/RoastRushContext';

export const Footer: React.FC = () => {
  const { setActivePage } = useRoastRush();

  return (
    <footer className="bg-stone-50 border-t border-stone-200 text-stone-600 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Col 1: Brand Info */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-800 flex items-center justify-center text-white">
              <Coffee className="w-5 h-5" />
            </div>
            <span className="text-lg font-black tracking-tight text-stone-900">ROASTRUSH</span>
          </div>
          <p className="text-sm text-stone-500 leading-relaxed">
            Nhà rang xay và phân phối Cà phê Đặc sản (Specialty Coffee SCA 85+) tuyển chọn từ những nông trại danh tiếng
            nhất thế giới: Panama Boquete, Ethiopia Sidama, Colombia Cauca và Cầu Đất Đà Lạt.
          </p>
          <div className="space-y-1.5 text-xs text-stone-500 pt-1">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-800 shrink-0" />
              <span>68 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-800 shrink-0" />
              <span>1900 6868 (8:00 - 21:00 mỗi ngày)</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-800 shrink-0" />
              <span>roastery@roastrush.vn</span>
            </div>
          </div>
        </div>

        {/* Col 2: Danh mục */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Sản phẩm & Ưu đãi</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <button onClick={() => setActivePage('FLASH_SALE')} className="hover:text-amber-800 transition">
                Săn Flash Sale Micro-lot
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('CATALOG')} className="hover:text-amber-800 transition">
                Cà phê Pour Over / Filter
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('CATALOG')} className="hover:text-amber-800 transition">
                Cà phê Espresso Đặc sản
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('CATALOG')} className="hover:text-amber-800 transition">
                Arabica Cầu Đất Thượng hạng
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Hỗ trợ khách hàng */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Khách hàng</h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <button onClick={() => setActivePage('LOGIN')} className="hover:text-amber-800 transition">
                Đăng nhập tài khoản
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('REGISTER')} className="hover:text-amber-800 transition">
                Đăng ký thành viên
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('ORDERS')} className="hover:text-amber-800 transition">
                Lịch sử đơn hàng
              </button>
            </li>
            <li>
              <button onClick={() => setActivePage('CHECKOUT')} className="hover:text-amber-800 transition">
                Giỏ hàng & Thanh toán
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Phương thức thanh toán */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">Chứng nhận & Thanh toán</h4>
          <p className="text-xs text-stone-500 leading-relaxed">
            100% hạt cà phê đạt chuẩn Specialty Coffee Association (SCA 85+). Hỗ trợ thanh toán an toàn qua cổng VNPay
            QR và Ví MoMo.
          </p>
          <div className="flex items-center gap-2 pt-2">
            <span className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-bold text-blue-700">
              VNPay QR
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-bold text-pink-600">
              Ví MoMo
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-bold text-amber-800">
              SCA 85+
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-stone-200 py-5 px-4 sm:px-6 text-xs text-stone-500 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 RoastRush Specialty Coffee Vietnam. All rights reserved.</span>
          <span>Cam kết rang mộc 100% • Đổi trả miễn phí trong 7 ngày</span>
        </div>
      </div>
    </footer>
  );
};
