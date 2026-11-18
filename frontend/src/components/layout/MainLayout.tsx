import React from 'react';
import { Footer } from './Footer';
import { Header } from './Header';
import { ReservationHoldBanner } from './ReservationHoldBanner';
import { MiniCartDrawer } from './MiniCartDrawer';
import { ToastContainer } from '../common/ToastContainer';

export const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col font-sans">
      <ReservationHoldBanner />
      <Header />
      <MiniCartDrawer />
      <ToastContainer />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>

      <Footer />
    </div>
  );
};
