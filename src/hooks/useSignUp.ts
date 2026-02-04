import { MutationKey } from "@/const";
import { authService } from "@/services/auth.service";
import { useAppMutation } from "./useAppMutation";
import { toast } from "./useToast";

export const useSignUp = () => {
  return useAppMutation([MutationKey.SIGNUP], {
    mutationFn: authService.signup,
    onSuccess: (data) => {
      toast({
        title: data.message,
        variant: "success",
      });
    },
  });
};
