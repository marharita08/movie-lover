import { z } from "zod";

import { EMAIL_REGEX } from "@/const";

export const EmailStepValidationSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .regex(EMAIL_REGEX, { message: "Email is invalid" }),
});

export type EmailStepValidationSchemaType = z.infer<
  typeof EmailStepValidationSchema
>;
