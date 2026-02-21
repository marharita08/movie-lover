import { z } from "zod";

import { EMAIL_REGEX } from "@/const";

export const EmailVerificationValidationSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .regex(EMAIL_REGEX, { message: "Invalid email" }),
  code: z.string().min(4, { message: "Code must be 4 characters" }),
});

export type EmailVerificationValidationSchemaType = z.infer<
  typeof EmailVerificationValidationSchema
>;
