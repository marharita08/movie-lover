import { z } from "zod";

export const OtpStepValidationSchema = z.object({
  code: z.string().min(4, { message: "Code must be 4 characters" }),
  email: z.string().min(1, { message: "Email is required" }),
});

export type OtpStepValidationSchemaType = z.infer<
  typeof OtpStepValidationSchema
>;
