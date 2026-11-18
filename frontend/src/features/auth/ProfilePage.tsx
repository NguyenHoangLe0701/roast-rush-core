import React, { useState } from 'react';
import { Award, LogOut, Mail, MapPin, Package, Phone, Save, User } from 'lucide-react';
import { useRoastRush } from '../../context/RoastRushContext';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateUserProfile, logoutUser, setActivePage, orderHistory } = useRoastRush();

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [defaultAddress, setDefaultAddress] = useState(currentUser?.defaultAddress || '');

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-4">
        <p className="text-sm text-stone-600">Vui lòng đăng nhập để quản lý hồ sơ cá nhân của bạn.</p>
        <button
          onClick={() => setActivePage('LOGIN')}
          className="px-6 py-2.5 rounded-full bg-amber-800 text-white text-xs font-bold"
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      fullName: fullName.trim() || currentUser.fullName,
      phone: phone.trim() || currentUser.phone,
      defaultAddress: defaultAddress.trim() || currentUser.defaultAddress,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900">Hồ Sơ Tài Khoản Của Tôi</h1>
          <p className="text-sm text-stone-500 mt-1">
            Quản lý thông tin liên hệ, sổ địa chỉ nhận hàng mặc định và hạng thành viên
          </p>
        </div>

        <button
          onClick={logoutUser}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất tài khoản</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left: Member Card */}
        <div className="md:col-span-4 space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-stone-900 via-amber-950 to-stone-900 text-white p-6 space-y-4 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                RoastRush Club
              </span>
              <Award className="w-5 h-5 text-amber-400" />
            </div>

            <div>
              <div className="text-lg font-black">{currentUser.fullName}</div>
              <div className="text-xs text-stone-300">{currentUser.email}</div>
            </div>

            <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs">
              <span className="text-stone-300">Hạng thành viên:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-stone-950 font-extrabold">
                {currentUser.memberTier}
              </span>
            </div>
          </div>

          <button
            onClick={() => setActivePage('ORDERS')}
            className="w-full p-4 rounded-2xl bg-white border border-stone-200 hover:border-amber-800 flex items-center justify-between text-xs font-bold text-stone-800 transition shadow-sm"
          >
            <span className="flex items-center gap-2">
              <Package className="w-4 h-4 text-amber-800" />
              Đơn hàng đã đặt ({orderHistory.length})
            </span>
            <span className="text-amber-800">Xem chi tiết →</span>
          </button>
        </div>

        {/* Right: Edit Form */}
        <div className="md:col-span-8 bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
          <form onSubmit={handleSave} className="space-y-4">
            <h3 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
              Thông tin cá nhân & Địa chỉ giao hàng mặc định
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">Họ và tên</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-amber-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">Email đăng nhập</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-stone-100 text-sm text-stone-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-stone-700">Số điện thoại nhận hàng</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-amber-800"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-stone-700">Địa chỉ giao hàng mặc định</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={defaultAddress}
                  onChange={(e) => setDefaultAddress(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 focus:outline-none focus:border-amber-800"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Lưu thay đổi</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

