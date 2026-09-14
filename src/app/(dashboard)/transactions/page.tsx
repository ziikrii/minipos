"use client";

import { getTransactions } from "@/services/transaction.service";
import { formatCurrency, formatDate } from "@/utils/currency";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SaleTransaction } from "@/types/transaction";
import PrintButton from "@/components/transactions/print-button";
import { useAuth } from "@/contexts/auth-contex";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

export default function TransactionPage() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<SaleTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setTransactions(await getTransactions(user.uid));
    } finally {
      setLoading(false);
    }
  }, [user]);
  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-indigo-600">TRANSAKSI</p>

          <h1 className="mt-1 text-3xl font-black tracking-tight">
            Riwayat Transaksi
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Lihat dan kelola riwayat transaksi yang telah dilakukan.
          </p>
        </div>
        <Link href={"transactions/new"}>
          <Button>
            <Plus size={18} /> Transaksi Baru
          </Button>
        </Link>
      </div>

      {loading && (
        <div className="rounded-2xl bg-white p-8 text-sm text-slate-500">
          Memuat Transaksi
        </div>
      )}
      {!loading && transactions.length === 0 && (
        <EmptyState
          title="Belum ada transaksi"
          description="Buat Transaksi pertama melalui halaman kasir/ POS"
        />
      )}

      {!loading && transactions.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 text-center">
                <tr>
                  <th className="px-5 py-4">No. Invoice</th>
                  <th className="px-5 py-4">Tanggal</th>
                  <th className="px-5 py-4">Item</th>
                  <th className="px-5 py-4">Metode Pembayaran</th>
                  <th className="px-5 py-4">Total</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="transition-colors hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4 font-bold text-slate-900">
                      <Link
                        href={`/transaction/${transaction.id}`}
                        className="font-black text-indigo-600 hover:underline"
                      >
                        {transaction.invoiceNumber}
                      </Link>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(transaction.createdAt)}
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {transaction.items.length}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold capitalize text-indigo-700">
                        {transaction.paymentMethod}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-bold text-slate-900">
                      {formatCurrency(transaction.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
