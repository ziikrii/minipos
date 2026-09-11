"use client";

import { useRouter } from "next/navigation";
// import { addProduct } from "@/utils/product-storage";
import { createProduct } from "@/services/product.service";

import { ProductForm } from "@/components/products/product-form";
import type { ProductInput } from "@/types/product";
// import { addProduct } from "@/utils/product-storage";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/contexts/auth-contex";

export default function CreateProductPage() {
  const router = useRouter();
  const { user } = useAuth();

  async function handleSubmit(input: ProductInput) {
    console.log("clicked");
    if (!user) return;
    await createProduct(user.uid, input);
    console.log("clicked tets");

    router.push("/products");
  }

  // function handleCreateProduct(value: ProductInput) {
  //   addProduct(value);
  //   router.push("/products");
  // }
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-bold text-indigo-600">MASTER DATA</p>
      <h1 className="mt-1 text-3xl font-black tracking-tight">Tambah Produk</h1>
      <p className="mt-2 text-sm text-slate-500">
        Isi data produk yang akan dijual di MiniPOS.
      </p>
      <div className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
        {/* <ProductForm onSubmit={handleCreateProduct} /> */}
        <ProductForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}

// {filteredProducts.length == 0 ? (
//   <EmptyState
//     title= "Produk tidak ditemukan"
//     description="Coba gunakan kata kunci lain atau tambhakan produk baru."
//   />
// ) : (
//   <div className="grid gap-3">
//     {filteredProducts.map((product) => (
//       <ProductRow
//         key={product.id}
//         product={product}
//         />
//     ))}
//   </div>
// )}
