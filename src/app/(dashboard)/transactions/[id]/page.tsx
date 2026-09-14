"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/auth-contex";
import { getSaleTransaction } from "@/services/transaction.service";
import { SaleTransaction } from "@/types/transaction";
import { formatCurrency, formatDate } from "@/utils/currency";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default async function TransactionDetailPage() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const [transaction, setTransaction] = useState<SaleTransaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getSaleTransaction(user.uid, params.id).then((data) => {
      setTransaction(data);
      setLoading(false);
    });
  }, [user, params.id]);

  if (loading)
    return <div className="rounded-2xl bg-white p-6">Memuat Transaksi...</div>;
  if (!transaction)
    return (
      <div className="rounded-2xl bg-white p-6">Transaksi tidak ditemukan.</div>
    );

  return (
    <div className="mx-auto max-w-3xl">
      <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-5 border-b border-slate-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid size-12 place-items-center tracking-widest text-emerald-700">
              <CheckCircle2 />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                Transaksi Berhasil
              </div>
              <h1 className="mt-1 text-2xl font-black">
                {transaction.invoiceNumber}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {formatDate(transaction.createdAt)}
              </p>
            </div>
          </div>
          <Link href="/transactions/new">
            <Button>Transaksi Baru</Button>
          </Link>
        </div>

        <div className="py-6">
          <h2 className="mb-4 font-black">Detail Produk</h2>
          <div className="grid gap-3">
            {transaction.items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-4"
              >
                <div>
                  <div className="font-bold">{item.name}</div>
                  <div className="mt-1 text-xs text-slate-500">
                    {item.sku} | {item.qty} x {formatCurrency(item.price)}
                  </div>
                </div>
                <div className="font-black">
                  {formatCurrency(item.price * item.qty)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 border-t border-slate-100 pt-6 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Metode Pembayaran</span>
            <strong className="uppercase">{transaction.total}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total</span>
            <strong>{formatCurrency(transaction.total)}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Dibayar</span>
            <strong>{formatCurrency(transaction.paidAmount)}</strong>
          </div>
          <div className="flex justify-between text-base">
            <span className="font-bold">Kembalian</span>
            <strong>{formatCurrency(transaction.changeAmount)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
