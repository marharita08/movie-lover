import z from "zod";

export const chatMessageValidationSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
});

export type ChatMessageValidationSchema = z.infer<
  typeof chatMessageValidationSchema
>;
