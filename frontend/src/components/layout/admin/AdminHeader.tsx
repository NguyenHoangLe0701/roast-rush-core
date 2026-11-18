import React, { useEffect, useRef, useState } from 'react';
import {
  Bell,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  LogOut,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Store,
  User,
  X,
} from 'lucide-react';
import { useRoastRush } from '../../../context/RoastRushContext';
import { AdminTab } from './AdminSidebar';

interface AdminHeaderProps {
  activeTab: AdminTab;
  setActiveTab?: (tab: AdminTab) => void;
  searchKeyword: string;
  setSearchKeyword: (val: string) => void;
  isBackendConnected?: boolean;
  isSyncing?: boolean;
  onSyncData?: () => void;
}

const TAB_LABELS: Record<AdminTab, { group: string; title: string }> = {
  OVERVIEW: { group: 'Tổng quan', title: 'Bảng điều khiển' },
  ORDERS: { group: 'Tổng quan', title: 'Quản lý đơn hàng' },
  PRODUCTS: { group: 'Kinh doanh', title: 'Sản phẩm & Kho hạt' },
  FLASH_SALE: { group: 'Kinh doanh', title: 'Flash Sale & Redis Hold' },
  VOUCHERS: { group: 'Kinh doanh', title: 'Mã giảm giá (Vouchers)' },
  PAYMENTS: { group: 'Tài chính', title: 'Đối soát Thanh toán & Webhook' },
  CUSTOMERS: { group: 'Tài chính', title: 'Khách hàng thành viên' },
  SETTINGS: { group: 'Hệ thống', title: 'Cài đặt hệ thống' },
};

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  setActiveTab,
  searchKeyword,
  setSearchKeyword,
  isBackendConnected = false,
  isSyncing = false,
  onSyncData,
}) => {
  const { currentUser, setActivePage, logoutUser } = useRoastRush();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentMeta = TAB_LABELS[activeTab];
  const displayName = currentUser?.fullName || 'Quản Trị Viên';
  const displayEmail = currentUser?.email || 'admin@roastrush.vn';

  return (
    <div
      role="banner"
      aria-label="Admin Topbar"
      className="roastrush-admin-topbar h-16 w-full bg-white border-b border-stone-200 px-6 flex items-center justify-between gap-4 sticky top-0 z-30 shrink-0"
    >
      {/* 1. LEFT: Clean Breadcrumb Navigation */}
      <div className="flex items-center gap-2 min-w-0 shrink-0">
        <span className="text-xs font-medium text-stone-400 hidden sm:inline">
          {currentMeta.group}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-stone-300 hidden sm:inline shrink-0" />
        <span className="text-sm sm:text-base font-bold text-stone-900 tracking-tight truncate">
          {currentMeta.title}
        </span>
      </div>

      {/* 2. RIGHT: Search Box + API Status + Sync Button + Storefront + Profile */}
      <div className="flex items-center gap-2.5 ml-auto">
        {/* Search Input */}
        <div className="relative w-48 lg:w-64 hidden md:block">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Tìm mã đơn, tên hạt, TxnRef..."
            className="w-full h-9 pl-9 pr-8 rounded-lg bg-stone-100/80 border border-stone-200 hover:border-stone-300 focus:bg-white focus:border-amber-800 text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none transition"
          />
          {searchKeyword && (
            <button
              type="button"
              onClick={() => setSearchKeyword('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              title="Xóa tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Backend API Connection Badge */}
        <div
          className={`hidden xl:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border text-[11px] font-bold shrink-0 ${
            isBackendConnected
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-amber-50/70 border-amber-200 text-amber-900'
          }`}
          title="Trạng thái kết nối Spring Boot REST API"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isBackendConnected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
            }`}
          />
          <span>{isBackendConnected ? 'API Connected' : 'API Ready (Simulation)'}</span>
        </div>

        {/* Sync API Button */}
        {onSyncData && (
          <button
            type="button"
            onClick={onSyncData}
            disabled={isSyncing}
            className="h-9 px-3 rounded-lg bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 hover:border-stone-300 text-xs font-semibold inline-flex items-center gap-1.5 transition shadow-sm shrink-0 disabled:opacity-60"
            title="Đồng bộ lại dữ liệu từ Backend API"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-amber-800 ${isSyncing ? 'animate-spin' : ''}`} />
            <span className="hidden lg:inline">{isSyncing ? 'Đang đồng bộ...' : 'Đồng bộ'}</span>
          </button>
        )}

        {/* View Live Storefront Button */}
        <button
          type="button"
          onClick={() => setActivePage('HOME')}
          className="h-9 px-3 rounded-lg bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 hover:border-stone-300 text-xs font-semibold inline-flex items-center gap-1.5 transition shadow-sm shrink-0"
          title="Mở trang cửa hàng bán lẻ"
        >
          <Store className="w-3.5 h-3.5 text-amber-800 shrink-0" />
          <span className="hidden sm:inline">Cửa hàng</span>
          <ExternalLink className="w-3 h-3 text-stone-400 hidden xl:inline shrink-0" />
        </button>

        {/* Notification Bell */}
        <button
          type="button"
          className="relative w-9 h-9 rounded-lg bg-white hover:bg-stone-50 text-stone-600 border border-stone-200 inline-flex items-center justify-center transition shadow-sm shrink-0"
          title="Thông báo hệ thống"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-red-500 ring-2 ring-white absolute top-1.5 right-1.5" />
        </button>

        <div className="h-5 w-px bg-stone-200 hidden sm:block shrink-0" />

        {/* Unified Admin Profile Trigger & Dropdown */}
        <div ref={profileRef} className="relative shrink-0">
          <button
            type="button"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="h-10 flex items-center gap-2.5 pl-1.5 pr-2.5 rounded-xl hover:bg-stone-100 border border-transparent hover:border-stone-200 transition"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-800 text-white font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
              AD
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-stone-900 leading-tight flex items-center gap-1 whitespace-nowrap">
                <span>{displayName}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-amber-800 shrink-0" />
              </div>
              <div className="text-[10px] text-stone-500 leading-tight">Quản trị hệ thống</div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 hidden sm:block shrink-0" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileMenuOpen && (
            <div className="absolute right-0 top-12 w-60 rounded-xl bg-white border border-stone-200 shadow-xl py-1.5 z-50 text-xs">
              <div className="px-4 py-2.5 border-b border-stone-100">
                <div className="font-bold text-stone-900">{displayName}</div>
                <div className="text-stone-500 truncate mt-0.5">{displayEmail}</div>
              </div>

              <div className="py-1">
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    setActivePage('PROFILE');
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-stone-50 flex items-center gap-2.5 text-stone-700 font-medium"
                >
                  <User className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>Hồ sơ tài khoản</span>
                </button>

                {setActiveTab && (
                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setActiveTab('SETTINGS');
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-stone-50 flex items-center gap-2.5 text-stone-700 font-medium"
                  >
                    <Settings className="w-4 h-4 text-stone-400 shrink-0" />
                    <span>Cài đặt hệ thống</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    setActivePage('HOME');
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-stone-50 flex items-center gap-2.5 text-stone-700 font-medium"
                >
                  <Store className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>Về trang Cửa hàng</span>
                </button>
              </div>

              <div className="border-t border-stone-100 pt-1 mt-1">
                <button
                  type="button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    logoutUser();
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-rose-50 flex items-center gap-2.5 text-rose-600 font-bold transition"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
