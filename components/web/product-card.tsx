"use client";

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useCart } from "@/stores/cart-store";

export default function ProductCard({ product }: { product: { _id: string, name: string, images: string[], price: number, quantity: number } }) {
    const { cartItemAdd } = useCart();

    const handleAddToCart = () => {
        const item = {
            quantity: 1,
            product: {
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                quantity: product.quantity,
            }
        }

        cartItemAdd(item);
        toast.success("Product added to the cart");
    }

    return (
        <Card className="flex flex-col justify-between max-h-90 max-w-54 w-54">
            <Link href={`/product/${product._id}`} className="flex flex-col justify-between gap-2 h-full">
                <CardHeader>
                    <Image src={product.images[0]} loading="eager" alt={product.name} width={100} height={100} className="h-auto w-full rounded-lg aspect-square object-cover" />
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <span className="w-full font-medium">{product.name}</span>
                    <span className="w-full text-right">${product.price}</span>
                </CardContent>
            </Link>
            <CardFooter className="h-20 py-0">
                <Button className="w-full cursor-pointer" disabled={product.quantity === 0} onClick={handleAddToCart}>ADD TO CART</Button>
            </CardFooter>
        </Card>
    )
}
