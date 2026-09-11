"use client";

import Link from "next/link";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-contex";
import { deleteProduct, getProducts } from "@/services/product.service";
import type { Product } from "@/types/product";
import { formatCurrency } from "@/utils/currency";
// import { useRouter } from "next/navigation";
// import { getProducts } from "@/utils/product-storage";
// import { deleteProduct } from "@/lib/product-storage";

export default function ProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError("");
      setProducts(await getProducts(user.uid));
    } catch {
      setError("Gagal mengambil produk");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const filtered = useMemo(() => {
    const keyword = search.toLowerCase();

    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(keyword) ||
        product.sku.toLowerCase().includes(keyword),
    );
  }, [products, search]);

  async function handleDelete(product: Product) {
    if (!user || !window.confirm(`Hapus produk ${product.name}?`)) return;
    await deleteProduct(user.uid, product.id);
    await loadProducts();
  }

  // if (loading) {
  //   return (
  //     <div className="rounded-2xl border bg-white text-black p-6">
  //       Memuat data produk
  //     </div>
  //   );
  // }

  // if (error) {
  //   return <div className="rounded-2xl border bg-white p-6">{error}</div>;
  // }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-indigo-600">MASTER DATA</p>

          <h1 className="mt-1 text-3xl font-black tracking-tight">Produk</h1>

          <p className="mt-2 text-sm text-slate-500">
            Kelola produk, harga, dan stok
          </p>
        </div>
        <Link href="/products/create">
          <Button className="w-full sm:w-auto">
            <Plus size={18} />
            Tambah Produk
          </Button>
        </Link>
      </div>

      <div className="mb-5 max-w-md">
        <Input
          placeholder="Cari nama atau SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-3"
        />
      </div>

      {loading && (
        <div className="rounded-2xl bg-white p-8 text-sm text-slate-500">
          Memuat Produk...
        </div>
      )}
      {error && (
        <div className="rounded-2xl bg-rose-50 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}
      {!loading && !error && products.length === 0 && (
        <EmptyState
          title="Belum ada produk"
          description="Tambahkan produk pertama untuk memulai transaksi POS"
        />
      )}

      {!loading && filtered.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4">Produk</th>
                  <th className="px-5 py-4">SKU</th>
                  {/* <th className="px-5 py-4">Kategori</th> */}
                  <th className="px-5 py-4">Harga</th>
                  <th className="px-5 py-4">Stok</th>
                  <th className="px-5 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((product) => {
                  const stockColor =
                    product.stock <= 5
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800";
                  return (
                    <tr key={product.id} className="hover:bg-slate-50/70">
                      <td className="px-5 py-4 font-bold text-slate-900">
                        {product.name}
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-700">
                        {product.sku}
                      </td>

                      {/* <td className="px-5 py-4">
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold capitalize text-indigo-600">
                          {product.category.replace("-", " ")}
                        </span>
                      </td> */}

                      <td className="px-5 py-4 text-slate-600 font-semibold">
                        {formatCurrency(product.price)}
                      </td>

                      <td className="px-5 py-4 ">
                        <span
                          className={
                            "rounded-full px-2.5 py-1 text-sm font-bold " +
                            stockColor
                          }
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-center gap-2">
                          <Link
                            href={"/products/" + product.id + "/edit"}
                            className="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
                            aria-label="Edit"
                          >
                            <Pencil size={16} />
                          </Link>

                          {/* <Link
                            href={"/products/" + product.id + "/restock"}
                            className="rounded-lg border border-indigo-200 px-3 py-2 text-sm text-indigo-600 font-semibold hover:bg-indigo-50 duration-200"
                          >
                            Restock
                          </Link> */}

                          <button
                            onClick={() => handleDelete(product)}
                            className="grid size-9 place-items-center rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                            aria-label="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && products.length > 0 && filtered.length === 0 && (
        <div className="rounded-2xl bg-white p-8 text-center text-sm text-slate-500">
          <Search className="mx-auto mb-2" />
          Produk tidak ditemukan.
        </div>
      )}
    </div>
  );
}
