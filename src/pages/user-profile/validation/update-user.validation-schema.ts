import { z } from "zod";

export const UpdateUserValidationSchema = z.object({
  name: z.string().min(1),
});

export type UpdateUserValidationSchemaType = z.infer<
  typeof UpdateUserValidationSchema
>;
