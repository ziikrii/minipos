"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { getProductById, restockProduct } from "@/services/product.service";

import type { Product } from "@/types/product";

export default function RestockProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        const data = await getProductById(params.id);

        setProduct(data ?? null);
      } catch (error) {
        console.error(error);
        setError("Gagal memuat produk.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [params.id]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!product) return;

    if (quantity <= 0) {
      setError("Jumlah stock harus lebih dari 0.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      // await restockProduct(product.id, quantity);

      router.push("/products");
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error ? error.message : "Gagal menambahkan stock.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center">
        Memuat produk...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="rounded-2xl border bg-white p-8 text-center">
        Produk tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <p className="text-sm font-bold text-indigo-600">INVENTORY</p>

      <h1 className="mt-1 text-3xl font-black">Tambah Stock</h1>

      <p className="mt-2 text-sm text-slate-500">
        Tambahkan stock baru ke produk.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5 rounded-2xl border bg-white p-6 shadow-sm"
      >
        <div>
          <p className="text-sm font-bold text-slate-500">Produk</p>

          <p className="mt-1 text-lg font-black text-slate-950">
            {product.name}
          </p>

          <p className="text-sm text-slate-500">SKU: {product.sku}</p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm font-semibold text-slate-500">Stock Saat Ini</p>

          <p className="mt-1 text-2xl font-black text-slate-950">
            {product.stock}
          </p>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700">
            Tambah Stock
          </label>

          <Input
            type="number"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            placeholder="Contoh: 20"
            className="mt-1"
          />

          {error && (
            <p className="mt-1 text-sm font-semibold text-red-600">{error}</p>
          )}
        </div>

        {/* <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
          <p className="text-sm font-semibold text-indigo-600">
            Stock Setelah Restock
          </p>

          <p className="mt-1 text-2xl font-black text-indigo-700">
            {product.stock + Math.max(quantity, 0)}
          </p>
        </div> */}

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.push("/products")}
          >
            Batal
          </Button>

          <Button type="submit" disabled={saving || quantity <= 0}>
            {saving ? "Menyimpan..." : "Tambah Stock"}
          </Button>
        </div>
      </form>
    </div>
  );
}
