import { z } from "zod";

export const EmailVerificationValidationSchema = z.object({
  email: z.string().email(),
  code: z.string().min(4, { message: "Code must be 4 characters" }),
});

export type EmailVerificationValidationSchemaType = z.infer<
  typeof EmailVerificationValidationSchema
>;
