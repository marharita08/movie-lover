import { z } from "zod";

export const SignUpValidationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export type SignUpValidationSchemaType = z.infer<typeof SignUpValidationSchema>;
