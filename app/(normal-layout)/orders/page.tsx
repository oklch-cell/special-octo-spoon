import { OrdersInitializer } from "@/components/web";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const cookieStore = await cookies();

async function ordersGet() {
  const response = await fetch(`${API_URL}/api/orders`, {
    method: "GET",
    headers: {
      Cookie: cookieStore.toString(),
    },
    credentials: "include",
  });

  const { success, data, error } = await response.json();

  if (success) {
    return data;
  } else {
    console.log("[ERROR_FETCHING_ORDER]:", error);
  }
}

export default async function OrdersPage() {
  const orders = await ordersGet();

  return <OrdersInitializer orders={orders} />;
}
