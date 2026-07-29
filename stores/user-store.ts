import { create } from "zustand";

export type User = {
  _id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  orders: string[] | [];
};

export type UserState = {
  user: User | null;
};

export type UserAction = {
  userSet: (data: User | null) => void;
};

export const useUser = create<UserState & UserAction>()((set) => ({
  user: null,

  userSet: (user) => set({ user }),
}));
