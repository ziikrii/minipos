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
  return (
    <div>
      <h1>Riwayat Transaksi</h1>

      <p>Riwayat transaksi akan tampil di sini.</p>
      <table>
        <thead>
          <tr>
            <th>No. Invoice</th>
            <th>Tanggal</th>
            <th>Total</th>
            <th>Metode Pembayaran</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.invoiceNumber}</td>
              <td>{formatDate(transaction.createdAt)}</td>
              <td>{formatCurrency(transaction.total)}</td>
              <td>{transaction.paymentMethod}</td>
              <td>
                <Link href={"/transactions/" + transaction.id}>
                  <PrintButton />
                  {/* Lihat Invoice */}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
