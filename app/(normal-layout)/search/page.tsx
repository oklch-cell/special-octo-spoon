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
        <main className="grid xl:grid-cols-5 xl:grid-rows-2 lg:grid-cols-4 lg:grid-rows-3 md:grid-cols-3 md:grid-rows-4 sm:grid-cols-2 sm:grid-rows-5 w-full h-full gap-5 p-5 max-w-300 mx-auto place-content-center place-items-center">
            {
                filtered.map(product => (
                    <ProductCard key={product._id} product={product} />
                ))
            }
        </main>
    )
}
