import { z } from "zod";

import { TranslationKey } from "@/const";

export const CreateListValidationSchema = z.object({
  name: z
    .string()
    .min(1, { message: TranslationKey.VALIDATION_NAME_REQUIRED })
    .max(255, {
      message: TranslationKey.VALIDATION_NAME_MAX,
    }),
  fileId: z
    .string()
    .min(1, { message: TranslationKey.VALIDATION_FILE_REQUIRED })
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, {
      message: TranslationKey.VALIDATION_FILE_ID_INVALID,
    }),
});

export type CreateListValidationSchemaType = z.infer<
  typeof CreateListValidationSchema
>;
