import { z } from "zod";

export const OtpStepValidationSchema = z.object({
  code: z.string().min(4, { message: "Code must be 4 characters" }),
  email: z.string().email(),
});

export type OtpStepValidationSchemaType = z.infer<
  typeof OtpStepValidationSchema
>;
