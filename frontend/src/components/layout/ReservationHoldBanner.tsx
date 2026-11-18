import React from 'react';
import { Clock } from 'lucide-react';
import { useRoastRush } from '../../context/RoastRushContext';
import { ReservationStatus } from '../../types/domain.types';

export const formatCountdown = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const ReservationHoldBanner: React.FC = () => {
  const { activeReservation, setActivePage } = useRoastRush();

  if (!activeReservation || activeReservation.status !== ReservationStatus.HOLDING) {
    return null;
  }

  return (
    <div className="bg-amber-800 text-white px-4 py-2 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-200 animate-pulse" />
          <span>
            Giỏ hàng ưu đãi của bạn đang được giữ chỗ trong:{' '}
            <strong className="font-mono text-amber-200 text-sm sm:text-base px-1.5 py-0.5 rounded bg-amber-950/60">
              {formatCountdown(activeReservation.remainingSeconds)}
            </strong>
          </span>
        </div>

        <button
          onClick={() => setActivePage('CHECKOUT')}
          className="font-semibold underline hover:text-amber-200 transition"
        >
          Hoàn tất thanh toán ngay →
        </button>
      </div>
    </div>
  );
};
