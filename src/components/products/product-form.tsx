"use client";
import React, { FormEvent, useEffect } from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "../ui/input";
import { ProductInput } from "@/types/product";
import { LoaderCircle } from "lucide-react";

type ProductFormProps = {
  initialValues?: ProductInput;
  submitLabel?: string;
  onSubmit: (values: ProductInput) => Promise<void>;
};

const defaultValues: ProductInput = {
  name: "",
  sku: "",
  price: 0,
  stock: 0,
  category: "makanan",
};

export function ProductForm({
  initialValues,
  submitLabel = "Simpan Produk",
  onSubmit,
}: ProductFormProps) {
  const [form, setForm] = useState<ProductInput>(
    initialValues ?? defaultValues,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialValues) setForm(initialValues);
  }, [initialValues]);

  function setField<K extends keyof ProductInput>(
    field: K,
    value: ProductInput[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.sku.trim())
      return setError("Nama dan SKU Wajib diisi.");
    if (form.price <= 0) return setError("Harga harus lebih dari 0.");
    if (form.stock < 0) return setError("Stocl tidal boleh negatif.");

    try {
      setLoading(true);
      await onSubmit({
        ...form,
        name: form.name.trim(),
        sku: form.sku.trim().toUpperCase(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan produk.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-5 rounded-2xl bg-white p-5 shadow-sm sm:p-6"
    >
      <Input
        label="Nama Produk"
        placeholder="Contoh: Kopi Susu"
        value={form.name}
        onChange={(e) => setField("name", e.target.value)}
      />
      <Input
        label="SKU"
        placeholder="Contoh: KOPI001"
        value={form.sku}
        onChange={(e) => setField("sku", e.target.value)}
      />
      <div>
        <Input
          label="Harga"
          type="number"
          min={1}
          value={form.price || ""}
          onChange={(e) => setField("price", Number(e.target.value))}
        />
        <Input
          label="Stock"
          type="number"
          min={0}
          value={form.stock}
          onChange={(e) => setField("stock", Number(e.target.value))}
        />
      </div>
      {error && (
        <div className="rounded-xl bg-rose-50 p-3 text-sm font-semibold text-rose-700">
          {error}
        </div>
      )}
      <Button type="submit" disabled={loading} className="sm:w-fit">
        {loading && <LoaderCircle size={18} className="animate-spin" />}
        {loading ? "Menyimpan.." : submitLabel}
      </Button>
    </form>
  );
}
