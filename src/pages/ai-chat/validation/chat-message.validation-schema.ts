import z from "zod";

import { TranslationKey } from "@/const";

export const chatMessageValidationSchema = z.object({
  message: z
    .string()
    .min(1, { message: TranslationKey.VALIDATION_MESSAGE_REQUIRED }),
});

export type ChatMessageValidationSchema = z.infer<
  typeof chatMessageValidationSchema
>;
