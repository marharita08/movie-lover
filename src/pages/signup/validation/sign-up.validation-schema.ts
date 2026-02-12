import { z } from "zod";

import { EMAIL_REGEX, PASSWORD_REGEX } from "@/const";

export const SignUpValidationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .regex(EMAIL_REGEX, { message: "Email is invalid" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(PASSWORD_REGEX, {
      message:
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
    }),
});

export type SignUpValidationSchemaType = z.infer<typeof SignUpValidationSchema>;
