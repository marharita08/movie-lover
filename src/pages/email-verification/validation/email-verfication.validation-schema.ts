import { z } from "zod";

import { EMAIL_REGEX, TranslationKey } from "@/const";

export const EmailVerificationValidationSchema = z.object({
  email: z
    .string()
    .min(1, { message: TranslationKey.VALIDATION_EMAIL_REQUIRED })
    .regex(EMAIL_REGEX, { message: TranslationKey.VALIDATION_EMAIL_INVALID }),
  code: z
    .string()
    .length(4, { message: TranslationKey.VALIDATION_CODE_INVALID }),
});

export type EmailVerificationValidationSchemaType = z.infer<
  typeof EmailVerificationValidationSchema
>;
