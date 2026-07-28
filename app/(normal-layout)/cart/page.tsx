"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Plus, LucideMinus, Trash2 } from "lucide-react";
import { useCart, CartItem } from "@/stores/cart-store";
import { useEffect, useState } from "react";
import Modal from "@/components/web/modal";
import { useUserStore } from "@/providers/user-store-provider";
import toast from "react-hot-toast";

export default function CartPage() {
    const { cartItems, cartItemQtyIncrease, cartItemQtyDecrease, cartItemRemove } = useCart();
    const { user, userSet } = useUserStore(state => state);

    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");

    useEffect(() => {
        function calcTotal(cartItems: CartItem[]) {
            setTotal(0);
            cartItems.map((cartItem) => {
                return setTotal(prev => prev + (cartItem.quantity * cartItem.product.price));
            });
        }
        calcTotal(cartItems);
    }, [cartItems]);

    const handleCreateOrder = async () => {
        const products = cartItems.map(cartItem => ({
            product: cartItem.product._id,
            quantity: cartItem.quantity,
            name: cartItem.product.name,
        }));

        const response = await fetch("/api/orders", {
            method: "POST",
            body: JSON.stringify({ products, address: user?.address, price: total }),
            credentials: "include",
        });
        const { success, data, error } = await response.json();

        if (success) {
            console.log("ORDER:", data);
            return data;
        } else {
            console.error(error);
        }
    }

    const handleCheckout = async () => {
        if (!user?.address || !user.address.length) {
            setLoading(false);
            toast.error("Please add the address!");
            return;
        }
        setLoading(true);
        const { _id } = await handleCreateOrder();

        const response = await fetch("/api/checkout", {
            method: "POST",
            body: JSON.stringify({ cartItems, orderId: _id }),
            credentials: "include",
        });
        const data = await response.json();

        window.location.href = data.url;

        setLoading(false);
    }

    const handleAddress = async () => {
        const response = await fetch("/api/users", {
            method: "PUT",
            body: JSON.stringify({ address, phone }),
            credentials: "include",
        });
        const {success, data, error} = await response.json();

        if (success) {
            console.log(data);
            userSet(data);
            setOpen(false);
        } else {
            console.error(error);
        }
    }

    return (
        <main className="p-5 flex flex-col md:flex-row gap-5 max-w-200 w-full mx-auto">
            <div className="p-5 border-2 border-accent flex flex-col gap-2 rounded-lg flex-1">
                { (cartItems.length > 0) ?
                    cartItems.map(cartItem => (
                        <div key={cartItem.product._id} className="flex gap-2 p-2 border border-accent rounded-lg">
                            <Image src={cartItem.product.image} alt="Product Image" loading="eager" width={50} height={50} className="h-auto w-auto aspect-square object-cover rounded-lg" />
                            <div className="flex-1 flex flex-col justify-between">
                                <strong>{cartItem.product.name}</strong>
                                <div className="font-medium">Price: ${cartItem.product.price}</div>
                            </div>
                            <div className="flex flex-col justify-between">
                                <Button variant="outline" onClick={() => cartItemRemove(cartItem)}><Trash2 className="text-red-500" size={16} /></Button>
                                <div className="flex items-center gap-1">
                                    <button className="p-1 rounded-full border border-accent cursor-pointer" onClick={() => cartItemQtyDecrease(cartItem)}><LucideMinus size={16} /></button>
                                    <span>{cartItem.quantity}</span>
                                    <button className="p-1 rounded-full border border-accent cursor-pointer" disabled={cartItem.quantity === cartItem.product.quantity} onClick={() => cartItemQtyIncrease(cartItem)}><Plus size={16} /></button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="h-full flex items-center justify-center">
                            No items in the cart
                        </div>
                    )
                }
            </div>
            <div className="p-5 border-2 border-accent flex-1 flex flex-col gap-2 rounded-lg max-h-max">
                <strong className="text-xl">Order Summary</strong>
                <div className="flex justify-between font-medium text-sm">Total: <span>${total}</span></div>
                <div className="flex items-center justify-between text-sm w-full">
                    <span className="font-medium">Address:</span><p>{user?.address.length ? user.address :
                    <Button variant="outline" onClick={() => setOpen(true)}>Add Address</Button>}</p>
                </div>
                <Modal open={open} onClose={() => setOpen(false)}>
                    <div className="flex flex-col gap-2">
                        <Field>
                            <FieldLabel>Address</FieldLabel>
                            <Input value={address} onChange={e => setAddress(e.target.value)}
                                   placeholder="Add your address"/>
                        </Field>
                        <Field>
                            <FieldLabel>Phone</FieldLabel>
                            <Input value={phone} onChange={e => setPhone(e.target.value)}
                                   placeholder="Add your phone number"/>
                        </Field>
                        <Button onClick={handleAddress}>ADD</Button>
                    </div>
                </Modal>
                <Button onClick={handleCheckout} disabled={loading}>{ loading ? "Processing..." : "Proceed to checkout" }</Button>
            </div>
        </main>
    )
}
