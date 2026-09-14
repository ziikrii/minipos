import { Timestamp } from "firebase/firestore";
import type { CartItem, PaymentMethod } from "./cart";

export type TransactionItem = Omit<CartItem, "stock">;
// Payment Method sudah ada di { PaymentMethod } from "./cart";

export type SaleTransaction = {
  id: string;
  invoiceNumber: string;
  items: TransactionItem[];
  subtotal: number;
  total: number;
  paymentMethod: PaymentMethod;
  paidAmount: number;
  changeAmount: number;
  createdAt: Timestamp;
};
