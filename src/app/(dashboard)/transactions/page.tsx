"use client";

import { getTransactions } from "@/services/transaction.service";
import { formatCurrency, formatDate } from "@/utils/currency";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Transaction } from "@/types/transaction";
import PrintButton from "@/components/transactions/print-button";

export default function TransactionPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getTransactions();
      setTransactions(data);
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="mb-7">
          <p className="text-sm font-bold text-indigo-600">TRANSAKSI</p>

          <h1 className="mt-1 text-3xl font-black tracking-tight">
            Riwayat Transaksi
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Memuat riwayat transaksi...
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            Memuat data transaksi...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-7">
        <p className="text-sm font-bold text-indigo-600">TRANSAKSI</p>

        <h1 className="mt-1 text-3xl font-black tracking-tight">
          Riwayat Transaksi
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Lihat dan kelola riwayat transaksi yang telah dilakukan.
        </p>
      </div>

      {transactions.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 text-center">
                <tr>
                  <th className="px-5 py-4">No. Invoice</th>
                  <th className="px-5 py-4">Tanggal</th>
                  <th className="px-5 py-4">Total</th>
                  <th className="px-5 py-4">Metode Pembayaran</th>
                  <th className="px-5 py-4 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="transition-colors hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4 font-bold text-slate-900">
                      {transaction.invoiceNumber}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(transaction.createdAt)}
                    </td>

                    <td className="px-5 py-4 font-bold text-slate-900">
                      {formatCurrency(transaction.total)}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold capitalize text-indigo-700">
                        {transaction.paymentMethod}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <Link
                        href={"/transactions/" + transaction.id}
                        className="inline-flex rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                      >
                        Lihat Invoice
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <h2 className="text-lg font-black text-slate-900">
            Belum ada transaksi
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Transaksi yang berhasil dilakukan akan muncul di sini.
          </p>

          <Link
            href="/transactions/new"
            className="mt-5 inline-flex rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700"
          >
            Buat Transaksi
          </Link>
        </div>
      )}
    </div>
  );
}
