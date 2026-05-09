import { z } from "zod";

import { PASSWORD_REGEX, TranslationKey } from "@/const";

export const NewPasswordStepValidationSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: TranslationKey.VALIDATION_PASSWORD_MIN })
      .regex(PASSWORD_REGEX, {
        message: TranslationKey.VALIDATION_PASSWORD_STRENGTH,
      }),
    confirmPassword: z
      .string()
      .min(1, { message: TranslationKey.VALIDATION_PASSWORD_REQUIRED }),
    email: z
      .string()
      .min(1, { message: TranslationKey.VALIDATION_EMAIL_REQUIRED }),
    token: z.string().min(1, { message: TranslationKey.VALIDATION_REQUIRED }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: TranslationKey.VALIDATION_PASSWORD_MATCH,
    path: ["confirmPassword"],
  });

export type NewPasswordStepValidationSchemaType = z.infer<
  typeof NewPasswordStepValidationSchema
>;
