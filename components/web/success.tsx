"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui";
import { useCart } from "@/stores";
import { useEffect } from "react";

export function Success() {
  const { cartItemsReset } = useCart();

  useEffect(() => {
    cartItemsReset();
  }, [cartItemsReset]);

  return (
    <div className="flex flex-col items-center gap-3">
      <strong className="text-2xl md:text-3xl">Payment Successful!</strong>
      <Button variant="outline">
        <Link href="/" className="flex items-center gap-5">
          <ArrowLeft /> Home
        </Link>
      </Button>
    </div>
  );
}
