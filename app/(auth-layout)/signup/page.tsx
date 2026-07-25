"use client";

import { Card, CardTitle, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup, FieldError } from "@/components/ui/field";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/zod-schema";
import type { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/providers/user-store-provider";
import toast from "react-hot-toast";

type Inputs = {
    name: string;
    email: string;
    password: string;
}

export default function SignUpPage() {
    const router = useRouter();
    const { userSet } = useUserStore(state => state);

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
        resolver: zodResolver(signupSchema),
    });

    const onSubmit: SubmitHandler<Inputs> = async ({ name, email, password }) => {
        const response = await fetch("/api/users/signup", {
            method: "POST",
            body: JSON.stringify({ name, email, password }),
            credentials: "include",
        });
        const { success, data, error } = await response.json();

        if (success) {
            userSet(data);
            toast.success("Signed up successfully!");
            router.push("/");
        } else {
            console.log(error);
            toast.error(error);
        }
    }

    return (
        <main className="flex items-center justify-center p-5">
            <Card className="w-80 md:w-100">
                <CardHeader>
                    <CardTitle>Sign Up</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Full Name</FieldLabel>
                                        <Input aria-invalid={fieldState.invalid} placeholder="John Doe" { ...field } type="text" />
                                        {
                                            fieldState.invalid && (<FieldError errors={[fieldState.error]} />)
                                        }
                                    </Field>
                                )}
                                name="name"
                                control={form.control}
                            />
                            <Controller
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Email</FieldLabel>
                                        <Input aria-invalid={fieldState.invalid} placeholder="john@doe.com" { ...field } type="email" />
                                        {
                                            fieldState.invalid && (<FieldError errors={[fieldState.error]} />)
                                        }
                                    </Field>
                                )}
                                name="email"
                                control={form.control}
                            />
                            <Controller
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel>Password</FieldLabel>
                                        <Input aria-invalid={fieldState.invalid} placeholder="********" { ...field } type="password" />
                                        {
                                            fieldState.invalid && (<FieldError errors={[fieldState.error]} />)
                                        }
                                    </Field>
                                )}
                                name="password"
                                control={form.control}
                            />
                            <Button type="submit">SIGN UP</Button>
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter className="flex items-center justify-center">
                    <p className="font-medium">Already have an account <Link href="/login" className="text-blue-500 font-bold">Login.</Link></p>
                </CardFooter>
            </Card>
        </main>
    )
}
