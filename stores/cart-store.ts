import {create} from "zustand";
import {persist} from "zustand/middleware";

export type CartItem = {
    quantity: number;
    product: {
        _id: string;
        name: string;
        price: number;
        image: string;
        quantity: number;
    }
}

export type CartState = {
    cartItems: CartItem[] | [];
}

export type CartActions = {
    cartItemAdd: (item: CartItem) => void;
    cartItemRemove: (item: CartItem) => void;
    cartItemQtyIncrease: (item: CartItem) => void;
    cartItemQtyDecrease: (item: CartItem) => void;
    cartItemsReset: () => void;
}

export const useCart = create<CartState & CartActions>()(persist(((set) => ({
    cartItems: [],
    cartItemsReset: () => {
        set({ cartItems: [] });
    },
    cartItemAdd: (item: CartItem) => {
        set((state) => {
            const existing = state.cartItems.find(cartItem => cartItem.product._id === item.product._id);
            if (existing) {
                return {
                    cartItems: state.cartItems.map(cartItem => (cartItem.product._id === item.product._id) ? {
                        ...cartItem,
                        quantity: cartItem.quantity + 1
                    } : cartItem),
                }
            } else {
                return {cartItems: [...state.cartItems, item]}
            }
        })
    },
    cartItemRemove: (item: CartItem) => {
        set(({cartItems}) => ({cartItems: cartItems.filter(cartItem => cartItem.product._id !== item.product._id)}));
    },
    cartItemQtyIncrease: (item: CartItem) => {
        set((state) => ({
            cartItems: state.cartItems.map(cartItem => (cartItem.product._id === item.product._id) ? {
                ...cartItem,
                quantity: cartItem.quantity + 1
            } : cartItem),
        }));
    },
    cartItemQtyDecrease: (item: CartItem) => {
        set((state) => {
            const existing = state.cartItems.find(cartItem => cartItem.product._id === item.product._id);
            if (existing && existing.quantity === 1) {
                return {
                    cartItems: state.cartItems.filter(cartItem => cartItem.product._id !== item.product._id)
                }
            } else {
                return {
                    cartItems: state.cartItems.map(cartItem => (cartItem.product._id === item.product._id) ? {
                        ...cartItem,
                        quantity: cartItem.quantity - 1
                    } : cartItem)
                }
            }
        })
    },
})), {name: "cart-storage"}));
