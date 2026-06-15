import { z } from "zod";

import { EMAIL_REGEX, TranslationKey } from "@/const";

export const EmailStepValidationSchema = z.object({
  email: z
    .string()
    .min(1, { message: TranslationKey.VALIDATION_EMAIL_REQUIRED })
    .regex(EMAIL_REGEX, { message: TranslationKey.VALIDATION_EMAIL_INVALID }),
});

export type EmailStepValidationSchemaType = z.infer<
  typeof EmailStepValidationSchema
>;
