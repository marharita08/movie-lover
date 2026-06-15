import { z } from "zod";

import { EMAIL_REGEX, TranslationKey } from "@/const";

export const LoginValidationSchema = z.object({
  email: z
    .string()
    .min(1, { message: TranslationKey.VALIDATION_EMAIL_REQUIRED })
    .regex(EMAIL_REGEX, { message: TranslationKey.VALIDATION_EMAIL_INVALID }),
  password: z
    .string()
    .min(1, { message: TranslationKey.VALIDATION_PASSWORD_REQUIRED }),
});

export type LoginValidationSchemaType = z.infer<typeof LoginValidationSchema>;
