"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";
import { useEffect, useState } from "react";

export type Order = {
  _id: string;
  price: number;
  status: string;
  products: [
    {
      product: string;
      name: string;
      quantity: number;
      _id: string;
    },
  ];
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[] | []>([]);

  useEffect(() => {
    async function getOrders() {
      const response = await fetch("/api/orders", {
        method: "GET",
        credentials: "include",
      });
      const { success, data, error } = await response.json();

      if (success) {
        setOrders(data);
      } else {
        console.error(error);
      }
    }

    getOrders().then(() => console.log("DONE!!!"));
  }, []);

  return (
    <main className="max-w-7xl w-full p-5 mx-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Amount Paid</TableHead>
            <TableHead>Product Information</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order._id}>
              <TableCell className="font-medium">{order._id}</TableCell>
              <TableCell>${order.price}</TableCell>
              <TableCell>
                <ul>
                  {order.products.map((product) => (
                    <li key={product._id}>
                      ID: {product.product} QUANTITY: {product.quantity}
                    </li>
                  ))}
                </ul>
              </TableCell>
              <TableCell>{order.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </main>
  );
}
