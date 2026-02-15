import { z } from "zod";

export const CreateListValidationSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  fileId: z.string().min(1, { message: "File is required" }),
});

export type CreateListValidationSchemaType = z.infer<
  typeof CreateListValidationSchema
>;
