"use client";

import { useCart } from "@/stores/cart-store";
import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
    const { cartItemsReset } = useCart();

    useEffect(() => {
        cartItemsReset();
    }, [cartItemsReset]);

    return (
        <main className="flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <strong className="text-3xl md:text-4xl">
                    Payment Successful!
                </strong>
                <Button variant="outline">
                    <Link href="/" className="flex items-center gap-5">
                        <ArrowLeft /> Home
                    </Link>
                </Button>
            </div>
        </main>
    );
}
