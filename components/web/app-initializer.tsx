"use client";

import { useProduct, useUser, type Product, type User } from "@/stores";
import { useEffect } from "react";

export function AppInitializer({
  user,
  products,
}: {
  user: User;
  products: Product[];
}) {
  useEffect(() => {
    useProduct.setState({ products });
    useUser.setState({ user });
  }, [products, user]);

  return null;
}
