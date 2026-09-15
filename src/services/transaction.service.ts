import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import type { Transaction } from "@/types/transaction";
import { CartItem, PaymentMethod } from "@/types/cart";
import { createInvoiceNumber } from "@/utils/invoice";

export type CheckoutInput = {
  items: CartItem[];
  paymentMethod: PaymentMethod;
  paidAmount: number;
};

export async function checkout(uid: string, input: CheckoutInput) {
  if (input.items.length === 0) throw new Error("Keranjang masih kosong.");

  const total = input.items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0,
  );

  if (input.paymentMethod === "cash" && input.paidAmount < total) {
    throw new Error("Uang pembayaran masih kurang.");
  }

  const invoiceNumber = createInvoiceNumber();
  const transactionRef = doc(collection(db, "users", uid, "transactions"));

  await runTransaction(db, async (firestoreTransaction) => {
    const productSnapshots = await Promise.all(
      input.items.map((item) =>
        firestoreTransaction.get(
          doc(db, "users", uid, "products", item.productId),
        ),
      ),
    );

    productSnapshots.forEach((snapshot, index) => {
      const CartItem = input.items[index];
      const currentStock = Number(snapshot.data()?.stock ?? 0);
      if (currentStock < CartItem.qty) {
        throw new Error(`Stok ${CartItem.name} tidak mencukupi.`);
      }
    });

    productSnapshots.forEach((snapshot, index) => {
      const CartItem = input.items[index];
      const currentStock = Number(snapshot.data()?.stock ?? 0);
      firestoreTransaction.update(snapshot.ref, {
        stock: currentStock - CartItem.qty,
        updateAt: serverTimestamp(),
      });
    });
    const cleanItems = input.items.map(
      ({ productId, name, sku, price, qty }) => ({
        productId,
        name,
        sku,
        price,
        qty,
      }),
    );

    firestoreTransaction.set(transactionRef, {
      invoiceNumber,
      items: cleanItems,
      subtotal: total,
      total,
      paymentmethod: input.paymentMethod,
      paidAmount: input.paidAmount,
      change: input.paymentMethod === "cash" ? input.paidAmount - total : 0,
      createdAt: serverTimestamp(),
    });
  });

  return { transactionId: transactionRef.id, invoiceNumber, total };
}

export async function getTransactions(uid: string): Promise<Transaction[]> {
  const ref = collection(db, "users", uid, "transactions");
  const snapshot = await getDocs(query(ref, orderBy("createdAt", "desc")));
  return snapshot.docs.map(
    (item) => ({ id: item.id, ...item.data() }) as Transaction,
  );
}

export async function getTransaction(uid: string, transactionId: string) {
  const snapshot = await getDoc(
    doc(db, "users", uid, "transactions", transactionId),
  );
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Transaction;
}
