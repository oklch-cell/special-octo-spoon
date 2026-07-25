import { createStore } from "zustand/vanilla";

export type Product = {
    _id: string;
    name: string;
    price: number;
    quantity: number;
    description: string;
    images: string[];
    orders: string[] | [] | null;
    category: string;
}

export type ProductState = {
    products: Product[];
}

export type ProductAction = {
    productSet: (data: Product[]) => void;
    productAdd: (data: Product) => void;
}

export type ProductStore = ProductState & ProductAction;

export const defaultState: ProductState = {
    products: []
}

export const createProductStore = (initState: ProductState = defaultState) => {
    return createStore<ProductStore>()((set) => ({
        ...initState,
        productSet: (data) => {
            set({ products: data });
        },
        productAdd: (data) => {
            set(({ products }) => ({ products: [ data, ...products ] }));
        }
    }))
}
