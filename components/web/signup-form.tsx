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
import { signupSchema } from "@/lib/zod-schema";
import type { SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from "@/stores";
import toast from "react-hot-toast";
import { useState } from "react";

type Inputs = {
  name: string;
  email: string;
  password: string;
};

export function SignUpForm() {
  const router = useRouter();
  const { userSet } = useUser();
  const [loading, setLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(signupSchema),
  });

  const onSubmit: SubmitHandler<Inputs> = async ({ name, email, password }) => {
    setLoading(true);
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
    setLoading(false);
  };

  return (
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
                  <Input
                    aria-invalid={fieldState.invalid}
                    placeholder="John Doe"
                    {...field}
                    type="text"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
              name="name"
              control={form.control}
            />
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
            <Button disabled={loading} type="submit">SIGN UP</Button>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex items-center justify-center">
        <p className="font-medium">
          Already have an account{" "}
          <Link href="/login" className="text-blue-500 font-bold">
            Login.
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
