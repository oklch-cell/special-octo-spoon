import { create } from "zustand";

export type Product = {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  description: string;
  images: string[];
  orders: string[] | [];
  category: string;
};

export type ProductState = {
  products: Product[];
};

export type ProductAction = {
  productSet: (data: Product[]) => void;
};

export const useProduct = create<ProductState & ProductAction>()((set) => ({
  products: [],

  productSet: (products) => set({ products }),
}));
