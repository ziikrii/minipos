"use client";

import { ShoppingCart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { getProducts, updateProduct } from "@/services/product.service";
import type { Product } from "@/types/product";
import type { CartItem, PaymentMethod } from "@/types/cart";
import { formatCurrency } from "@/utils/currency";
import { useRouter } from "next/navigation";
import { createTransaction } from "@/services/transaction.service";

export default function NewTransactionPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("semua");
  const [discount, setDiscount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [loading, setLoading] = useState(true);

  const subtotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.subtotal, 0);
  }, [cartItems]);

  const grandTotal = useMemo(() => {
    return Math.max(subtotal - discount, 0);
  }, [subtotal, discount]);

  const changeAmount = useMemo(() => {
    return Math.max(paidAmount - grandTotal, 0);
  }, [paidAmount, grandTotal]);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);

        const data = await getProducts();
        setProducts(data);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    const keyword = search.toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(keyword) ||
        product.sku.toLowerCase().includes(keyword);

      const matchesCategory =
        category === "semua" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  // const filteredProducts = useMemo(() => {
  //   return products.filter((product) => {
  //     const keyword = search.toLowerCase();

  //     return (
  //       product.name.toLowerCase().includes(keyword) ||
  //       product.sku.toLowerCase().includes(keyword)
  //     );
  //   });
  // }, [products, search]);

  function handleAddCart(product: Product) {
    if (product.stock <= 0) {
      alert("Stock produk sudah habis.");
      return;
    }

    setCartItems((curretItem) => {
      const existingItem = curretItem.find(
        (item) => item.productId === product.id,
      );

      if (existingItem) {
        if (existingItem.qty >= product.stock) {
          alert(`Stock ${product.name} hanya ${product.stock}`);
          return curretItem;
        }

        return curretItem.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                qty: item.qty + 1,
                subtotal: (item.qty + 1) * item.price,
              }
            : item,
        );
      }

      return [
        ...curretItem,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
          subtotal: product.price,
        },
      ];
    });
  }

  function handleUpdateQty(productId: string, qty: number) {
    const product = products.find((product) => product.id === productId);
    if (!product) return;

    if (qty < 1) return;

    if (qty > product.stock) {
      alert(`Stock ${product.name} hanya ${product.stock}`);
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId
          ? { ...item, qty, subtotal: qty * item.price }
          : item,
      ),
    );
  }

  function handleRemoveItem(productId: string) {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId),
    );
  }

  async function handleCheckout() {
    if (cartItems.length === 0) {
      alert("Keranjang Masih Kosong");
      return;
    }

    if (paidAmount < grandTotal) {
      alert("Jumlah pembayaran masih kurang.");
      return;
    }

    try {
      // Cek stock
      for (const item of cartItems) {
        const product = products.find(
          (product) => product.id === item.productId,
        );

        if (!product) {
          throw new Error(`Produk ${item.name} tidak ditemukan`);
        }

        if (item.qty > product.stock) {
          throw new Error(
            `Stock ${item.name} tidak cukup. Stock Tersedia: ${product.stock}`,
          );
        }
      }
      // Simpan Transaksi
      const transactionId = await createTransaction({
        items: cartItems,
        total: grandTotal,
        paidAmount,
        paymentMethod,
      });

      //  Kurangi stock setiap product
      for (const item of cartItems) {
        const product = products.find(
          (product) => product.id === item.productId,
        );

        if (!product) continue;

        const newStock = product.stock - item.qty;

        await updateProduct(product.id, {
          name: product.name,
          sku: product.sku,
          price: product.price,
          stock: newStock,
          category: product.category,
        });

        console.log(`Stock ${product.name}: ${product.stock} -> ${newStock}`);
      }

      // masuk ke halaman detail transaksi
      router.push("/transactions/" + transactionId);
    } catch (error) {
      console.error("Chekout gagal:", error);
      alert(error instanceof Error ? error.message : "Checkout Gagal");
    }

    // Ini Kode Sebelum ada Update
    // const payload = {
    //   items: cartItems,
    //   subtotal,
    //   discount,
    //   grandTotal,
    //   paymentMethod,
    // };

    // console.log("checkout payload", payload);
    // alert("Checkout berhasil disiapkan. Lihat Console");
  }
  return (
    <div className="space-y-6">
      {/* Header Kasir */}
      <div>
        <p className="text-sm font-bold text-indigo-600">KASIR / POS</p>

        <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-400">
          Transaksi Baru
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Pilih produk dan buat transaksi penjualan.
        </p>
      </div>

      {/* Layout Utama */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        {/* Panel Produk */}
        <section className="min-w-0">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            {/* Pencarian */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Cari Produk
              </label>

              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama produk atau SKU..."
                className="w-full"
              />
            </div>

            {/* Filter Kategori */}
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                { value: "semua", label: "Semua" },
                { value: "makanan", label: "Makanan" },
                { value: "minuman", label: "Minuman" },
                { value: "snack", label: "Snack" },
              ].map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setCategory(item.value)}
                  className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                    category === item.value
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Daftar Produk */}
            <div className="mt-5">
              {loading ? (
                <div className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">
                  Memuat produk...
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="rounded-xl bg-slate-50 p-8 text-center text-sm text-slate-500">
                  Produk tidak ditemukan.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="rounded-2xl border border-slate-200 p-4 transition hover:border-indigo-300 hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-bold text-slate-900">
                            {product.name}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {product.sku}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-lg px-2 py-1 text-xs font-bold ${
                            product.stock <= 5
                              ? "bg-amber-50 text-amber-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          Stok {product.stock}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span className="font-black text-indigo-600">
                          {formatCurrency(product.price)}
                        </span>

                        <Button
                          onClick={() => handleAddCart(product)}
                          disabled={product.stock <= 0}
                        >
                          {product.stock <= 0 ? "Habis" : "Tambah"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Panel Keranjang */}
        {/* Panel Keranjang */}
        <section className="min-w-0">
          <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
            {/* Header Keranjang - TETAP */}
            <div className="shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Keranjang
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {cartItems.length} produk dipilih
                  </p>
                </div>

                <ShoppingCart className="text-indigo-600" size={22} />
              </div>
            </div>

            {/* Daftar Keranjang - HANYA BAGIAN INI YANG SCROLL */}
            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              {cartItems.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <ShoppingCart className="mx-auto text-slate-400" size={28} />

                  <p className="mt-3 font-bold text-slate-700">
                    Keranjang masih kosong
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Pilih produk dari daftar di sebelah kiri.
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className="rounded-xl border border-slate-200 p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="truncate font-bold text-slate-900">
                            {item.name}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            {formatCurrency(item.price)} × {item.qty}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.productId)}
                          className="shrink-0 text-xs font-bold text-rose-600 hover:text-rose-700"
                        >
                          Hapus
                        </button>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="flex items-center overflow-hidden rounded-xl border border-slate-200">
                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQty(item.productId, item.qty - 1)
                            }
                            disabled={item.qty <= 1}
                            className="grid size-9 place-items-center font-bold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            −
                          </button>

                          <Input
                            type="number"
                            min={1}
                            value={item.qty}
                            onChange={(e) =>
                              handleUpdateQty(
                                item.productId,
                                Number(e.target.value),
                              )
                            }
                            className="h-9 w-14 rounded-none border-x border-y-0 border-slate-200 px-1 text-center font-bold text-slate-900 focus-visible:ring-0"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              handleUpdateQty(item.productId, item.qty + 1)
                            }
                            className="grid size-9 place-items-center font-bold text-slate-600 transition hover:bg-slate-100"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-black text-slate-900">
                          {formatCurrency(item.subtotal)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pembayaran + Checkout - TETAP */}
            {cartItems.length > 0 && (
              <div className="mt-5 shrink-0 border-t border-slate-200 pt-5">
                <h3 className="font-black text-slate-900">Pembayaran</h3>

                <div className="mt-4">
                  <label className="block text-sm font-bold text-slate-700">
                    Discount
                  </label>

                  <Input
                    type="number"
                    min={0}
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-bold text-slate-700">
                    Metode Pembayaran
                  </label>

                  <select
                    value={paymentMethod}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as PaymentMethod)
                    }
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 text-sm text-slate-900"
                  >
                    <option value="cash">Cash</option>
                    <option value="transfer">Transfer</option>
                    <option value="qris">QRIS</option>
                  </select>
                </div>

                <div className="mt-5 space-y-2 border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>

                    <span className="font-semibold text-slate-700">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Discount</span>

                    <span className="font-semibold text-slate-700">
                      - {formatCurrency(discount)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                    <span className="font-bold text-slate-900">
                      Grand Total
                    </span>

                    <span className="text-xl font-black text-indigo-600">
                      {formatCurrency(grandTotal)}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-bold text-slate-700">
                    Jumlah Dibayar
                  </label>

                  <Input
                    type="number"
                    min={0}
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    placeholder="Masukkan jumlah pembayaran"
                    className="mt-1"
                  />
                </div>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-50 p-4">
                  <span className="font-bold text-emerald-700">Kembalian</span>

                  <span className="text-xl font-black text-emerald-700">
                    {formatCurrency(changeAmount)}
                  </span>
                </div>

                <Button
                  type="button"
                  disabled={cartItems.length === 0}
                  onClick={handleCheckout}
                  className="mt-4 w-full"
                >
                  Checkout
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
