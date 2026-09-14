"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Boxes,
  CircleDollarSign,
  ReceiptText,
  TriangleAlert,
} from "lucide-react";

import { getProducts } from "@/services/product.service";
import { getTransactions } from "@/services/transaction.service";
import type { Product } from "@/types/product";
import type { SaleTransaction } from "@/types/transaction";
import { formatCurrency, formatDate } from "@/utils/currency";
import { useAuth } from "@/contexts/auth-contex";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

function isToday(date?: SaleTransaction["createdAt"]) {
  if (!date) return false;
  const value = date.toDate();
  const today = new Date();
  return (
    value.getFullYear() === today.getFullYear() &&
    value.getMonth() === today.getMonth() &&
    value.getDate() === today.getDate()
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<SaleTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [productData, transactionData] = await Promise.all([
        getProducts(user.uid),
        getTransactions(user.uid),
      ]);
      setProducts(productData);
      setTransactions(transactionData);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void load();
  }, [load]);

  const todayTransactions = useMemo(
    () => transactions.filter((trx) => isToday(trx.createdAt)),
    [transactions],
  );

  const todayRevenue = useMemo(
    () => transactions.reduce((sum, trx) => sum + trx.total, 0),
    [todayTransactions],
  );

  const lowStock = useMemo(
    () => products.filter((product) => product.stock <= 5).length,
    [products],
  );

  const cards = [
    {
      label: "Total Produk",
      value: String(products.length),
      icon: Boxes,
    },
    {
      label: "Transaksi Hari ini",
      value: String(todayTransactions.length),
      icon: ReceiptText,
    },
    {
      label: "Omzet hari ini",
      value: formatCurrency(todayRevenue),
      icon: CircleDollarSign,
    },
    {
      label: "Stok Menipis",
      value: String(lowStock),
      icon: TriangleAlert,
    },
  ];

  return (
    <div>
      <div className="mb-7 flex flex-col sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-indigo-600">OVERVIEW</p>
          <h1 className="mt-1 text-3xl font-black tracking-tight">Dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">
            Ringkasan aktivitas MiniPOS hari ini.
          </p>
        </div>
        <Link href="/transactions/new">
          <Button>Mulai Transaksi</Button>
        </Link>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-white p-8 text-sm text-slate-500">
          Memuat Dashboard
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.label}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="grid size-10 place-items-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Icon size={19} />
                  </div>

                  <div className="mt-5 text-sm font-semibold text-slate-500">
                    {card.label}
                  </div>

                  <div className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                    {card.value}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-black">
                  Transaksi Terbaru
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  5 transaksi terbaru
                </p>
              </div>
              <Link
                href="/transactions"
                className="text-sm font-bold text-indigo-600 hover:underline"
              >
                Lihat Semua
              </Link>
            </div>
            <div className="grid gap-3">
              {transactions.slice(0, 5).map((trx) => (
                <Link
                  key={trx.id}
                  href={`/transactions/${trx.id}`}
                  className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 p-4 hover:bg-slate-100"
                >
                  <div>
                    <div className="font-bold">{trx.invoiceNumber}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {formatDate(trx.createdAt)}
                    </div>
                  </div>
                  <div className="font-black">{formatCurrency(trx.total)}</div>
                </Link>
              ))}
              {transactions.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                  Belum ada transaksi
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
