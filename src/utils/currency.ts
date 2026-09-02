import React from 'react'

export default function formatCurrency(value: number) {
  return (
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value)
  );
}