import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CustomDropdown, DropdownOption } from './CustomDropdown';

interface PaginationBarProps {
  page: number; // 0-indexed matching Spring Data PageResponse
  size: number;
  totalElements: number;
  onPageChange: (nextPage: number) => void;
  onSizeChange?: (nextSize: number) => void;
}

const PAGE_SIZE_OPTIONS: DropdownOption<number>[] = [
  { value: 5, label: '5 dòng / trang' },
  { value: 10, label: '10 dòng / trang' },
  { value: 20, label: '20 dòng / trang' },
];

export const PaginationBar: React.FC<PaginationBarProps> = ({
  page,
  size,
  totalElements,
  onPageChange,
  onSizeChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(totalElements / size));
  const startIdx = totalElements === 0 ? 0 : page * size + 1;
  const endIdx = Math.min(totalElements, (page + 1) * size);

  return (
    <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500">
      <div className="flex items-center gap-3">
        <span>
          Hiển thị <strong className="text-stone-800">{startIdx}</strong>–
          <strong className="text-stone-800">{endIdx}</strong> trên tổng{' '}
          <strong className="text-stone-800">{totalElements}</strong> bản ghi
        </span>

        {onSizeChange && (
          <CustomDropdown
            value={size}
            options={PAGE_SIZE_OPTIONS}
            onChange={(val) => onSizeChange(Number(val))}
            align="left"
            className="w-36"
            buttonClassName="h-8 px-3 rounded-lg text-xs font-semibold shadow-sm"
          />
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 0}
          onClick={() => onPageChange(page - 1)}
          className="h-8 px-2.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed text-stone-700 font-semibold inline-flex items-center gap-1 transition"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Trước</span>
        </button>

        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            type="button"
            key={idx}
            onClick={() => onPageChange(idx)}
            className={`w-8 h-8 rounded-lg font-bold transition ${
              idx === page
                ? 'bg-amber-800 text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {idx + 1}
          </button>
        ))}

        <button
          type="button"
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(page + 1)}
          className="h-8 px-2.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed text-stone-700 font-semibold inline-flex items-center gap-1 transition"
        >
          <span>Tiếp</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

