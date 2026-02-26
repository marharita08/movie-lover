export const ListStatus = {
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export type ListStatus = (typeof ListStatus)[keyof typeof ListStatus];
