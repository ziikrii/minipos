import { Transaction } from "@/types/transaction";
import { formatCurrency, formatDate } from "@/utils/currency";

type PrintInvoiceProps = {
  transaction: Transaction;
};

export default function PrintInvoice({ transaction }: PrintInvoiceProps) {
  return (
    <div className="hidden print:block print:text-black">
      {/* Header Invoice */}
      <div className="mb-6 border-b border-slate-300 pb-4 text-center">
        <h1 className="text-2xl font-black">MiniPOS</h1>

        <p className="mt-1 text-sm">Invoice Transaksi</p>
      </div>

      {/* Informasi Transaksi */}
      <div className="mb-6 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-bold">No. Invoice</p>

          <p className="mt-1">{transaction.invoiceNumber}</p>
        </div>

        <div className="text-right">
          <p className="font-bold">Tanggal</p>

          <p className="mt-1">{formatDate(transaction.createdAt)}</p>
        </div>

        <div>
          <p className="font-bold">Pembayaran</p>

          <p className="mt-1 capitalize">{transaction.paymentMethod}</p>
        </div>
      </div>

      {/* Daftar Produk */}
      <div className="mt-6">
        <h2 className="mb-3 text-sm font-black uppercase">Detail Produk</h2>

        {/* Header tabel */}
        <div className="grid grid-cols-[minmax(0,1fr)_60px_110px] gap-3 border-y border-slate-300 py-2 text-xs font-bold uppercase">
          <span>Produk</span>
          <span className="text-center">Qty</span>
          <span className="text-right">Total</span>
        </div>

        {/* Produk */}
        {transaction.items.map((item) => (
          <div
            key={item.productId}
            className="grid grid-cols-[minmax(0,1fr)_60px_110px] gap-3 border-b border-slate-200 py-3 text-sm"
          >
            <div>
              <p className="font-semibold">{item.name}</p>

              <p className="text-xs text-slate-500">
                {formatCurrency(item.price)}
              </p>
            </div>

            <span className="text-center">{item.qty}</span>

            <span className="text-right font-bold">
              {formatCurrency(item.subtotal)}
            </span>
          </div>
        ))}
      </div>

      {/* Ringkasan Pembayaran */}
      <div className="mt-6 border-t border-slate-300 pt-4">
        <div className="flex items-center justify-between py-2 text-sm">
          <span>Total</span>

          <span className="font-black">
            {formatCurrency(transaction.total)}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 text-sm">
          <span>Uang Dibayar</span>

          <span className="font-semibold">
            {formatCurrency(transaction.paidAmount)}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-slate-300 pt-3 text-sm">
          <span className="font-bold">Kembalian</span>

          <span className="font-black">
            {formatCurrency(transaction.changeAmount)}
          </span>
        </div>
      </div>

      {/* Footer Invoice */}
      <div className="mt-8 border-t border-slate-300 pt-4 text-center">
        <p className="text-sm font-bold">Terima kasih</p>

        <p className="mt-1 text-xs text-slate-500">
          Telah berbelanja di MiniPOS
        </p>
      </div>
    </div>
  );
}
