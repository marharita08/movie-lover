import { z } from "zod";

export const CreateListValidationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  fileId: z
    .string()
    .min(1, { message: "File is required" })
    .regex(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, {
      message: "Invalid file id",
    }),
});

export type CreateListValidationSchemaType = z.infer<
  typeof CreateListValidationSchema
>;
