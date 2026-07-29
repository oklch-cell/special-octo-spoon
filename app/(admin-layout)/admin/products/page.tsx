"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { useProduct } from "@/stores";
import { useEffect } from "react";
import Link from "next/link";
import { Edit2 } from "lucide-react";

export default function ProductsPage() {
  const { products, productSet } = useProduct();

  useEffect(() => {
    const getProducts = async () => {
      const response = await fetch("/api/products");
      const { success, data, error } = await response.json();

      if (success) {
        productSet(data);
        console.log(data);
      } else {
        console.error(error);
      }
    };
    getProducts().then(() => null);
  }, [productSet, products]);

  return (
    <main className="max-w-7xl w-full p-5 mx-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product._id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>{product?.orders?.length || 0}</TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>
                <Link
                  className="cursor-pointer flex items-center"
                  href={`/admin/products/${product._id}`}
                >
                  <Edit2 size={16} />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
