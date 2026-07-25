"use client";

import { Card, CardTitle, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel, FieldGroup, FieldError } from "@/components/ui/field";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { loginSchema } from "@/lib/zod-schema";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/providers/user-store-provider";
import toast from "react-hot-toast";

type Inputs = {
    email: string;
    password: string;
}

export default function LogInPage() {
    const router = useRouter();
    const { userSet } = useUserStore(state => state);

    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: zodResolver(loginSchema),
    });

    const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
        try {
            const response = await fetch("/api/users/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
                credentials: "include",
            });
            const { success, data, error } = await response.json();
            if (success) {
                userSet(data);
                router.push("/");
                toast.success("Logged in successfully!");
            } else {
                toast.error(error);
            }
        } catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
            }
        }
    }

    return (
        <main className="flex items-center justify-center p-5">
            <Card className="w-80 md:w-100">
                <CardHeader>
                    <CardTitle>Log In</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
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
                            <Button type="submit">LOG IN</Button>
                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter className="flex items-center justify-center">
                    <p className="font-medium">Don&apos;t have an account <Link href="/signup" className="text-blue-500 font-bold">Signup.</Link></p>
                </CardFooter>
            </Card>
        </main>
    );
}

