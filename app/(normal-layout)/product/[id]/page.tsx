import { ProductViewInitializer } from "@/components/web";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function productGet(id: string) {
  const response = await fetch(`${API_URL}/api/products/${id}`);

  const { success, data, error } = await response.json();

  if (success) {
    return data;
  } else {
    console.error(error);
  }
}

export default async function ProductViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { product } = await productGet(id);

  return <ProductViewInitializer product={product} />;
}
