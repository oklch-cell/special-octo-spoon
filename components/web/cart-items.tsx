"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, LucideMinus, Trash2 } from "lucide-react";
import { useCart } from "@/stores";

export function CartItems() {
  const {
    cartItems,
    cartItemQtyIncrease,
    cartItemQtyDecrease,
    cartItemRemove,
  } = useCart();

  return (
    <div className="p-5 border-2 border-accent flex flex-col gap-2 rounded-lg flex-1">
      {cartItems.length > 0 ? (
        cartItems.map((cartItem) => (
          <div
            key={cartItem.product._id}
            className="flex gap-2 p-2 border border-accent rounded-lg"
          >
            <Image
              src={cartItem.product.image}
              alt="Product Image"
              loading="eager"
              width={50}
              height={50}
              className="h-auto w-auto aspect-square object-cover rounded-lg"
            />
            <div className="flex-1 flex flex-col justify-between">
              <strong>{cartItem.product.name}</strong>
              <div className="font-medium">
                Price: ${cartItem.product.price}
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <Button
                variant="outline"
                onClick={() => cartItemRemove(cartItem)}
              >
                <Trash2 className="text-red-500" size={16} />
              </Button>
              <div className="flex items-center gap-1">
                <button
                  className="p-1 rounded-full border border-accent cursor-pointer"
                  onClick={() => cartItemQtyDecrease(cartItem)}
                >
                  <LucideMinus size={16} />
                </button>
                <span>{cartItem.quantity}</span>
                <button
                  className="p-1 rounded-full border border-accent cursor-pointer"
                  disabled={cartItem.quantity === cartItem.product.quantity}
                  onClick={() => cartItemQtyIncrease(cartItem)}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="h-full flex items-center justify-center">
          No items in the cart
        </div>
      )}
    </div>
  );
}
