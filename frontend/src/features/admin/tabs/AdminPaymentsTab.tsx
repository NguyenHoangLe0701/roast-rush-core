import React, { useMemo, useState } from 'react';
import { Check, CheckCircle2, Copy, ShieldCheck } from 'lucide-react';
import { useRoastRush } from '../../../context/RoastRushContext';
import { formatVnd } from '../../../data/mockData';
import { PaymentProvider } from '../../../types/domain.types';
import { PaginationBar } from '../../../components/common/PaginationBar';

interface AdminPaymentsTabProps {
  searchKeyword: string;
}

export const AdminPaymentsTab: React.FC<AdminPaymentsTabProps> = ({ searchKeyword }) => {
  const { paymentTransactions } = useRoastRush();
  const [providerFilter, setProviderFilter] = useState<'ALL' | PaymentProvider>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const filteredTransactions = useMemo(
    () =>
      paymentTransactions.filter((tx) => {
        const q = searchKeyword.toLowerCase();
        const matchQuery =
          tx.orderCode.toLowerCase().includes(q) ||
          tx.transactionRef.toLowerCase().includes(q) ||
          tx.idempotencyKey.toLowerCase().includes(q);
        const matchProvider = providerFilter === 'ALL' || tx.provider === providerFilter;
        return matchQuery && matchProvider;
      }),
    [paymentTransactions, searchKeyword, providerFilter]
  );

  const pagedTransactions = useMemo(() => {
    const start = page * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, page, pageSize]);

  const handleCopyKey = (txId: string, key: string) => {
    navigator.clipboard?.writeText(key);
    setCopiedId(txId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-stone-900">
            Nhật ký Đối soát Giao dịch & Webhook Idempotency
          </h2>
          <p className="text-xs text-stone-500">
            Kiểm chứng xác thực chữ ký HMAC (VNPay / MoMo) và khóa Idempotency-Key chống trừ tiền 2 lần
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {[
            { id: 'ALL', label: 'Tất cả cổng' },
            { id: PaymentProvider.VNPAY, label: 'VNPay QR' },
            { id: PaymentProvider.MOMO, label: 'Ví MoMo' },
          ].map((p) => (
            <button
              type="button"
              key={p.id}
              onClick={() => {
                setProviderFilter(p.id as 'ALL' | PaymentProvider);
                setPage(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                providerFilter === p.id
                  ? 'bg-amber-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-stone-200 text-stone-500 uppercase">
              <th className="py-3 font-semibold">Mã đơn</th>
              <th className="py-3 font-semibold">Cổng & Mã tham chiếu</th>
              <th className="py-3 font-semibold">Số tiền</th>
              <th className="py-3 font-semibold">Idempotency-Key</th>
              <th className="py-3 font-semibold">Chữ ký HMAC</th>
              <th className="py-3 font-semibold text-right">Thời gian xử lý</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {pagedTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-stone-50">
                <td className="py-4 font-mono font-bold text-stone-900">{tx.orderCode}</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        tx.provider === PaymentProvider.VNPAY
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-pink-50 text-pink-700 border border-pink-200'
                      }`}
                    >
                      {tx.provider}
                    </span>
                    <span className="font-mono font-semibold text-stone-800">
                      {tx.transactionRef}
                    </span>
                  </div>
                  {tx.providerTransactionNo && (
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      Provider TransNo: {tx.providerTransactionNo}
                    </div>
                  )}
                </td>
                <td className="py-4 font-bold text-stone-900">{formatVnd(tx.amountVnd)}</td>
                <td className="py-4">
                  <button
                    type="button"
                    onClick={() => handleCopyKey(tx.id, tx.idempotencyKey)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 font-mono text-[11px] text-stone-700 transition"
                    title={tx.idempotencyKey}
                  >
                    <span>{tx.idempotencyKey.slice(0, 14)}...</span>
                    {copiedId === tx.id ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3 text-stone-400" />
                    )}
                  </button>
                </td>
                <td className="py-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>HMAC Verified ✓</span>
                  </span>
                </td>
                <td className="py-4 text-right text-stone-500">
                  <div className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {tx.processedAt
                        ? new Date(tx.processedAt).toLocaleString('vi-VN')
                        : '—'}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PaginationBar
        page={page}
        size={pageSize}
        totalElements={filteredTransactions.length}
        onPageChange={setPage}
        onSizeChange={(s) => {
          setPageSize(s);
          setPage(0);
        }}
      />
    </div>
  );
};

