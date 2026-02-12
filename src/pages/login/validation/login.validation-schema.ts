import { z } from "zod";

import { EMAIL_REGEX } from "@/const";

export const LoginValidationSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .regex(EMAIL_REGEX, { message: "Email is invalid" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginValidationSchemaType = z.infer<typeof LoginValidationSchema>;
