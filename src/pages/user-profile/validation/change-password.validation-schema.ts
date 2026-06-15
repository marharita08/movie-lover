import { z } from "zod";

import { PASSWORD_REGEX, TranslationKey } from "@/const";

export const ChangePasswordValidationSchema = z
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
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: TranslationKey.VALIDATION_PASSWORD_MATCH,
    path: ["confirmPassword"],
  });

export type ChangePasswordValidationSchemaType = z.infer<
  typeof ChangePasswordValidationSchema
>;
