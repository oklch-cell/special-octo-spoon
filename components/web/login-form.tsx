"use client";

import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardFooter,
  Button,
  Input,
  Field,
  FieldLabel,
  FieldGroup,
  FieldError,
} from "@/components/ui";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { SubmitHandler } from "react-hook-form";
import { loginSchema } from "@/lib/zod-schema";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/stores";
import toast from "react-hot-toast";
import { useState } from "react";

type Inputs = {
  email: string;
  password: string;
};

export function LogInForm() {
  const router = useRouter();
  const { userSet } = useUser();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async ({ email, password }) => {
    setLoading(true);
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
    setLoading(false);
  };

  return (
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
                  <Input
                    aria-invalid={fieldState.invalid}
                    placeholder="john@doe.com"
                    {...field}
                    type="email"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
              name="email"
              control={form.control}
            />
            <Controller
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <Input
                    aria-invalid={fieldState.invalid}
                    placeholder="********"
                    {...field}
                    type="password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
              name="password"
              control={form.control}
            />
            <Button disabled={loading} type="submit">LOG IN</Button>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex items-center justify-center">
        <p className="font-medium">
          Don&apos;t have an account{" "}
          <Link href="/signup" className="text-blue-500 font-bold">
            Signup.
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
