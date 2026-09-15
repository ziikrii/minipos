"use client";

import { ProductForm } from "@/components/products/product-form";
import { getProduct, updateProduct } from "@/services/product.service";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ProductInput, Product } from "@/types/product";
import { useAuth } from "@/contexts/auth-context";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  async function handleSubmit(input: ProductInput) {
    if (!product || !user) return;

    await updateProduct(user.uid, product.id, input);

    router.push("/products");
  }

  useEffect(() => {
    async function loadProduct() {
      if (!user) return;
      const data = await getProduct(user.uid, params.id);
      setProduct(data ?? null);
      setLoading(false);
    }

    loadProduct();
  }, [params.id]);

  if (loading) {
    return <p>Memuat produk ...</p>;
  }
  if (!product) {
    return <p>Produk tidak ditemukan.</p>;
  }

  return (
    <div>
      <p className="text-sm font-bold text-indigo-600">MASTER DATA</p>
      <h1 className="mt-1 text-3xl font-black">Edit Produk</h1>

      <ProductForm
        initialData={product}
        submitLabel="Simpan Perubahan"
        onSubmit={handleSubmit}
      />
    </div>
  );
}
