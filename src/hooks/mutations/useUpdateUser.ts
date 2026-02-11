import { useQueryClient } from "@tanstack/react-query";

import { MutationKey, QueryKey } from "@/const";
import type { UpdateUserValidationSchemaType } from "@/pages/user-profile";
import { authService } from "@/services/auth.service";

import { useAppMutation } from "../useAppMutation";
import { toast } from "../useToast";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useAppMutation([MutationKey.UPDATE_USER], {
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateUserValidationSchemaType;
    }) => authService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.CURRENT_USER] });
      toast({
        title: "Your profile data has been updated successfully",
        variant: "success",
      });
    },
  });
};
