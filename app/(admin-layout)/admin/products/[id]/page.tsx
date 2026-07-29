"use client";

import { useEffect, useState, SubmitEventHandler } from "react";
import { Product } from "@/stores";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Field,
  FieldLabel,
  Input,
  Textarea,
  Button,
} from "@/components/ui";
import { SelectCategory } from "@/components/web";
import toast from "react-hot-toast";
import { useRouter, useParams } from "next/navigation";

export default function ProductUpdatePage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(`/api/products/${params.id}`);
      const { success, data, error } = await response.json();

      if (success) {
        setProduct(data.product);
        console.log(data);
      } else {
        console.log(error);
      }
    };

    fetchProduct().then(() => {
      setName(product?.name as string);
      setCategory(product?.category as string);
      setPrice(product?.price as number);
      setDescription(product?.description as string);
      setQuantity(product?.quantity as number);
    });
  }, [
    params.id,
    product?.name,
    product?.category,
    product?.price,
    product?.quantity,
    product?.description,
  ]);

  const handleUpdate: SubmitEventHandler = async (e) => {
    e.preventDefault();

    const response = await fetch(`/api/products/${product?._id}`, {
      method: "PUT",
      body: JSON.stringify({ name, price, category, description, quantity }),
      credentials: "include",
    });
    const { success, error } = await response.json();

    if (success) {
      toast.success("Product updated successfully!");
      router.push("/admin/products");
    } else {
      console.error(error);
      toast.error(error);
    }
  };

  return (
    <main className="max-w-5xl w-full mx-auto p-5 flex items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleUpdate}
            className="flex flex-col justify-between gap-5"
          >
            <Field>
              <FieldLabel htmlFor="product-name">Product Name</FieldLabel>
              <Input
                id="product-name"
                value={name || ""}
                onChange={(e) => setName(e.target.value)}
                type="text"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="description">Product Description</FieldLabel>
              <Textarea
                id="description"
                value={description || ""}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Type here..."
              ></Textarea>
            </Field>
            <div className="flex gap-4">
              <Field>
                <FieldLabel htmlFor="price">Price</FieldLabel>
                <Input
                  id="price"
                  type="number"
                  value={price || ""}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
                <Input
                  id="quantity"
                  type="number"
                  value={quantity || ""}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </Field>
              <SelectCategory
                setValue={setCategory}
                widthFull={true}
                label={true}
              />
            </div>
            <div className="flex justify-end w-full">
              <Button type="submit">UPDATE PRODUCT</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
