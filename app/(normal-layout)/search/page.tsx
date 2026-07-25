"use client";

import { useProductStore } from "@/providers/product-store-provider";
import {useEffect, useState} from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/web/product-card";

export default function SearchPage() {
    const { products, productSet } = useProductStore(state => state);
    const [filtered, setFiltered] = useState<typeof products | []>([]);
    const searchParams = useSearchParams();
    const category = searchParams.get("category");
    const query = searchParams.get("q");

    useEffect(() => {
        const getProducts = async () => {
            if (!products || !products.length) {
                const response = await fetch("/api/products");
                const { success, data, error } = await response.json();

                if (success) {
                    productSet(data);
                    console.log(data);
                } else {
                    console.error(error);
                }
            }
        }

        getProducts().then(() => setFiltered(products.filter(product => product.category === category && product.name.includes(query as string))));

    }, [productSet, products, category, query]);

    return (
        <main className="grid grid-cols-5 grid-rows-2 max-w-300 w-full mx-auto p-5 gap-5">
            {
                filtered.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))
            }
        </main>
    )
}
