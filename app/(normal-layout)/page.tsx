"use client";

import { useEffect, useState } from "react";
import { useProductStore } from "@/providers/product-store-provider";
import { useUserStore } from "@/providers/user-store-provider";
import ProductCard from "@/components/web/product-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Loading from "./loading";

export default function HomePage() {

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = currentPage * itemsPerPage;

    const [loading, setLoading] = useState(false);

    const { productSet, products } = useProductStore(state => state);
    const { userSet } = useUserStore(state => state);

    useEffect(() => {
        async function getProducts() {
            setLoading(true);
            const response = await fetch("/api/products");
            const { success, data, error } = await response.json();
            if (success) {
                productSet(data);
            } else {
                console.error(error);
            }
        }
        async function getUser() {
            const response = await fetch("/api/users", {
                credentials: "include",
            });

            const { success, data, error } = await response.json();
            if (success) {
                userSet(data);
            } else {
                console.error(error);
            }
            setLoading(false);
        }

        getProducts().then(() => null);
        getUser().then(() => null);
    }, [productSet, userSet]);

    const handlePageChange = (s: string) => {
        if (s === "previous") {
            setCurrentPage(prev => prev - 1);
        }
        if (s === "next") {
            setCurrentPage(prev => prev + 1);
        }
    }

    if (loading) {
        return <Loading />
    }

  return (
    <main className="grid grid-rows-[1fr_auto]">
        <div className="grid xl:grid-cols-5 xl:grid-rows-2 lg:grid-cols-4 lg:grid-rows-3 md:grid-cols-3 md:grid-rows-4 sm:grid-cols-2 sm:grid-rows-5   w-full h-full gap-5 p-5 max-w-300 mx-auto place-content-center place-items-center">
            {products.slice(startIndex, endIndex).map(product => (
                <ProductCard product={product} key={product._id} />
             ))}
        </div>
        <div className="p-5 flex items-center justify-center gap-2">
            <Button variant="outline" disabled={currentPage === 1} onClick={() => handlePageChange("previous")}><ArrowLeft /> Previous</Button>
            <Button variant="outline">{currentPage}</Button>
            <Button variant="outline" disabled={Math.ceil(products.length / itemsPerPage) === currentPage} onClick={() => handlePageChange("next")}>Next <ArrowRight /></Button>
        </div>
    </main>
  );
}
