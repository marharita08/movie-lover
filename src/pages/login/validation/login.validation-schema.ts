import { z } from "zod";

export const LoginValidationSchema = z.object({
  email: z.string().email({ message: "Email is required" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginValidationSchemaType = z.infer<typeof LoginValidationSchema>;
