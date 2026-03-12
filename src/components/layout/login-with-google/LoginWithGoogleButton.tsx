import { useGoogleLogin } from "@react-oauth/google";

import { Button, GoogleIcon } from "@/components";
import { toast, useLoginWithGoogle } from "@/hooks";
import { cn } from "@/utils";

interface LoginWithGoogleProps {
  label?: string;
  className?: string;
}

export const LoginWithGoogleButton: React.FC<LoginWithGoogleProps> = ({
  label,
  className,
}) => {
  const loginWithGoogleMutation = useLoginWithGoogle();
  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async ({ code }) => {
      loginWithGoogleMutation.mutate({ code });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Login failed",
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
      {label || "Login with Google"}
    </Button>
  );
};
