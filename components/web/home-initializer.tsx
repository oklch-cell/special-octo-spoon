"use client";

import { useState } from "react";
import { ProductCard } from "@/components/web";
import { Button } from "@/components/ui";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useProduct } from "@/stores";

export default function HomeInitializer() {
  const [current, setCurrent] = useState(1);

  const start = (current - 1) * 10;
  const end = current * 10;

  const { products } = useProduct();

  const handlePageChange = (s: string) => {
    if (s === "previous") {
      setCurrent((prev) => prev - 1);
    }
    if (s === "next") {
      setCurrent((prev) => prev + 1);
    }
  };

  return (
    <main className="grid grid-rows-[1fr_auto]">
      <div className="grid xl:grid-cols-5 xl:grid-rows-2 lg:grid-cols-4 lg:grid-rows-3 md:grid-cols-3 md:grid-rows-4 sm:grid-cols-2 sm:grid-rows-5   w-full h-full gap-5 p-5 max-w-300 mx-auto place-content-center place-items-center">
        {products.slice(start, end).map((product) => (
          <ProductCard product={product} key={product._id} />
        ))}
      </div>
      <div className="p-5 flex items-center justify-center gap-2">
        <Button
          variant="outline"
          disabled={current === 1}
          onClick={() => handlePageChange("previous")}
        >
          <ArrowLeft /> Previous
        </Button>
        <Button variant="outline">{current}</Button>
        <Button
          variant="outline"
          disabled={Math.ceil(products.length / 10) === current}
          onClick={() => handlePageChange("next")}
        >
          Next <ArrowRight />
        </Button>
      </div>
    </main>
  );
}
