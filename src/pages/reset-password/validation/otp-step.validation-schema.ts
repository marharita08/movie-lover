import { z } from "zod";

import { TranslationKey } from "@/const";

export const OtpStepValidationSchema = z.object({
  code: z
    .string()
    .length(4, { message: TranslationKey.VALIDATION_CODE_INVALID }),
  email: z
    .string()
    .min(1, { message: TranslationKey.VALIDATION_EMAIL_REQUIRED }),
});

export type OtpStepValidationSchemaType = z.infer<
  typeof OtpStepValidationSchema
>;
