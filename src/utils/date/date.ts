import { format, isValid, parseISO } from "date-fns";

export const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = parseISO(dateString);
  if (!isValid(date)) return "";
  return format(date, "dd MMM yyyy");
};
