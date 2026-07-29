"use client";

import { Field, FieldLabel, Input, Button } from "@/components/ui";
import { Modal } from "@/components/web";
import { useUser, useCart, type CartItem } from "@/stores";
import { useState, useEffect } from "react";

import toast from "react-hot-toast";

export function CheckOut() {
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const { user, userSet } = useUser();
  const { cartItems } = useCart();

  const handleCreateOrder = async () => {
    const products = cartItems.map((cartItem) => ({
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
  };

  const handleCheckout = async () => {
    setLoading(true);
    if (!user?.address || !user?.address?.length) {
      toast.error("Please add the address!");
      return;
    }
    const { _id } = await handleCreateOrder();

    const response = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({ cartItems, orderId: _id }),
      credentials: "include",
    });
    const data = await response.json();

    window.location.href = data.url;
  };

  const handleAddress = async () => {
    const response = await fetch("/api/users", {
      method: "PUT",
      body: JSON.stringify({ address, phone }),
      credentials: "include",
    });
    const { success, data, error } = await response.json();

    if (success) {
      console.log(data);
      userSet(data);
      setOpen(false);
    } else {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    function calcTotal(cartItems: CartItem[]) {
      setTotal(0);
      cartItems.map((cartItem) => {
        return setTotal(
          (prev) => prev + cartItem.quantity * cartItem.product.price,
        );
      });
    }
    calcTotal(cartItems);
  }, [cartItems]);

  return (
    <div className="p-5 border-2 border-accent flex-1 flex flex-col gap-2 rounded-lg max-h-max">
      <strong className="text-xl">Order Summary</strong>
      <div className="flex justify-between font-medium text-sm">
        Total: <span>${total}</span>
      </div>
      <div className="flex items-center justify-between text-sm w-full">
        <span className="font-medium">Address:</span>
        <p>
          {user?.address?.length ? (
            user.address
          ) : (
            <Button variant="outline" onClick={() => setOpen(true)}>
              Add Address
            </Button>
          )}
        </p>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="flex flex-col gap-2">
          <Field>
            <FieldLabel>Address</FieldLabel>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Add your address"
            />
          </Field>
          <Field>
            <FieldLabel>Phone</FieldLabel>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Add your phone number"
            />
          </Field>
          <Button onClick={handleAddress}>ADD</Button>
        </div>
      </Modal>
      <Button disabled={loading} onClick={handleCheckout}>
        {loading ? "Processing..." : "Proceed to checkout"}
      </Button>
    </div>
  );
}
