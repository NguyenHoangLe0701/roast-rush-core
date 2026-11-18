import React from 'react';
import { RoastRushProvider, useRoastRush } from './context/RoastRushContext';
import { MainLayout } from './components/layout/MainLayout';
import { HomeSection } from './features/home/HomeSection';
import { FlashSaleSection } from './features/flash-sale/FlashSaleSection';
import { CatalogSection } from './features/catalog/CatalogSection';
import { ProductDetailPage } from './features/catalog/ProductDetailPage';
import { CheckoutSection } from './features/checkout/CheckoutSection';
import { OrdersPage } from './features/orders/OrdersPage';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { ProfilePage } from './features/auth/ProfilePage';
import { AdminDashboardPage } from './features/admin/AdminDashboardPage';
import { ToastContainer } from './components/common/ToastContainer';

const AppRouter: React.FC = () => {
  const { activePage } = useRoastRush();

  // 1. Standalone Full-Screen Pages (Tách biệt hoàn toàn không dùng chung Header/Footer bán hàng)
  if (activePage === 'LOGIN') {
    return (
      <>
        <ToastContainer />
        <LoginPage />
      </>
    );
  }

  if (activePage === 'REGISTER') {
    return (
      <>
        <ToastContainer />
        <RegisterPage />
      </>
    );
  }

  if (activePage === 'ADMIN_DASHBOARD') {
    return (
      <>
        <ToastContainer />
        <AdminDashboardPage />
      </>
    );
  }

  // 2. Storefront E-Commerce Pages (Có Header, Reservation Banner, MiniCart Drawer & Footer cửa hàng)
  return (
    <MainLayout>
      {activePage === 'HOME' && <HomeSection />}
      {activePage === 'FLASH_SALE' && <FlashSaleSection />}
      {activePage === 'CATALOG' && <CatalogSection />}
      {activePage === 'PRODUCT_DETAIL' && <ProductDetailPage />}
      {activePage === 'CHECKOUT' && <CheckoutSection />}
      {activePage === 'ORDERS' && <OrdersPage />}
      {activePage === 'PROFILE' && <ProfilePage />}
    </MainLayout>
  );
};

export function App() {
  return (
    <RoastRushProvider>
      <AppRouter />
    </RoastRushProvider>
  );
}

export default App;
