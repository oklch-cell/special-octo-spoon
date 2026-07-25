"use client";

import {useEffect, useState} from "react";
import Image from "next/image";
import {LucideMinus, Plus} from "lucide-react";
import {useUserStore} from "@/providers/user-store-provider";
import {Button} from "@/components/ui/button";
import Modal from "@/components/web/modal";
import {Field, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";

type CartItem = {
    _id: string;
    user: string;
    quantity: number;
    product: {
        _id: string;
        name: string;
        quantity: number;
        price: number;
        images: [string];
    }
}

export default function CartPage() {
    const [items, setItems] = useState<[CartItem] | []>([]);
    const [total, setTotal] = useState(0);
    const [reRender, setReRender] = useState(true);
    const [open, setOpen] = useState(false);
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);

    const {user, userSet} = useUserStore(state => state);

    useEffect(() => {
        async function getItems() {
            const response = await fetch("/api/cart-items", {
                credentials: "include",
            });
            const {success, data, error} = await response.json();

            if (success) {
                setItems(data);
                console.log(data);
                setTotal(0);
            } else {
                console.error(error);
            }
        }

        getItems().then(() => null);
    }, [reRender]);

    useEffect(() => {
        items.map(item => (
            setTotal(prev => prev + (item.quantity * item.product.price))
        ));
    }, [items]);

    const handleAddAddress = async () => {
        const response = await fetch("/api/users", {
            method: "PUT",
            body: JSON.stringify({address, phone}),
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

    const handleCheckout = async () => {
        setLoading(true);
        try {

        } catch (e) {
            console.error("[ERROR]:", e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="max-w-300 mx-auto w-full p-5 flex gap-5 flex-col lg:flex-row">
            <div className="flex flex-col gap-3 flex-1">
                {items.length ?
                    items.map(item => {

                        const handleIncrease = async () => {
                            const response = await fetch(`/api/cart-items/${item._id}`, {
                                method: "PUT",
                                credentials: "include",
                                body: JSON.stringify({qty: 1}),
                            });
                            const {success} = await response.json();

                            if (success) {
                                setReRender(prev => !prev);
                            } else {
                                return;
                            }
                        }

                        const handleDecrease = async () => {
                            const response = await fetch(`/api/cart-items/${item._id}`, {
                                method: "PUT",
                                credentials: "include",
                                body: JSON.stringify({qty: -1}),
                            });
                            const {success} = await response.json();

                            if (success) {
                                setReRender(prev => !prev);
                            } else {
                                return;
                            }
                        }

                        return (
                            <div key={item._id}
                                 className="border border-accent rounded-lg p-3 max-w-100 md:max-w-150 flex items-center gap-2">
                                <div>
                                    <Image src={item.product.images[0]} alt="Product Image" width={50} height={50}
                                           className="h-auto w-auto max-w-12.5 max-h-12.5 aspect-square rounded-lg object-cover"/>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <strong>{item.product.name}</strong>
                                    <span className="font-medium">Price: ${item.product.price}</span>
                                </div>
                                <div className="flex items-center gap-1.5 flex-1 justify-end">
                                    <button disabled={item.quantity === 0} onClick={handleDecrease}
                                            className="border border-accen rounded-full p-1 cursor-pointer"><LucideMinus
                                        size={16}/></button>
                                    {item.quantity}
                                    <button disabled={item.quantity === item.product.quantity} onClick={handleIncrease}
                                            className="border border-accen rounded-full p-1 cursor-pointer"><Plus
                                        size={16}/></button>
                                </div>
                            </div>
                        )
                    }) :
                    (<div className="flex items-center justify-center font-medium text-xl h-full border border-accent rounded-lg">
                        No Items In The Cart
                    </div>)
                }
            </div>
            <div className="p-5 border border-accent rounded-lg flex-1 max-h-max flex flex-col gap-2">
                <strong className="text-xl">Order Summery</strong>
                <div className="flex items-center justify-between">
                    <strong>Delivery Address</strong><p>{user?.address.length ? user.address :
                    <Button onClick={() => setOpen(true)}>Add Address</Button>}</p>
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
                        <Button onClick={handleAddAddress}>ADD</Button>
                    </div>
                </Modal>
                <div className="flex items-center justify-between">
                    <strong>Total</strong><span className="font-medium">${total}</span>
                </div>
                <Button onClick={handleCheckout}
                        disabled={loading}>{loading ? "Please wait..." : "Proceed to Checkout"}</Button>
            </div>
        </main>
    );
}
