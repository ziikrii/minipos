import { Product, ProductInput } from "@/types/product";

export type FormErrors = Partial<Record<keyof ProductInput, string>>

const STORAGE_KEY = "minipos-porduct";

const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Kopi Susu",
    sku: "KOPI001",
    price: 18000,
    stock: 10,
  },
  {
    id: "2",
    name: "Teh Manis",
    sku: "TEH001",
    price: 8000,
    stock: 5,
  }
];

export function addProduct(input: ProductInput) {
  const products = getProducts();

  const newProducts: Product = {
    id: crypto.randomUUID(),
    ...input
  };

  const nextProducts = [newProducts, ...products];

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(nextProducts)
  );
}

export function validateProduct(value: ProductInput) {
  const errors: FormErrors = {};

  if (!value.name.trim()) {
    errors.name = "Nama Produk wajib diisi";
  }

  if (!value.sku.trim()) {
    errors.sku = "SKU Wajib diisi";
  }

  if (value.price <= 0) {
    errors.price = "Harga harus lebih dari 0";
  }

  if (value.stock < 0) {
    errors.stock = "Stock tidak boleh minus";
  }

  return errors;
}

import React from 'react'

export default function getProducts() {
  if (typeof window === "undefined") {
    return sampleProducts;
  }

  const saved = window.localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    window.localStorage.setItem(
      STORAGE_KEY, JSON.stringify(sampleProducts)
    );
    return sampleProducts;
  }
  return JSON.parse(saved) as Product[];
}
