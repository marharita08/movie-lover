import { zodResolver } from "@hookform/resolvers/zod";
import {
  type FieldValues,
  type Resolver,
  useForm,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";
import { type ZodType } from "zod";

type UseAppFormProps<T extends FieldValues> = Omit<
  UseFormProps<T>,
  "resolver"
> & {
  schema: ZodType<T>;
};

export const useAppForm = <T extends FieldValues>({
  schema,
  ...rest
}: UseAppFormProps<T>): UseFormReturn<T, unknown, T> => {
  return useForm<T, unknown, T>({
    ...rest,
    resolver: zodResolver(schema as ZodType<T, FieldValues>) as Resolver<
      T,
      unknown,
      T
    >,
  });
};
