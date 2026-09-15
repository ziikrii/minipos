"use client";

import { useRouter } from "next/navigation";
import { createProduct } from "@/services/product.service";

import { ProductForm } from "@/components/products/product-form";
import type { ProductInput } from "@/types/product";
import { useAuth } from "@/contexts/auth-context";

export default function CreateProductPage() {
  const { user } = useAuth();
  const router = useRouter();

  async function handleSubmit(input: ProductInput) {
    console.log("clicked");
    if (!user) return
    await createProduct(user?.uid, input);
    console.log("clicked tets");

    router.push("/products");
  }

  return (
    <div className="max-w-2xl">
      <p className="text-sm font-bold text-indigo-600">MASTER DATA</p>
      <h1 className="mt-1 text-3xl font-black tracking-tight">Tambah Produk</h1>
      <p className="mt-2 text-sm text-slate-500">
        Isi data produk yang akan dijual di MiniPOS.
      </p>
      <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
        <ProductForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
