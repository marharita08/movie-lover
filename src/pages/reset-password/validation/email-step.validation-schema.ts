import { z } from "zod";

export const EmailStepValidationSchema = z.object({
  email: z.string().email(),
});

export type EmailStepValidationSchemaType = z.infer<
  typeof EmailStepValidationSchema
>;
