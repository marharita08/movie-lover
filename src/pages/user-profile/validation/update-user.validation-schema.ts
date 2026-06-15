import { z } from "zod";

import { Language, TranslationKey } from "@/const";

export const UpdateUserValidationSchema = z.object({
  name: z
    .string()
    .min(1, { message: TranslationKey.VALIDATION_NAME_REQUIRED })
    .optional(),
  language: z.enum([Language.ENGLISH, Language.UKRAINIAN]).optional(),
});

export type UpdateUserValidationSchemaType = z.infer<
  typeof UpdateUserValidationSchema
>;
