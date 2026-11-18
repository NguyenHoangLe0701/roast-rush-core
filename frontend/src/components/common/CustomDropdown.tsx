import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export interface DropdownOption<T extends string | number = string> {
  value: T;
  label: string;
  description?: string;
  badge?: string;
}

interface CustomDropdownProps<T extends string | number = string> {
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  align?: 'left' | 'right';
}

export function CustomDropdown<T extends string | number = string>({
  value,
  options,
  onChange,
  className = '',
  buttonClassName = '',
  menuClassName = '',
  align = 'right',
}: CustomDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between gap-2 bg-white border transition text-left cursor-pointer ${
          open
            ? 'border-amber-800 ring-2 ring-amber-800/15 text-stone-900'
            : 'border-stone-200 hover:border-amber-800/60 text-stone-800'
        } ${buttonClassName || 'h-9 px-3.5 rounded-full text-xs font-semibold shadow-sm'}`}
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-stone-500 shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180 text-amber-800' : ''
          }`}
        />
      </button>

      {/* Custom Rounded Popover Menu */}
      {open && (
        <div
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } top-full mt-1.5 min-w-[230px] w-full rounded-2xl bg-white border border-stone-200/95 shadow-xl p-1.5 z-50 space-y-0.5 ${menuClassName}`}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between gap-2.5 transition ${
                  isSelected
                    ? 'bg-amber-50/90 text-amber-950 font-bold'
                    : 'text-stone-700 hover:bg-stone-100/80 font-medium'
                }`}
              >
                <div className="min-w-0">
                  <div className="text-xs truncate">{opt.label}</div>
                  {opt.description && (
                    <div className="text-[11px] text-stone-400 font-normal truncate mt-0.5">
                      {opt.description}
                    </div>
                  )}
                </div>

                {isSelected && <Check className="w-3.5 h-3.5 text-amber-800 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

