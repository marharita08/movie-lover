import { useGoogleLogin } from "@react-oauth/google";

import { Button, GoogleIcon } from "@/components";
import { TranslationKey } from "@/const";
import { toast, useLoginWithGoogle, useTranslation } from "@/hooks";
import { cn } from "@/utils";

interface LoginWithGoogleProps {
  label?: string;
  className?: string;
}

export const LoginWithGoogleButton: React.FC<LoginWithGoogleProps> = ({
  label,
  className,
}) => {
  const { t } = useTranslation();
  const loginWithGoogleMutation = useLoginWithGoogle();
  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async ({ code }) => {
      loginWithGoogleMutation.mutate({ code });
    },
    onError: () => {
      toast({
        title: t(TranslationKey.COMMON_ERROR),
        description: t(TranslationKey.AUTH_LOGIN_FAILED),
        variant: "destructive",
      });
    },
  });

  return (
    <Button
      type="button"
      onClick={() => login()}
      variant={"outline"}
      className={cn("w-full", className)}
    >
      <GoogleIcon />
      {label || t(TranslationKey.AUTH_LOGIN_WITH_GOOGLE)}
    </Button>
  );
};
