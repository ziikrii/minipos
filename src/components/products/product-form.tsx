"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "../ui/Button";
import Input from "../ui/Input";
import type { ProductInput } from "@/types/product";
import React from "react";
import { FormErrors, validateProduct } from "@/utils/product-storage";

type ProductFormProps = {
  initialValues?: ProductInput;
  submitLabel?: string;
  onSubmit: (values: ProductInput) => void;
};

const defaultValues: ProductInput = {
  name: "",
  sku: "",
  price: 0,
  stock: 0,
};

export default function ProductForm({
  initialValues = defaultValues,
  submitLabel = "Simpan Produk",
  onSubmit,
}: ProductFormProps) {
  const [values, setValues] = useState<ProductInput>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});

  function updateField(field: keyof ProductInput, value: string) {
    setValues((current) => ({
      ...current,
      [field]: field === "price" || field === "stock" ? Number(value) : value,
    }));
  }

  function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateProduct(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }
    onSubmit(values);
  }
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="text-sm font-bold text-slate-700">
            Nama Produk
          </label>
          <Input
            value={values.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Contoh : Kopi Susu"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="text-sm font-bold text-slate-700">
            SKU
          </label>
          <Input
            value={values.sku}
            onChange={(event) => updateField("sku", event.target.value)}
            placeholder="Contoh : KOPI001"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="text-sm font-bold text-slate-700">
            Price
          </label>
          <Input
            type="number"
            value={values.price}
            onChange={(event) => updateField("price", event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="text-sm font-bold text-slate-700">
            Stock
          </label>
          <Input
            type="number"
            value={values.stock}
            onChange={(event) => updateField("stock", event.target.value)}
          />
        </div>
      </div>

      {errors.name && (
        <p className="mt-1 text-sm font-semibold text-red-600">{errors.name}</p>
      )}
      <div className="flex items-center justify-end gap-3 py-2">
        <Button variant="secondary">
          <Link href={"/products"} className="text-black">
            Batal
          </Link>
        </Button>
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}

// --------------------
// type FormErrors = Partial<Record<keyof ProductInput, string>>
// function validateProduct(value: ProductInput) {
//   const errors: FormErrors = {};

//   if (!value.name.trim()) {
//     errors.name = "Nama Produk wajib diisi";
//   }

//   if (!value.sku.trim()) {
//     errors.sku = "SKU Wajib diisi";
//   }

//   if (!value.price <= 0) {
//     errors.price = "Harga harus lebih dari 0";
//   }

//   if (value.stock < 0) {
//     errors.stock = "Stock tidak boleh minus";
//   }

//   return errors;
// }
//  --------------------------
