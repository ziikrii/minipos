import { Timestamp } from "firebase/firestore";


export type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
};
export type ProductInput = Omit<Product, "id" | "createdAt" | "updatedAt">;
