export type ProductCategory = "makanan" | "minuman" | "snack";

export type Product = {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: ProductCategory;
};
export type ProductInput = Omit<Product, "id">;
