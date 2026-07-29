"use client";

import Image from "next/image";
import { Button } from "@/components/ui";
import toast from "react-hot-toast";
import { useCart, type Product } from "@/stores";
import { useRouter } from "next/navigation";

export function ProductViewInitializer({ product }: { product: Product }) {
  const { cartItemAdd } = useCart();
  const router = useRouter();

  const handleAddToCart = () => {
    const item = {
      quantity: 1,
      product: {
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity: product.quantity,
      },
    };

    cartItemAdd(item);
    toast.success("Product added to the cart");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/cart");
  };

  return (
    <main className="max-w-200 mx-auto w-full p-5 flex items-center justify-center">
      <div className="flex flex-col border border-accent p-5 rounded-lg gap-2">
        <Image
          src={product.images[0]}
          loading="eager"
          alt={product.name}
          width={300}
          height={300}
          className="h-auto w-auto max-w-72 max-h-72 md:max-w-100 md:max-h-100 object-cover rounded-lg aspect-square border"
        />
        <div>
          <h1 className="font-bold text-2xl">{product.name}</h1>
          <p className="h-auto font-medium truncate max-w-72 md:max-w-100">
            {product.description}
          </p>
        </div>
        <div className="font-medium">
          <span className="text-xl">${product.price}</span>
          <div className="flex items-center gap-8 ">
            <span>Stock: {product.quantity}</span>
            <span className="font-medium">Category: {product.category}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleBuyNow} className="w-35 md:w-49 text-center">
            BUY NOW
          </Button>
          <Button
            onClick={handleAddToCart}
            className="w-35 md:w-49 text-center"
            variant="outline"
          >
            ADD TO CART
          </Button>
        </div>
      </div>
    </main>
  );
}
