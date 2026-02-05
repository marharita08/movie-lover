import { MutationKey, RouterKey } from "@/const";
import { authService } from "@/services/auth.service";
import { useAppMutation } from "./useAppMutation";
import { toast } from "./useToast";
import { useNavigate } from "react-router-dom";

export const useSignUp = () => {
  const navigate = useNavigate();

  return useAppMutation([MutationKey.SIGNUP], {
    mutationFn: authService.signup,
    onSuccess: (data) => {
      navigate(RouterKey.EMAIL_VERIFICATION);
      toast({
        title: data.message,
        variant: "success",
      });
    },
  });
};
