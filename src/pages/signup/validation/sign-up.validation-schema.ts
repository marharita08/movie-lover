import { z } from "zod";

import { EMAIL_REGEX, PASSWORD_REGEX, TranslationKey } from "@/const";

export const SignUpValidationSchema = z.object({
  name: z.string().min(1, { message: TranslationKey.VALIDATION_NAME_REQUIRED }),
  email: z
    .string()
    .min(1, { message: TranslationKey.VALIDATION_EMAIL_REQUIRED })
    .regex(EMAIL_REGEX, { message: TranslationKey.VALIDATION_EMAIL_INVALID }),
  password: z
    .string()
    .min(8, { message: TranslationKey.VALIDATION_PASSWORD_MIN })
    .regex(PASSWORD_REGEX, {
      message: TranslationKey.VALIDATION_PASSWORD_STRENGTH,
    }),
  language: z.string().min(1, { message: TranslationKey.VALIDATION_REQUIRED }),
});

export type SignUpValidationSchemaType = z.infer<typeof SignUpValidationSchema>;
