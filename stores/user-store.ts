import { createStore } from "zustand/vanilla";

export type User = {
    _id: string;
    name: string;
    email: string;
    address: string;
    phone: string;
    orders: string[] | [];
}

export type UserState = {
    user: User | null;
}

export type UserAction = {
    userSet: (data: User | null) => void;
}

export type UserStore = UserState & UserAction;

export const defaultState: UserState = {
    user: null,
}

export const createUserStore = (initState: UserState = defaultState) => {
    return createStore<UserStore>()((set) => ({
        ...initState,
        userSet: (data) => {
            set({ user: data });
        }
    }))
}
