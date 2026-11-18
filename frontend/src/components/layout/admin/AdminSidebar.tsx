import React from 'react';
import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  Coffee,
  CreditCard,
  Flame,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingBag,
  Store,
  Tag,
  Users,
} from 'lucide-react';
import { useRoastRush } from '../../../context/RoastRushContext';

export type AdminTab =
  | 'OVERVIEW'
  | 'ORDERS'
  | 'PRODUCTS'
  | 'FLASH_SALE'
  | 'PAYMENTS'
  | 'VOUCHERS'
  | 'CUSTOMERS'
  | 'SETTINGS';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
}) => {
  const { setActivePage, logoutUser, orderHistory, campaign, vouchers, paymentTransactions } =
    useRoastRush();

  const totalFlashSaleRemaining = campaign.items.reduce((sum, item) => sum + item.remainingStock, 0);

  const navSections: Array<{
    title: string;
    items: Array<{
      id: AdminTab;
      label: string;
      icon: React.ReactNode;
      badge?: number;
      badgeTone?: 'amber' | 'red' | 'emerald';
    }>;
  }> = [
    {
      title: 'Tổng quan',
      items: [
        {
          id: 'OVERVIEW',
          label: 'Bảng điều khiển',
          icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
        },
        {
          id: 'ORDERS',
          label: 'Quản lý đơn hàng',
          icon: <ShoppingBag className="w-4 h-4 shrink-0" />,
          badge: orderHistory.length,
          badgeTone: 'amber',
        },
      ],
    },
    {
      title: 'Kinh doanh & Kho',
      items: [
        {
          id: 'PRODUCTS',
          label: 'Sản phẩm & Kho hạt',
          icon: <Boxes className="w-4 h-4 shrink-0" />,
        },
        {
          id: 'FLASH_SALE',
          label: 'Flash Sale & Redis',
          icon: <Flame className="w-4 h-4 shrink-0" />,
          badge: totalFlashSaleRemaining,
          badgeTone: 'red',
        },
        {
          id: 'VOUCHERS',
          label: 'Mã giảm giá',
          icon: <Tag className="w-4 h-4 shrink-0" />,
          badge: vouchers.length,
          badgeTone: 'amber',
        },
      ],
    },
    {
      title: 'Tài chính & Hệ thống',
      items: [
        {
          id: 'PAYMENTS',
          label: 'Đối soát Thanh toán',
          icon: <CreditCard className="w-4 h-4 shrink-0" />,
          badge: paymentTransactions.length,
          badgeTone: 'emerald',
        },
        {
          id: 'CUSTOMERS',
          label: 'Khách hàng',
          icon: <Users className="w-4 h-4 shrink-0" />,
        },
        {
          id: 'SETTINGS',
          label: 'Cài đặt hệ thống',
          icon: <Settings className="w-4 h-4 shrink-0" />,
        },
      ],
    },
  ];

  return (
    <div
      role="navigation"
      aria-label="Admin Sidebar"
      className={`roastrush-admin-sidebar ${
        collapsed ? 'w-[72px]' : 'w-64'
      } bg-white border-r border-stone-200 flex flex-col justify-between shrink-0 transition-all duration-200 select-none sticky top-0 h-screen z-40`}
    >
      {/* Top Brand Header */}
      <div className="overflow-y-auto">
        <div className="h-16 px-4 flex items-center justify-between border-b border-stone-200">
          <div
            onClick={() => setActiveTab('OVERVIEW')}
            className="flex items-center gap-2.5 cursor-pointer overflow-hidden"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-800 flex items-center justify-center text-white shrink-0 shadow-sm">
              <Coffee className="w-4 h-4" />
            </div>
            {!collapsed && (
              <div className="leading-none truncate flex items-center">
                <span className="text-sm font-black tracking-tight text-stone-900">ROASTRUSH</span>
                <span className="ml-1.5 px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 text-[10px] font-bold uppercase">
                  Admin
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition shrink-0"
            title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="p-3 space-y-5">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              {!collapsed && (
                <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  {section.title}
                </div>
              )}

              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      title={collapsed ? item.label : undefined}
                      className={`w-full flex items-center ${
                        collapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
                      } rounded-lg text-xs transition relative ${
                        isActive
                          ? 'bg-amber-50 text-amber-900 font-bold'
                          : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900 font-medium'
                      }`}
                    >
                      {isActive && (
                        <span className="w-1 h-5 bg-amber-800 rounded-r-full absolute left-0 top-1/2 -translate-y-1/2" />
                      )}

                      <div className="flex items-center gap-2.5 truncate">
                        <span className={isActive ? 'text-amber-800' : 'text-stone-400'}>
                          {item.icon}
                        </span>
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!collapsed && item.badge !== undefined && (
                        <span
                          className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                            item.badgeTone === 'red'
                              ? 'bg-red-50 text-red-600'
                              : item.badgeTone === 'emerald'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Actions: Storefront & Logout */}
      <div className="p-3 border-t border-stone-200 space-y-1 bg-stone-50/50">
        <button
          type="button"
          onClick={() => setActivePage('HOME')}
          title="Quay về Cửa hàng"
          className={`w-full flex items-center ${
            collapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2'
          } rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-200/70 transition`}
        >
          <Store className="w-4 h-4 text-amber-800 shrink-0" />
          {!collapsed && <span>Về trang Cửa hàng</span>}
        </button>

        <button
          type="button"
          onClick={logoutUser}
          title="Đăng xuất"
          className={`w-full flex items-center ${
            collapsed ? 'justify-center p-2.5' : 'gap-2.5 px-3 py-2'
          } rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Đăng xuất</span>}
        </button>
      </div>
    </div>
  );
};
