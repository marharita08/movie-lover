import { z } from "zod";

export const LoginValidationSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export type LoginValidationSchemaType = z.infer<typeof LoginValidationSchema>;
