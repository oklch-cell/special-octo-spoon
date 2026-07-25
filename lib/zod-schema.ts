import { z } from "zod";

export const signupSchema = z.object({
    name: z.string().min(3, "Name should be at least 3 characters long."),
    email: z.email(),
    password: z.string().min(8, "Password should be at least 8 characters long."),
});

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8, "Password should be at least 8 characters long."),
});
