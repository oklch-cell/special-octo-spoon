"use client";

import { type ReactNode, createContext, useState, useContext } from "react";
import { useStore } from "zustand";
import { type UserStore, createUserStore } from "@/stores/user-store";

export type UserStoreApi = ReturnType<typeof createUserStore>;

export const UserStoreContext = createContext<UserStoreApi | undefined>(
    undefined,
);

export interface UserStoreProviderProps {
    children: ReactNode,
}

export const UserStoreProvider = ({ children }: UserStoreProviderProps) => {
    const [store] = useState(() => createUserStore());

    return (
        <UserStoreContext.Provider value={store}>
            {children}
        </UserStoreContext.Provider>
    );
}

export const useUserStore = <T,>( selector: (store: UserStore) => T, ): T => {
    const useStoreContext = useContext(UserStoreContext);
    if (!useStoreContext) {
        throw new Error("useUserStore must be used within UserStoreProvider!");
    }

    return useStore(useStoreContext, selector);
}
