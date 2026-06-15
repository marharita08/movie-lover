import { useQueryClient } from "@tanstack/react-query";

import { MutationKey, QueryKey, TranslationKey } from "@/const";
import { useTranslation } from "@/hooks";
import { authService } from "@/services";

import { useAppMutation } from "../../use-app-mutation/useAppMutation";
import { toast } from "../../use-toast/useToast";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useAppMutation([MutationKey.UPDATE_USER], {
    mutationFn: authService.updateUser,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QueryKey.CURRENT_USER] });

      const isOnlyLanguageUpdate =
        Object.keys(variables).length === 1 && "language" in variables;

      if (!isOnlyLanguageUpdate) {
        toast({
          title: t(TranslationKey.USER_PROFILE_UPDATE_SUCCESS),
          variant: "success",
        });
      }
    },
  });
};
