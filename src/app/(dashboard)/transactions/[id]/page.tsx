import PrintButton from "@/components/transactions/print-button";
import PrintInvoice from "@/components/transactions/print-invoice";
import { getTransactionsById } from "@/services/transaction.service";
import { formatCurrency, formatDate } from "@/utils/currency";
import Link from "next/link";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TransactionDetailPage({ params }: PageProps) {
  const { id } = await params;

  const transaction = await getTransactionsById(id);

  if (!transaction) {
    notFound();
  }

  return (
    <>
      <div className="mx-auto max-w-3xl print:hidden">
        {/* Header Halaman */}
        <div className="mb-6 print:hidden">
          <p className="text-sm font-bold text-indigo-600">TRANSAKSI</p>

          <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-600">
            Detail Transaksi
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Detail transaksi dan pembayaran.
          </p>
        </div>

        {/* Container Invoice */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Informasi Invoice */}
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                No. Invoice
              </p>

              <h2 className="mt-1 text-xl font-black text-slate-900">
                {transaction.invoiceNumber}
              </h2>
            </div>

            <div className="sm:text-right">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Metode Pembayaran
              </p>

              <span className="mt-1 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-sm font-bold capitalize text-indigo-700">
                {transaction.paymentMethod}
              </span>
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Tanggal Transaksi
            </p>

            <p className="mt-1 font-semibold text-slate-700">
              {transaction.createdAt.toLocaleString("id-ID")}
            </p>
          </div>

          {/* Detail Produk */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-900">Detail Produk</h2>

            {/* Daftar Produk */}
            <div className="mt-4 divide-y divide-slate-100">
              {transaction.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <div>
                    <p className="font-bold text-slate-900">{item.name}</p>

                    <p className="mt-1 text-sm text-slate-500">
                      {formatCurrency(item.price)} × {item.qty}
                    </p>
                  </div>

                  <p className="font-bold text-slate-900">
                    {formatCurrency(item.subtotal)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Ringkasan Pembayaran */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-900">
              Ringkasan Pembayaran
            </h2>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Total</span>

                <span className="font-semibold text-slate-700">
                  {formatCurrency(transaction.total)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Uang Dibayar</span>

                <span className="font-semibold text-slate-700">
                  {formatCurrency(transaction.paidAmount)}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                <span className="font-bold text-slate-900">Kembalian</span>

                <span className="text-xl font-black text-emerald-600">
                  {formatCurrency(transaction.changeAmount)}
                </span>
              </div>
            </div>

            {/* Tombol Aksi */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end print:hidden">
              <Link
                href="/transactions"
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-center text-sm font-bold text-slate-700 transition hover:bg-slate-100"
              >
                Kembali ke Riwayat
              </Link>

              <PrintButton />
            </div>
          </div>
        </div>
      </div>
      {/* Print Invoice */}
      <PrintInvoice transaction={transaction} />
    </>
  );
}
