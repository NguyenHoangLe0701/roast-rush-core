import React, { useState } from 'react';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Coffee,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { useRoastRush } from '../../context/RoastRushContext';

export const LoginPage: React.FC = () => {
  const { loginUser, setActivePage } = useRoastRush();
  const [email, setEmail] = useState('minhquan@roastrush.vn');
  const [password, setPassword] = useState('12345678');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    loginUser(email.trim(), password);
  };

  const handleQuickAdminLogin = () => {
    loginUser('admin@roastrush.vn', 'admin123456', true);
  };

  return (
    <div className="min-h-screen bg-stone-50 grid grid-cols-1 lg:grid-cols-12 font-sans">
      {/* Left Column: Brand Storytelling & Specialty Coffee Visual */}
      <div className="hidden lg:flex lg:col-span-6 relative bg-stone-900 text-white p-12 flex-col justify-between overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1400&q=85"
          alt="RoastRush Specialty Roastery"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-transparent" />

        {/* Top Brand Header */}
        <div className="relative z-10 flex items-center justify-between">
          <div
            onClick={() => setActivePage('HOME')}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-700 flex items-center justify-center text-white shadow-lg">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white block leading-none">
                ROASTRUSH
              </span>
              <span className="text-[11px] text-amber-300 font-semibold tracking-wider uppercase">
                Specialty Roastery
              </span>
            </div>
          </div>

          <button
            onClick={() => setActivePage('HOME')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur text-xs font-semibold text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay về Cửa hàng
          </button>
        </div>

        {/* Middle Quote & Highlights */}
        <div className="relative z-10 max-w-lg space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
            <Award className="w-4 h-4" />
            Hạt Đặc Sản Tuyển Chọn SCA 85+
          </div>

          <h2 className="text-3xl xl:text-4xl font-black leading-tight">
            Trải nghiệm những mẻ rang Micro-lot giới hạn từ khắp thế giới.
          </h2>

          <p className="text-sm text-stone-300 leading-relaxed">
            Đăng nhập tài khoản thành viên RoastRush để nhận quyền ưu tiên săn Flash Sale hạt Panama Geisha, Ethiopia
            Anaerobic và lưu trữ hồ sơ cỡ xay yêu thích của bạn.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-sm text-stone-200">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Giữ suất ưu đãi độc quyền 15 phút khi săn Flash Sale</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-stone-200">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Tích điểm nâng hạng thành viên Roaster VIP</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-stone-200">
              <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Theo dõi lịch sử ngày rang (Roast Date) và vận đơn chi tiết</span>
            </div>
          </div>
        </div>

        {/* Bottom Footer Info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-stone-400 border-t border-white/10 pt-6">
          <span>© 2026 RoastRush Specialty Coffee Vietnam</span>
          <span>Panama • Ethiopia • Colombia • Cầu Đất</span>
        </div>
      </div>

      {/* Right Column: Clean Login Form */}
      <div className="lg:col-span-6 flex flex-col justify-center px-6 py-12 sm:px-12 xl:px-24 bg-white">
        <div className="w-full max-w-md mx-auto space-y-8">
          {/* Mobile Back Button */}
          <div className="lg:hidden flex items-center justify-between">
            <button
              onClick={() => setActivePage('HOME')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay về Cửa hàng
            </button>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              Chào mừng trở lại
            </h1>
            <p className="text-sm text-stone-500">
              Nhập thông tin tài khoản của bạn để tiếp tục mua sắm hoặc truy cập trang Quản trị.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Địa chỉ Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-800/15 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Mật khẩu
                </label>
                <button
                  type="button"
                  onClick={() => alert('Hướng dẫn đặt lại mật khẩu đã được gửi về email của bạn.')}
                  className="text-xs font-semibold text-amber-800 hover:underline"
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-800/15 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-stone-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-stone-300 text-amber-800 focus:ring-amber-800"
                />
                <span>Duy trì đăng nhập trên thiết bị này</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm transition shadow-sm"
            >
              Đăng nhập vào Cửa hàng
            </button>
          </form>

          {/* Quick Role Switcher for Demo / Admin Access */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-800" />
                Dành cho Quản trị viên (Admin Portal)
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                1-Click Access
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Truy cập trực tiếp vào bảng điều khiển **RoastRush Admin Dashboard** để quản lý sản phẩm, chiến dịch Flash
              Sale và duyệt đơn hàng.
            </p>
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition"
            >
              Đăng nhập nhanh với quyền Quản trị viên (Admin Dashboard) →
            </button>
          </div>

          <div className="text-center text-sm text-stone-600 pt-4 border-t border-stone-100">
            Bạn chưa có tài khoản?{' '}
            <button
              onClick={() => setActivePage('REGISTER')}
              className="font-bold text-amber-800 hover:underline"
            >
              Đăng ký tài khoản mới
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

