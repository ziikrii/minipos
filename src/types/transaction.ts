import type { PaymentMethod } from "./cart";

export type TransactionItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  subtotal: number;
};

// Payment Method sudah ada di { PaymentMethod } from "./cart";

export type Transaction = {
  id: string;
  invoiceNumber: string;
  items: TransactionItem[];
  total: number;
  paidAmount: number;
  changeAmount: number;
  paymentMethod: PaymentMethod;
  createdAt: Date;
}