import { MutationKey } from "@/const/mutation-key";
import { useAppMutation } from "./useAppMutation";
import { authService } from "@/services/auth.service";

export const useLogin = () =>
  useAppMutation([MutationKey.LOGIN], {
    mutationFn: authService.login,
  });
