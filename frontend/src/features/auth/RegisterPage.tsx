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
  Phone,
  User,
} from 'lucide-react';
import { useRoastRush } from '../../context/RoastRushContext';

export const RegisterPage: React.FC = () => {
  const { registerUser, setActivePage } = useRoastRush();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password.length < 6) {
      setErrorMsg('Mật khẩu cần tối thiểu 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('Vui lòng đồng ý với điều khoản thành viên của RoastRush.');
      return;
    }

    registerUser(fullName.trim(), email.trim(), phone.trim(), password);
  };

  return (
    <div className="min-h-screen bg-stone-50 grid grid-cols-1 lg:grid-cols-12 font-sans">
      {/* Left Column: Membership Benefits Visual */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-stone-900 text-white p-12 flex-col justify-between overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1400&q=85"
          alt="Specialty Coffee Beans"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/70 to-transparent" />

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
                Specialty Club
              </span>
            </div>
          </div>

          <button
            onClick={() => setActivePage('HOME')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur text-xs font-semibold text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Trang chủ
          </button>
        </div>

        <div className="relative z-10 space-y-6 my-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold">
            <Award className="w-4 h-4" />
            Đặc Quyền Thành Viên Mới
          </div>

          <h2 className="text-3xl font-black leading-tight">
            Gia nhập cộng đồng yêu Cà phê Đặc sản nguyên bản.
          </h2>

          <div className="space-y-4 text-sm text-stone-200 pt-2">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">Miễn phí vận chuyển đơn đầu tiên</strong>
                <span className="text-xs text-stone-300">
                  Áp dụng cho mọi dòng hạt Specialty Coffee từ 250g trở lên.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">Thông báo sớm các đợt Flash Sale Geisha</strong>
                <span className="text-xs text-stone-300">
                  Nhận thông báo trước 30 phút khi mở bán các lô Micro-lot giới hạn.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-white">Tùy biến hồ sơ pha chế cá nhân</strong>
                <span className="text-xs text-stone-300">
                  Lưu cỡ xay chuẩn cho V60, Espresso hoặc Cold Brew cho những lần đặt sau.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-stone-400 border-t border-white/10 pt-6">
          Cam kết bảo mật thông tin khách hàng 100% theo tiêu chuẩn thương mại điện tử.
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="lg:col-span-7 flex flex-col justify-center px-6 py-12 sm:px-12 xl:px-24 bg-white">
        <div className="w-full max-w-lg mx-auto space-y-7">
          <div className="lg:hidden">
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
              Đăng ký tài khoản thành viên
            </h1>
            <p className="text-sm text-stone-500">
              Hoàn tất thông tin bên dưới để tạo tài khoản mua sắm tại RoastRush.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                Họ và tên đầy đủ
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Minh Quân"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-amber-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    placeholder="ban@email.com"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-amber-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Số điện thoại
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0908 123 456"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-amber-800"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full pl-11 pr-10 py-3 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-amber-800"
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

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-amber-800"
                  />
                </div>
              </div>
            </div>

            <label className="flex items-start gap-2.5 text-xs text-stone-600 pt-1 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded border-stone-300 text-amber-800 focus:ring-amber-800"
              />
              <span>
                Tôi đồng ý với <strong>Điều khoản dịch vụ</strong> và <strong>Chính sách bảo mật</strong> của RoastRush
                Specialty Coffee.
              </span>
            </label>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-sm transition shadow-sm"
            >
              Hoàn tất Đăng ký
            </button>
          </form>

          <div className="text-center text-sm text-stone-600 pt-4 border-t border-stone-100">
            Bạn đã có tài khoản thành viên?{' '}
            <button
              onClick={() => setActivePage('LOGIN')}
              className="font-bold text-amber-800 hover:underline"
            >
              Đăng nhập tại đây
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

