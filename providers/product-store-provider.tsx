"use client";

import { type ReactNode, createContext, useState, useContext } from "react";
import { useStore } from "zustand";
import { type ProductStore, createProductStore } from "@/stores/product-store";

export type ProductStoreApi = ReturnType<typeof createProductStore>;

export const ProductStoreContext = createContext<ProductStoreApi | undefined>(
    undefined,
);

export interface ProductStoreProviderProps {
    children: ReactNode;
}

export const ProductStoreProvider = ({ children }: ProductStoreProviderProps) => {
    const [store] = useState(() => createProductStore());

    return (
        <ProductStoreContext.Provider value={store}>
            {children}
        </ProductStoreContext.Provider>
    )
}

export const useProductStore = <T,>(selector: ( store: ProductStore ) => T,): T => {
    const useStoreContext = useContext(ProductStoreContext);
    if (!useStoreContext) {
        throw new Error("useProductStore must be used within ProductStoreProvider!");
    }

    return useStore(useStoreContext, selector);
}
