import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

import type { TransactionItem, Transaction } from "@/types/transaction";
import type { PaymentMethod } from "@/types/cart";

const transactionCollection = collection(db, "transactions");

type CreateTransactionPayload = {
  items: TransactionItem[];
  total: number;
  paidAmount: number;
  paymentMethod: PaymentMethod;
};

function generateInvoiceNumber() {
  return `TRX-${Date.now()}`;
}

// Simpan Transaksi ke Firestore
export async function createTransaction(payload: CreateTransactionPayload) {
  const changeAmount = payload.paidAmount - payload.total;
  const docRef = await addDoc(transactionCollection, {
    invoiceNumber: generateInvoiceNumber(),
    items: payload.items,
    total: payload.total,
    paidAmount: payload.paidAmount,
    changeAmount,
    paymentMethod: payload.paymentMethod,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

// Membaca riwayat transaksi
export async function getTransactions(): Promise<Transaction[]> {
  const q = query(transactionCollection, orderBy("createdAt", "desc"));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((item) => {
    const data = item.data();

    return {
      id: item.id,
      invoiceNumber: data.invoiceNumber,
      items: data.items,
      total: data.total,
      paidAmount: data.paidAmount,
      changeAmount: data.changeAmount,
      paymentMethod: data.paymentMethod,
      createdAt: data.createdAt?.toDate?.() ?? new Date(),
    };
  });
}

// Membaca Detail Invoice
// export async function getTransactionsById(id: string) {
//   console.log("Transaction ID:", id);

//   const docRef = doc(db, "transactions", id);
//   const snapshot = await getDoc(docRef);

//   if (!snapshot.exists()) {
//     return null;
//   }

//   const data = snapshot.data();

//   return {
//     id: snapshot.id,
//     ...data,
//     createdAt: data.createdAt?.toDate?.() ?? new Date(),
//   };
// }

export async function getTransactionsById(
  id: string,
): Promise<Transaction | null> {
  console.log("Transaction ID:", id);

  const docRef = doc(db, "transactions", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    id: snapshot.id,
    invoiceNumber: data.invoiceNumber,
    items: data.items,
    total: data.total,
    paidAmount: data.paidAmount,
    changeAmount: data.changeAmount,
    paymentMethod: data.paymentMethod,
    createdAt: data.createdAt?.toDate?.() ?? new Date(),
  };
}
