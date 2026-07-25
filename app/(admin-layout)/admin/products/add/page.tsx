"use client"

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SelectCategory from "@/components/web/select-category";
import { useState, useRef, ChangeEvent, SubmitEventHandler } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useProductStore } from "@/providers/product-store-provider";
import { useRouter } from "next/navigation";

const CLOUDINARY_API = process.env.NEXT_PUBLIC_CLOUDINARY_API;
if (!CLOUDINARY_API) {
    throw new Error("CLOUDINARY_API is undefined!");
}

export default function AddProductPage() {
    const imagesRef = useRef<File[] | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(0);
    const [category, setCategory] = useState("");
    const [images] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    const router = useRouter();
    const { productAdd } = useProductStore(state => state);

    const handleImages = (e: ChangeEvent<HTMLInputElement>)=> {
        if (e.target.files) {
            imagesRef.current = Object.values(e.target.files);
        }
    }

    const handleUpload = async () => {
       setUploading(true);
        if (imagesRef.current) {
           for (const image of imagesRef.current) {
               const formData = new FormData();
               formData.append("file", image);
               formData.append("upload_preset", "test-project");

               const response = await fetch(CLOUDINARY_API!, {
                   method: "POST",
                   body: formData,
               });

               const json = await response.json();
               images.push(json.url);
           }
       }
        setUploading(false);
    }

    const handleAddProduct: SubmitEventHandler = async (e) => {
        e.preventDefault();
        if (!images) {
            return;
        }
        const formData = { name, price, description, quantity, category, images };
        const response = await fetch("/api/products", {
            method: "POST",
            body: JSON.stringify(formData),
            credentials: "include",
        });

        const { success, data, error } = await response.json();
        if (success) {
            console.log(data);
            productAdd(data);
            router.push("/");
        } else {
            console.error(error);
        }
    }

    return (
        <main className="max-w-5xl w-full mx-auto p-5 flex items-center justify-center">
            <Card>
                <CardHeader>
                    <CardTitle>Add Product</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAddProduct} className="flex flex-col justify-between gap-5">
                        <Field>
                            <FieldLabel htmlFor="product-name">Product Name</FieldLabel>
                            <Input id="product-name" value={name} onChange={e => setName(e.target.value)} type="text"/>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="description">Product Description</FieldLabel>
                            <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Type here..."></Textarea>
                        </Field>
                        <div className="flex gap-4">
                            <Field>
                                <FieldLabel htmlFor="price">Price</FieldLabel>
                                <Input id="price" type="number" value={price} onChange={e => setPrice(Number(e.target.value))} />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="quantity">Quantity</FieldLabel>
                                <Input id="quantity" type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
                            </Field>
                            <SelectCategory setValue={setCategory} widthFull={true} />
                        </div>
                        <div className="flex gap-4 items-center">
                            <Field>
                                <FieldLabel htmlFor="pictures">Pictures</FieldLabel>
                                <Input id="pictures" type="file" accept="image/*" multiple onChange={handleImages} />
                                <FieldDescription>Select picture(s) to upload.</FieldDescription>
                            </Field>
                            <Button onClick={handleUpload}>{uploading ? "UPLOADING..." : "UPLOAD"}</Button>
                        </div>
                        <div className="flex justify-end w-full">
                            <Button type="submit">ADD PRODUCT</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
