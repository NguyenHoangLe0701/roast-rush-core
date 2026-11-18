import React, { useState } from 'react';
import { Plus, Tag, Trash2 } from 'lucide-react';
import { useRoastRush } from '../../../context/RoastRushContext';
import { formatVnd } from '../../../data/mockData';
import { CustomDropdown, DropdownOption } from '../../../components/common/CustomDropdown';

const DISCOUNT_TYPE_OPTIONS: DropdownOption<'FIXED' | 'PERCENT'>[] = [
  { value: 'FIXED', label: 'Giảm số tiền cố định (VNĐ)' },
  { value: 'PERCENT', label: 'Giảm theo phần trăm (%)' },
];

export const AdminVouchersTab: React.FC = () => {
  const { vouchers, createVoucher, deleteVoucher } = useRoastRush();

  const [showForm, setShowForm] = useState(false);
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'FIXED' | 'PERCENT'>('FIXED');
  const [value, setValue] = useState('50000');
  const [minOrderVnd, setMinOrderVnd] = useState('300000');
  const [maxDiscountVnd, setMaxDiscountVnd] = useState('150000');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    createVoucher({
      code: code.trim().toUpperCase(),
      description:
        description.trim() ||
        (discountType === 'FIXED'
          ? `Giảm ${formatVnd(Number(value))} cho đơn từ ${formatVnd(Number(minOrderVnd))}`
          : `Giảm ${value}% tối đa ${formatVnd(Number(maxDiscountVnd))}`),
      discountType,
      value: Number(value) || 30000,
      minOrderVnd: Number(minOrderVnd) || 0,
      maxDiscountVnd: discountType === 'PERCENT' ? Number(maxDiscountVnd) || 150000 : undefined,
    });
    setCode('');
    setDescription('');
    setShowForm(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-stone-900">Quản lý Mã giảm giá (Vouchers)</h2>
          <p className="text-xs text-stone-500">
            Mã tạo mới sẽ đồng bộ trực tiếp ra trang Giỏ hàng & Thanh toán cho khách áp dụng ngay
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo mã giảm giá mới</span>
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4 text-xs"
        >
          <h3 className="text-sm font-bold text-stone-900">Tạo Voucher khuyến mãi mới</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-stone-700 block mb-1">Mã Voucher *</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="VD: COFFEE100K"
                className="w-full h-9 px-3 rounded-lg border border-stone-300 bg-white uppercase font-mono font-bold"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Loại giảm giá</label>
              <CustomDropdown
                value={discountType}
                options={DISCOUNT_TYPE_OPTIONS}
                onChange={(val) => setDiscountType(val)}
                align="left"
                buttonClassName="h-9 px-3 rounded-lg text-xs font-semibold shadow-sm"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">
                {discountType === 'FIXED' ? 'Số tiền giảm (VNĐ)' : 'Phần trăm giảm (%)'}
              </label>
              <input
                type="number"
                min={1}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-stone-300 bg-white font-bold text-amber-800"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">
                Đơn hàng tối thiểu (VNĐ)
              </label>
              <input
                type="number"
                step={50000}
                value={minOrderVnd}
                onChange={(e) => setMinOrderVnd(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-stone-300 bg-white"
              />
            </div>

            {discountType === 'PERCENT' && (
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Giảm tối đa (VNĐ)
                </label>
                <input
                  type="number"
                  step={10000}
                  value={maxDiscountVnd}
                  onChange={(e) => setMaxDiscountVnd(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg border border-stone-300 bg-white"
                />
              </div>
            )}

            <div className={discountType === 'PERCENT' ? '' : 'sm:col-span-2'}>
              <label className="font-semibold text-stone-700 block mb-1">Mô tả ngắn</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="VD: Ưu đãi đặc biệt cuối tuần..."
                className="w-full h-9 px-3 rounded-lg border border-stone-300 bg-white"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg bg-stone-200 text-stone-700 font-semibold"
            >
              Đóng
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-amber-800 text-white font-bold"
            >
              Phát hành Voucher
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vouchers.map((v) => (
          <div
            key={v.code}
            className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between space-y-3"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-800 text-white font-mono text-xs font-extrabold">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{v.code}</span>
                </span>

                <button
                  type="button"
                  onClick={() => deleteVoucher(v.code)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Xóa mã giảm giá"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-sm font-black text-stone-900">
                {v.discountType === 'FIXED'
                  ? `Giảm ${formatVnd(v.value)}`
                  : `Giảm ${v.value}% (Tối đa ${formatVnd(v.maxDiscountVnd || 0)})`}
              </div>

              <p className="text-xs text-stone-500 leading-relaxed">{v.description}</p>
            </div>

            <div className="pt-2 border-t border-stone-200/80 text-[11px] text-stone-500 font-medium">
              Đơn tối thiểu: <strong className="text-stone-800">{formatVnd(v.minOrderVnd)}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

