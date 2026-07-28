"use client";

import { useParams } from "next/navigation";
import {useEffect, useState} from "react";
import type { Product } from "@/stores/product-store";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useCart } from "@/stores/cart-store";
import { useRouter } from "next/navigation";
import Loading from "../../loading";

export default function ProductViewPage() {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false);

    const params = useParams();
    const { cartItemAdd } = useCart();
    const router = useRouter();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            const response = await fetch(`/api/products/${params.id}`);
            const { success, data, error } = await response.json();

            if (success) {
                setProduct(data.product);
                console.log(data);
            } else {
                console.log(error);
            }
            setLoading(false);
        }

        fetchProduct().then(() => null);
    }, [params.id]);

    if (!product) return;

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

    const handleBuyNow = () => {
        handleAddToCart();
        router.push('/cart');
    }

    if (loading) {
        return <Loading />;
    }

    return (
        <main className="max-w-200 mx-auto w-full p-5 flex items-center justify-center">
            <div className="flex flex-col border border-accent p-5 rounded-lg gap-2">
                <Image src={product.images[0]} loading="eager" alt={product.name} width={300} height={300} className="h-auto w-auto max-w-72 max-h-72 md:max-w-100 md:max-h-100 object-cover rounded-lg aspect-square border" />
                <div>
                    <h1 className="font-bold text-2xl">{product.name}</h1>
                    <p className="h-auto font-medium truncate max-w-72 md:max-w-100">{product.description}</p>
                </div>
                <div className="font-medium">
                    <span className="text-xl">${product.price}</span>
                    <div className="flex items-center gap-8 ">
                        <span>Stock: {product.quantity}</span>
                        <span className="font-medium">Category: {product.category}</span>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleBuyNow} className="w-35 md:w-49 text-center">BUY NOW</Button>
                    <Button onClick={handleAddToCart} className="w-35 md:w-49 text-center" variant="outline">ADD TO CART</Button>
                </div>
            </div>
        </main>
    )
}
