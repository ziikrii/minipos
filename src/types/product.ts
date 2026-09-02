export type Product ={
  id:string;
  name:string;
  sku:string;
  price:number;
  stock:number;
};

export type ProductInput = Omit<Product, "id">; // Omit artinya "Omit" artinya adalah menghapus atau mengecualikan properti tertentu dari tipe yang ada. Dalam konteks ini, `ProductInput` adalah tipe yang sama dengan `Product`, tetapi tanpa properti `id`. Jadi, `ProductInput` hanya akan memiliki properti `name`, `sku`, `price`, dan `stock`. 