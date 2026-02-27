import type { ListStatus } from "@/const/list-status";

export interface ListResponse {
  id: string;
  name: string;
  fileId: string;
  status: ListStatus;
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
}
