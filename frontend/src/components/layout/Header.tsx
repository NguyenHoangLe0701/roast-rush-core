import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Award,
  ChevronDown,
  Clock,
  Coffee,
  Flame,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Package,
  Phone,
  Search,
  ShoppingBag,
  Truck,
  User,
  UserCheck,
  X,
} from 'lucide-react';
import { useRoastRush } from '../../context/RoastRushContext';
import { formatVnd } from '../../data/mockData';

export const Header: React.FC = () => {
  const {
    activePage,
    setActivePage,
    searchQuery,
    setSearchQuery,
    products,
    openProductDetail,
    wishlistIds,
    toggleWishlist,
    totalCartQuantity,
    setIsMiniCartOpen,
    currentUser,
    logoutUser,
  } = useRoastRush();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const wishlistRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (wishlistRef.current && !wishlistRef.current.contains(event.target as Node)) {
        setWishlistOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return products
      .filter(
        (p) =>
          p.active !== false &&
          (p.name.toLowerCase().includes(q) ||
            p.coffeeMetadata.originCountry.toLowerCase().includes(q) ||
            p.coffeeMetadata.tastingNotes.some((n) => n.toLowerCase().includes(q)))
      )
      .slice(0, 4);
  }, [products, searchQuery]);

  const wishlistedProducts = useMemo(
    () => products.filter((p) => wishlistIds.includes(p.id)),
    [products, wishlistIds]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSearchFocused(true);
  };

  return (
    <header className="roastrush-storefront-header sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200">
      {/* Top Announcement & Utility Bar (Clean Storefront Style) */}
      <div className="bg-stone-50 border-b border-stone-200/80 text-[11px] font-medium text-stone-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between gap-4">
          {/* Left: Roastery Value Promises with Coffee & Truck Icons */}
          <div className="flex items-center gap-4 min-w-0">
            <span className="inline-flex items-center gap-1.5 text-stone-700 font-semibold truncate">
              <Coffee className="w-3.5 h-3.5 text-amber-800 shrink-0" />
              <span>Rang mộc mới mỗi tuần (SCA 85+)</span>
            </span>

            <span className="hidden md:inline-block w-1 h-1 rounded-full bg-stone-300 shrink-0" />

            <span className="hidden md:inline-flex items-center gap-1.5 text-stone-600 truncate">
              <Truck className="w-3.5 h-3.5 text-amber-800 shrink-0" />
              <span>
                Miễn phí vận chuyển toàn quốc cho đơn từ <strong className="text-stone-900">500.000₫</strong>
              </span>
            </span>
          </div>

          {/* Right: Showroom, Opening Hours & Hotline */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden lg:inline-flex items-center gap-1 text-stone-500">
              <MapPin className="w-3.5 h-3.5 text-amber-800" />
              <span>Showroom: 68 Nguyễn Huệ, Q.1, TP.HCM</span>
            </span>

            <span className="hidden lg:inline-block h-3 w-px bg-stone-300" />

            <span className="hidden sm:inline-flex items-center gap-1 text-stone-500">
              <Clock className="w-3.5 h-3.5 text-amber-800" />
              <span>08:00 – 21:00</span>
            </span>

            <span className="hidden sm:inline-block h-3 w-px bg-stone-300" />

            <span className="inline-flex items-center gap-1 text-stone-700 font-semibold">
              <Phone className="w-3.5 h-3.5 text-amber-800" />
              <span>Hotline: 1900 6868</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Storefront Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4">
        {/* 1. LEFT: Brand Logo & Mobile Hamburger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-stone-100 text-stone-700 hover:bg-stone-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => setActivePage('HOME')}
            className="flex items-center gap-3 cursor-pointer shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-800 flex items-center justify-center text-white shadow-sm shrink-0">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-stone-900 block leading-none">
                ROASTRUSH
              </span>
              <span className="text-[11px] text-amber-800 font-semibold tracking-wider uppercase">
                Specialty Roastery
              </span>
            </div>
          </div>
        </div>

        {/* 2. CENTER: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setActivePage('HOME')}
            className={`whitespace-nowrap transition ${
              activePage === 'HOME' ? 'text-amber-800 font-bold' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Trang chủ
          </button>

          <button
            type="button"
            onClick={() => setActivePage('FLASH_SALE')}
            className={`flex items-center gap-1.5 whitespace-nowrap transition ${
              activePage === 'FLASH_SALE'
                ? 'text-red-600 font-bold'
                : 'text-stone-600 hover:text-red-600'
            }`}
          >
            <Flame className="w-4 h-4 text-red-600 fill-red-600 shrink-0" />
            <span>Flash Sale</span>
          </button>

          <button
            type="button"
            onClick={() => setActivePage('CATALOG')}
            className={`whitespace-nowrap transition ${
              activePage === 'CATALOG' || activePage === 'PRODUCT_DETAIL'
                ? 'text-amber-800 font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Cà phê Đặc sản
          </button>

          <button
            type="button"
            onClick={() => setActivePage('ORDERS')}
            className={`whitespace-nowrap transition ${
              activePage === 'ORDERS'
                ? 'text-amber-800 font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Tra cứu đơn hàng
          </button>
        </nav>

        {/* 3. RIGHT: Live Search Autocomplete + Wishlist + Account + Cart */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Live Search Input with Instant Autocomplete Dropdown (Task 2.3) */}
          <div ref={searchRef} className="relative hidden xl:block w-56">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onChange={handleSearchChange}
              placeholder="Tìm hạt Geisha, Ethiopia..."
              className="w-full h-10 pl-9 pr-8 rounded-full bg-stone-100 border border-transparent focus:bg-white focus:border-amber-800 focus:ring-2 focus:ring-amber-800/10 text-xs text-stone-800 focus:outline-none transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Autocomplete Popover */}
            {searchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute right-0 top-12 w-80 rounded-2xl bg-white border border-stone-200 shadow-2xl p-2 z-50 space-y-1">
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center justify-between">
                  <span>Kết quả gợi ý ({searchSuggestions.length})</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchFocused(false);
                      setActivePage('CATALOG');
                    }}
                    className="text-amber-800 hover:underline"
                  >
                    Xem tất cả →
                  </button>
                </div>

                {searchSuggestions.length === 0 ? (
                  <div className="py-6 text-center text-xs text-stone-400">
                    Không tìm thấy dòng hạt nào khớp với "{searchQuery}".
                  </div>
                ) : (
                  searchSuggestions.map((prod) => (
                    <button
                      type="button"
                      key={prod.id}
                      onClick={() => {
                        setSearchFocused(false);
                        openProductDetail(prod);
                      }}
                      className="w-full p-2 rounded-xl hover:bg-stone-50 flex items-center gap-3 text-left transition"
                    >
                      <img
                        src={prod.thumbnailUrl}
                        alt={prod.name}
                        className="w-11 h-11 rounded-lg object-cover bg-stone-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-stone-900 truncate">{prod.name}</div>
                        <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mt-0.5">
                          <span className="text-amber-800 font-semibold">
                            {prod.coffeeMetadata.originCountry}
                          </span>
                          <span>•</span>
                          <span className="inline-flex items-center gap-0.5 text-amber-700 font-bold">
                            <Award className="w-3 h-3" />
                            SCA {prod.coffeeMetadata.cuppingScore}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs font-black text-stone-900 shrink-0">
                        {formatVnd(prod.skus[0].basePriceVnd)}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Wishlist Popover Trigger (Task 2.1) */}
          <div ref={wishlistRef} className="relative">
            <button
              type="button"
              onClick={() => setWishlistOpen(!wishlistOpen)}
              className="relative w-10 h-10 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition"
              title="Danh sách hạt Yêu thích"
            >
              <Heart
                className={`w-4 h-4 ${
                  wishlistIds.length > 0 ? 'text-rose-600 fill-rose-600' : 'text-stone-600'
                }`}
              />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {wishlistOpen && (
              <div className="absolute right-0 top-12 w-80 rounded-2xl bg-white border border-stone-200 shadow-2xl p-3 z-50 space-y-2 text-xs">
                <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                  <span className="font-bold text-stone-900">
                    Mẻ Rang Yêu Thích ({wishlistedProducts.length})
                  </span>
                </div>

                {wishlistedProducts.length === 0 ? (
                  <div className="py-6 text-center text-stone-400">
                    Chưa có dòng hạt nào trong danh sách yêu thích.
                  </div>
                ) : (
                  <div className="space-y-1.5 max-h-64 overflow-y-auto">
                    {wishlistedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="p-2 rounded-xl hover:bg-stone-50 flex items-center justify-between gap-2.5"
                      >
                        <div
                          onClick={() => {
                            setWishlistOpen(false);
                            openProductDetail(p);
                          }}
                          className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
                        >
                          <img
                            src={p.thumbnailUrl}
                            alt={p.name}
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-stone-900 truncate">{p.name}</div>
                            <div className="text-amber-800 font-semibold">
                              {formatVnd(p.skus[0].basePriceVnd)}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(p.id)}
                          className="p-1.5 text-stone-400 hover:text-rose-600"
                          title="Bỏ yêu thích"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Auth User Menu */}
          {currentUser ? (
            <div ref={dropdownRef} className="relative border-r border-stone-200 pr-2.5">
              <button
                type="button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="h-10 flex items-center gap-2 px-3.5 rounded-full bg-stone-100 hover:bg-stone-200 text-xs font-bold text-stone-800 transition whitespace-nowrap"
              >
                <UserCheck className="w-4 h-4 text-amber-800 shrink-0" />
                <span>{currentUser.fullName}</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-2.5 top-12 w-56 rounded-2xl bg-white border border-stone-200 shadow-xl py-2 z-50 text-xs">
                  <div className="px-4 py-2.5 border-b border-stone-100">
                    <div className="font-bold text-stone-900">{currentUser.fullName}</div>
                    <div className="text-stone-500 truncate">{currentUser.email}</div>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-bold text-[10px]">
                      Hạng: {currentUser.memberTier}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      setActivePage('PROFILE');
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-stone-50 flex items-center gap-2.5 text-stone-700 font-medium"
                  >
                    <User className="w-4 h-4 text-amber-800 shrink-0" />
                    <span>Hồ sơ cá nhân & Sổ địa chỉ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      setActivePage('ORDERS');
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-stone-50 flex items-center gap-2.5 text-stone-700 font-medium"
                  >
                    <Package className="w-4 h-4 text-amber-800 shrink-0" />
                    <span>Lịch sử đơn hàng của tôi</span>
                  </button>

                  {currentUser.role === 'ADMIN' && (
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setActivePage('ADMIN_DASHBOARD');
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-stone-50 flex items-center gap-2.5 text-amber-800 font-bold"
                    >
                      <LayoutDashboard className="w-4 h-4 shrink-0" />
                      <span>Vào trang Quản trị (Admin)</span>
                    </button>
                  )}

                  <div className="border-t border-stone-100 mt-1 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false);
                        logoutUser();
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-rose-50 flex items-center gap-2.5 text-rose-600 font-bold"
                    >
                      <LogOut className="w-4 h-4 shrink-0" />
                      <span>Đăng xuất tài khoản</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 border-r border-stone-200 pr-2.5">
              <button
                type="button"
                onClick={() => setActivePage('LOGIN')}
                className="h-10 px-3.5 rounded-full text-xs font-semibold text-stone-700 hover:text-stone-900 hover:bg-stone-100 transition whitespace-nowrap"
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => setActivePage('REGISTER')}
                className="hidden sm:inline-flex h-10 items-center px-4 rounded-full text-xs font-semibold bg-stone-900 hover:bg-amber-800 text-white transition whitespace-nowrap"
              >
                Đăng ký
              </button>
            </div>
          )}

          {/* Shopping Cart Button */}
          <button
            type="button"
            onClick={() => setIsMiniCartOpen(true)}
            className="relative h-10 flex items-center gap-2 px-4 rounded-full bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition shadow-sm shrink-0 whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Giỏ hàng</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white text-amber-900 text-xs font-extrabold">
              {totalCartQuantity}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-stone-200 px-4 py-4 space-y-3">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Tìm hạt Geisha, Ethiopia..."
            className="w-full px-4 py-2.5 rounded-xl bg-stone-100 text-xs text-stone-800 focus:outline-none"
          />
          <div className="flex flex-col space-y-1 text-sm font-semibold">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setActivePage('HOME');
              }}
              className="py-2 text-left text-stone-800"
            >
              Trang chủ
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setActivePage('FLASH_SALE');
              }}
              className="py-2 text-left text-red-600 font-bold"
            >
              🔥 Săn Flash Sale
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setActivePage('CATALOG');
              }}
              className="py-2 text-left text-stone-800"
            >
              Cà phê Đặc sản
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setActivePage('ORDERS');
              }}
              className="py-2 text-left text-stone-800"
            >
              Tra cứu đơn hàng
            </button>
            {currentUser && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setActivePage('PROFILE');
                  }}
                  className="py-2 text-left text-amber-800"
                >
                  Hồ sơ cá nhân ({currentUser.fullName})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logoutUser();
                  }}
                  className="py-2 text-left text-rose-600 font-bold"
                >
                  Đăng xuất
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
